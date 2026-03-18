package com.eduassist.eduassist.controller;

import com.eduassist.eduassist.entity.Material;
import com.eduassist.eduassist.entity.Question;
import com.eduassist.eduassist.entity.Quiz;
import com.eduassist.eduassist.repository.MaterialRepository;
import com.eduassist.eduassist.service.QuizGenerationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/materials")
public class QuizController {

    private final QuizGenerationService quizGenerationService;
    private final MaterialRepository materialRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public QuizController(QuizGenerationService quizGenerationService,
                          MaterialRepository materialRepository) {
        this.quizGenerationService = quizGenerationService;
        this.materialRepository = materialRepository;
    }

    @PostMapping("/{materialId}/generate-quiz")
    public ResponseEntity<?> generateQuiz(
            @PathVariable UUID materialId,
            @RequestBody(required = false) Map<String, Object> options,
            Authentication auth
    ) {
        try {

            Material material = materialRepository.findById(materialId)
                    .orElseThrow(() ->
                            new RuntimeException("Material not found"));

            // 🔐 pass authenticated user
            Quiz quiz = quizGenerationService
                    .generateQuizPublic(material, options, auth);

            Object questions = objectMapper.readValue(
                    quiz.getQuestionsJson(),
                    Object.class
            );

            return ResponseEntity.ok(
                    Map.of("questions", questions)
            );

        } catch (Exception e) {
            return ResponseEntity.status(400)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    public ResponseEntity<?> exportQuiz(Authentication auth) {

        try {

            Quiz quiz = quizGenerationService.exportQuiz(auth);

            Object questions = objectMapper.readValue(
                    quiz.getQuestionsJson(),
                    Object.class
            );

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Quiz exported successfully",
                            "questions", questions
                    )
            );

        } catch (Exception e) {

            return ResponseEntity.status(400)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}