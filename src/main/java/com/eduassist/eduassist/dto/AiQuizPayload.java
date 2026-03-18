package com.eduassist.eduassist.dto;

import java.util.List;

public class AiQuizPayload {
    public List<AiQuestion> questions;

    public static class AiQuestion {
        public String questionType;   // "MCQ"
        public String prompt;
        public String explanation;
        public Integer points;
        public List<AiOption> options;
    }

    public static class AiOption {
        public String optionText;
        public Boolean isCorrect;
    }
}
