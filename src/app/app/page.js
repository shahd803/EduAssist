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

export default function AppPage() {
  const [materials, setMaterials] = useState(initialMaterials);
  const [generatedQuestions, setGeneratedQuestions] = useState(questions);
  const [keptQuestionIds, setKeptQuestionIds] = useState([]);

  const handleQuestionsGenerated = (nextQuestions) => {
    setGeneratedQuestions(nextQuestions);
    setKeptQuestionIds([]);
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
        question.id === updatedQuestion.id ? updatedQuestion : question
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
        />
        <ExportPanel questions={generatedQuestions} keptQuestionIds={keptQuestionIds} />
      </main>

      <Footer />
    </div>
  );
}
