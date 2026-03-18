package com.eduassist.eduassist.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntime(RuntimeException ex) {
        String msg = ex.getMessage() == null ? "" : ex.getMessage();

        if (msg.contains("Gemini error 429") || msg.contains("RESOURCE_EXHAUSTED") || msg.contains("TOO_MANY_REQUESTS")) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(
                    Map.of(
                            "error", "GEMINI_QUOTA_EXCEEDED",
                            "message", "Gemini quota exceeded. Enable billing / check quotas for your Google project.",
                            "details", msg
                    )
            );
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("error", "INTERNAL_ERROR", "message", msg)
        );
    }
}

