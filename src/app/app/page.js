// Intent: Main app workflow page (generate tests, preview, export).
"use client";

import { useState } from "react";
import Topbar from "@/components/Topbar";
import Hero from "@/components/Hero";
import UploadPanel from "@/components/UploadPanel";
import GenerateTestPanel from "@/components/GenerateTestPanel";
import TestPreviewPanel from "@/components/TestPreviewPanel";
import ExportPanel from "@/components/ExportPanel";
import Footer from "@/components/Footer";
import { materials as initialMaterials, questions } from "@/data/sampleData";

const toTitleCase = (value) =>
  String(value || "")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const normalizeQuestionType = (typeValue, hasChoices) => {
  const raw = String(typeValue || "").trim().toLowerCase();
  if (raw === "mcq" || raw.includes("multiple")) return "Multiple-choice";
  if (raw.includes("short")) return "Short-answer";
  if (raw.includes("true") || raw.includes("false")) return "True/False";
  if (raw) return toTitleCase(raw);
  return hasChoices ? "Multiple-choice" : "Short-answer";
};

const normalizeQuestions = (inputQuestions) =>
  (Array.isArray(inputQuestions) ? inputQuestions : []).map((question, index) => {
    const optionList = Array.isArray(question?.options) ? question.options : [];
    const normalizedChoices = Array.isArray(question?.choices)
      ? question.choices.filter(Boolean)
      : optionList
          .map((option) => (typeof option === "string" ? option : option?.optionText))
          .filter(Boolean);
    const correctFromOptions = optionList.find((option) => option?.isCorrect)?.optionText;
    const hasChoices = normalizedChoices.length > 0;

    return {
      ...question,
      id: question?.id ?? `${question?.questionType ?? "question"}-${index}`,
      type: normalizeQuestionType(question?.type ?? question?.questionType, hasChoices),
      source: question?.source || "AI Generated",
      difficulty: toTitleCase(question?.difficulty ?? question?.level ?? "") || "Not set",
      choices: hasChoices ? normalizedChoices : null,
      correctChoice: question?.correctChoice ?? question?.correctAnswer ?? question?.answer ?? correctFromOptions ?? null,
      _clientKey: question?._clientKey || `${question?.id ?? "question"}-${index}`,
    };
  });

export default function AppPage() {
  const [materials, setMaterials] = useState(initialMaterials);
  const [generatedQuestions, setGeneratedQuestions] = useState(() => normalizeQuestions(questions));
  const [keptQuestionIds, setKeptQuestionIds] = useState([]);
  const [generatedQuizId, setGeneratedQuizId] = useState(null);

  const handleQuestionsGenerated = (generationResult) => {
    const nextQuestions = Array.isArray(generationResult)
      ? generationResult
      : generationResult?.questions;

    setGeneratedQuestions(normalizeQuestions(nextQuestions));
    setKeptQuestionIds([]);
    setGeneratedQuizId(
      Array.isArray(generationResult) ? null : generationResult?.quizId ?? null
    );
  };

  const handleToggleKeep = (questionId) => {
    setKeptQuestionIds((current) =>
      current.includes(questionId)
        ? current.filter((id) => id !== questionId)
        : [...current, questionId]
    );
  };

  const handleQuestionUpdate = (updatedQuestion) => {
    setGeneratedQuestions((current) =>
      current.map((question) =>
        question._clientKey === updatedQuestion._clientKey ? updatedQuestion : question
      )
    );
  };

  return (
    <div className="app">
      <Topbar />
      <Hero />

      <main className="content">
        <UploadPanel materials={materials} onMaterialsChange={setMaterials} />
        <GenerateTestPanel
          materials={materials}
          onQuestionsGenerated={handleQuestionsGenerated}
        />
        <TestPreviewPanel
          questions={generatedQuestions}
          keptQuestionIds={keptQuestionIds}
          onToggleKeep={handleToggleKeep}
          onQuestionUpdate={handleQuestionUpdate}
          onQuestionsRegenerated={handleQuestionsGenerated}
        />
        <ExportPanel
          generatedQuizId={generatedQuizId}
          questions={generatedQuestions}
          keptQuestionIds={keptQuestionIds}
        />
      </main>

      <Footer />
    </div>
  );
}
