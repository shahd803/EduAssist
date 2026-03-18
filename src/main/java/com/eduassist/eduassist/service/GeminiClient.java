package com.eduassist.eduassist.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiClient {

    private final WebClient webClient;
    private final ObjectMapper mapper = new ObjectMapper();

    private final String apiKey;
    private final String model;

    public GeminiClient(
            @Value("${gemini.api.key}") String apiKey,
            @Value("${gemini.base-url}") String baseUrl,
            @Value("${gemini.model}") String model
    ) {
        this.apiKey = apiKey;
        this.model = model;

        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public String generateQuizJson(
            String materialText,
            int numQuestions,
            List<String> selectedTypes,
            boolean regenerate
    ) {

        // ================= VALIDATION =================

        if (apiKey == null || apiKey.isBlank())
            throw new IllegalStateException("Gemini API key is missing.");

        if (model == null || model.isBlank())
            throw new IllegalStateException("Gemini model is missing.");

        if (model.startsWith("models/"))
            throw new IllegalStateException("gemini.model must NOT start with 'models/'.");

        if (numQuestions <= 0)
            throw new IllegalArgumentException("numQuestions must be >= 1.");

        if (materialText == null || materialText.isBlank())
            throw new IllegalArgumentException("Material text cannot be empty.");

        if (selectedTypes == null || selectedTypes.isEmpty())
            throw new IllegalArgumentException("At least one question type must be selected.");

        // ================= DISTRIBUTION =================

        Map<String, Integer> distribution =
                computeEvenDistribution(numQuestions, selectedTypes);

        StringBuilder distributionInstructions = new StringBuilder();
        distribution.forEach((type, count) ->
                distributionInstructions.append("- ")
                        .append(count)
                        .append(" ")
                        .append(type)
                        .append(" question(s)\n")
        );

        // ================= REGENERATE INSTRUCTION =================

        String regenerationInstruction = "";

        if (regenerate) {
            regenerationInstruction = """
The user was NOT satisfied with the previous quiz.

Regenerate a COMPLETELY NEW set of questions.
Do NOT repeat previous questions.
Use different wording and concepts if possible.
""";
        }

        // ================= PROMPT =================

        String prompt = """
You are an educational AI.

%s

Return ONLY valid JSON.
No markdown.
No explanations outside JSON.

Generate EXACTLY %d questions.

Question type distribution:
%s

STRICT RULES:

MCQ:
- questionType = "MCQ"
- Exactly 4 options
- Exactly 1 option must have "isCorrect": true
- The other 3 must have "isCorrect": false

TRUE_FALSE:
- questionType = "TRUE_FALSE"
- Exactly 2 options:
  - "True"
  - "False"
- Exactly 1 correct

SHORT_ANSWER:
- questionType = "SHORT_ANSWER"
- "options" MUST be an empty array []

Each question MUST include:
- questionType
- prompt
- explanation
- points
- options (even if empty)

Return JSON in this EXACT format:

{
  "questions": [
    {
      "questionType": "MCQ",
      "prompt": "Question text",
      "explanation": "Why correct",
      "points": 1,
      "options": [
        {
          "optionText": "text",
          "isCorrect": true
        }
      ]
    }
  ]
}

If the output does not follow all rules exactly, regenerate internally before responding.

Material:
%s
""".formatted(
                regenerationInstruction,
                numQuestions,
                distributionInstructions.toString(),
                materialText
        );

        // ================= REQUEST BODY =================

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of(
                                "role", "user",
                                "parts", List.of(Map.of("text", prompt))
                        )
                ),
                "generationConfig", Map.of(
                        "responseMimeType", "application/json",
                        "temperature", 0.2
                )
        );

        // ================= API CALL =================

        String rawResponse = webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/models/{model}:generateContent")
                        .queryParam("key", apiKey)
                        .build(model))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        resp -> resp.bodyToMono(String.class)
                                .map(err -> new RuntimeException(
                                        "Gemini error " + resp.statusCode() + ":\n" + err))
                )
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(90))
                .block();

        if (rawResponse == null || rawResponse.isBlank())
            throw new RuntimeException("Gemini returned empty HTTP response.");

        // ================= PARSE RESPONSE =================

        try {
            JsonNode root = mapper.readTree(rawResponse);

            JsonNode candidates = root.get("candidates");
            if (candidates == null || !candidates.isArray() || candidates.isEmpty())
                throw new RuntimeException("No candidates returned.\nRaw:\n" + rawResponse);

            JsonNode parts = candidates.get(0).path("content").path("parts");
            if (!parts.isArray() || parts.isEmpty())
                throw new RuntimeException("Missing content.parts.\nRaw:\n" + rawResponse);

            String text = parts.get(0).path("text").asText(null);

            if (text == null || text.isBlank())
                throw new RuntimeException("Gemini returned empty text.\nRaw:\n" + rawResponse);

            return text.trim();

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to parse Gemini response.\nRaw response:\n" + rawResponse, e);
        }
    }

    // ================= HELPER =================

    private Map<String, Integer> computeEvenDistribution(
            int total,
            List<String> types
    ) {
        int base = total / types.size();
        int remainder = total % types.size();

        Map<String, Integer> result = new LinkedHashMap<>();

        for (int i = 0; i < types.size(); i++) {
            int count = base + (i < remainder ? 1 : 0);
            result.put(types.get(i), count);
        }

        return result;
    }
}