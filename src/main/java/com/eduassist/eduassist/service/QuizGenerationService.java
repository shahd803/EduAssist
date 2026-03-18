package com.eduassist.eduassist.service;

import com.eduassist.eduassist.dto.AiQuizPayload;
import com.eduassist.eduassist.entity.*;
import com.eduassist.eduassist.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class QuizGenerationService {

    private final MaterialContentService materialContentService;
    private final GeminiClient geminiClient;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final OptionItemRepository optionItemRepository;
    private final CurrentUserService currentUserService;

    private final ObjectMapper mapper = new ObjectMapper();

    public QuizGenerationService(
            QuizRepository quizRepository,
            QuestionRepository questionRepository,
            OptionItemRepository optionItemRepository,
            MaterialContentService materialContentService,
            GeminiClient geminiClient,
            CurrentUserService currentUserService) {

        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.optionItemRepository = optionItemRepository;
        this.materialContentService = materialContentService;
        this.geminiClient = geminiClient;
        this.currentUserService = currentUserService;
    }

    // ================= REFINE QUIZ =================


    @Transactional
    public Quiz generateQuizPublic(Material material,
                                   Map<String, Object> options,
                                   Authentication auth) {

        String materialText = materialContentService.extractText(material);
        if (materialText == null) materialText = "";
        materialText = materialText.trim();

        if (materialText.length() > 12000) {
            materialText = materialText.substring(0, 12000);
        }

        int questionCount = 5;

        if (options != null) {

            Object value = options.get("questionCount");

            if (value == null) {
                value = options.get("numberOfQuestions");
            }

            if (value instanceof Number) {
                questionCount = ((Number) value).intValue();
            }
        }

        List<String> selectedTypes = new ArrayList<>();

        if (options != null) {

            Object typesObj = options.get("questionTypes");

            if (typesObj instanceof List<?>) {
                for (Object obj : (List<?>) typesObj) {
                    if (obj != null) {
                        selectedTypes.add(obj.toString());
                    }
                }
            }
        }

        if (selectedTypes.isEmpty()) {
            selectedTypes.add("MCQ");
        }

        // ================= CALL GEMINI =================

        String aiJson = geminiClient.generateQuizJson(
                materialText,
                questionCount,
                selectedTypes,
                false
        );

        if (aiJson == null || aiJson.isBlank()) {
            throw new RuntimeException("AI returned empty response");
        }

        aiJson = aiJson.trim();

        int start = aiJson.indexOf('{');
        int end = aiJson.lastIndexOf('}');

        if (start == -1 || end == -1 || end <= start) {
            throw new RuntimeException("AI response does not contain valid JSON");
        }

        String cleanJson = aiJson.substring(start, end + 1);

        AiQuizPayload payload;

        try {
            payload = mapper.readValue(cleanJson, AiQuizPayload.class);
        } catch (Exception e) {
            throw new RuntimeException("AI JSON parsing failed", e);
        }

        if (payload.questions == null || payload.questions.isEmpty()) {
            throw new RuntimeException("AI returned no questions");
        }

        // ================= GET USER =================

        AppUser user = currentUserService.getCurrentUser(auth);

        // ================= CREATE QUIZ =================

        Quiz quiz = new Quiz();
        quiz.setMaterial(material);
        quiz.setUser(user);
        quiz.setTitle("Quiz for: " + material.getTitle());
        quiz.setStatus("DRAFT");
        quiz.setReviewStatus("PENDING");
        quiz.setVersion(1);

        try {
            quiz.setQuestionsJson(
                    mapper.writeValueAsString(payload.questions)
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to store questions JSON", e);
        }

        quiz = quizRepository.save(quiz);

        // ================= SAVE QUESTIONS =================

        saveQuestions(payload, quiz);

        return quiz;
    }

    // ================= EXPORT QUIZ =================

    @Transactional
    public Quiz exportQuiz(Authentication auth) {

        AppUser user = currentUserService.getCurrentUser(auth);

        List<Quiz> quizzes =
                quizRepository.findByUser_UserId(user.getUserId());

        if (quizzes.isEmpty()) {
            throw new RuntimeException("No quiz found to export");
        }

        Quiz quiz = quizzes.get(quizzes.size() - 1);

        if ("FINAL".equals(quiz.getStatus())) {
            throw new RuntimeException("Quiz already exported");
        }

        quiz.setStatus("FINAL");

        return quizRepository.save(quiz);
    }

    // ================= SAVE QUESTIONS HELPER =================

    private void saveQuestions(AiQuizPayload payload, Quiz quiz) {

        for (AiQuizPayload.AiQuestion aq : payload.questions) {

            if (aq.prompt == null || aq.prompt.isBlank()) continue;

            Question question = new Question();

            question.setQuiz(quiz);
            question.setQuestionType(
                    aq.questionType == null ? "MCQ" : aq.questionType
            );
            question.setPrompt(aq.prompt);
            question.setExplanation(aq.explanation);
            question.setPoints(aq.points == null ? 1 : aq.points);

            question = questionRepository.save(question);

            if (aq.options != null) {

                for (AiQuizPayload.AiOption ao : aq.options) {

                    if (ao.optionText == null || ao.optionText.isBlank())
                        continue;

                    OptionItem option = new OptionItem();

                    option.setQuestion(question);
                    option.setOptionText(ao.optionText);
                    option.setCorrect(Boolean.TRUE.equals(ao.isCorrect));

                    optionItemRepository.save(option);
                }
            }
        }
    }
}