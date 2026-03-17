"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";
import { getQuizzes } from "@/lib/api";

const parseQuestionCount = (quiz) => {
  if (Array.isArray(quiz?.questions)) {
    return quiz.questions.length;
  }

  if (typeof quiz?.questionsJson === "string" && quiz.questionsJson.trim()) {
    try {
      const parsed = JSON.parse(quiz.questionsJson);
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  }

  return 0;
};

const normalizeQuiz = (quiz, index) => {
  const quizId = quiz?.quizId || quiz?.id || `quiz-${index}`;
  const title = quiz?.title || `Quiz ${index + 1}`;
  const status = String(quiz?.status || "DRAFT").toUpperCase();
  const createdAt = quiz?.createdAt || quiz?.updatedAt || null;
  const reviewStatus = String(quiz?.reviewStatus || "PENDING").toUpperCase();
  const materialTitle = quiz?.material?.title || quiz?.materialTitle || "Uploaded material";

  return {
    quizId,
    title,
    status,
    reviewStatus,
    createdAt,
    materialTitle,
    questionCount: parseQuestionCount(quiz),
  };
};

const sortQuizList = (quizzes, sortBy) => {
  const list = [...quizzes];

  switch (sortBy) {
    case "oldest":
      return list.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    case "title":
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case "recent":
    default:
      return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }
};

const formatDate = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function MyTestsPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadQuizzes = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getQuizzes();
        const nextQuizzes = Array.isArray(response)
          ? response
          : Array.isArray(response?.quizzes)
            ? response.quizzes
            : [];

        if (!isMounted) return;
        setQuizzes(nextQuizzes.map(normalizeQuiz));
      } catch (loadError) {
        if (!isMounted) return;
        setError(loadError.message || "Unable to load generated tests.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadQuizzes();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredQuizzes = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const visibleQuizzes = quizzes.filter((quiz) => {
      const matchesSearch =
        !normalizedSearch ||
        quiz.title.toLowerCase().includes(normalizedSearch) ||
        quiz.materialTitle.toLowerCase().includes(normalizedSearch);

      const matchesStatus = !statusFilter || quiz.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return sortQuizList(visibleQuizzes, sortBy);
  }, [quizzes, searchTerm, sortBy, statusFilter]);

  const draftCount = quizzes.filter((quiz) => quiz.status === "DRAFT").length;
  const finalCount = quizzes.filter((quiz) => quiz.status === "FINAL").length;

  return (
    <div className="app">
      <Topbar />

      <main className="content">
        <section className="panel settings-panel">
          <div className="panel-header">
            <div>
              <h2>My Tests</h2>
              <p className="muted">View, filter, and manage all generated assessments.</p>
            </div>
            <div className="button-stack">
              <Link href="/app" className="btn btn-primary">Create New Test</Link>
            </div>
          </div>

          <div className="settings-grid">
            <section className="settings-card">
              <h3>Filters</h3>
              <label className="field">
                <span className="label">Search by title</span>
                <input
                  type="text"
                  placeholder="e.g. Unit 3 Quiz"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </label>
              <label className="field">
                <span className="label">Status</span>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="">All statuses</option>
                  <option value="DRAFT">Draft</option>
                  <option value="FINAL">Final</option>
                </select>
              </label>
              <label className="field">
                <span className="label">Sort by</span>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  <option value="recent">Most recent</option>
                  <option value="oldest">Oldest</option>
                  <option value="title">Title A-Z</option>
                </select>
              </label>
            </section>

            <section className="settings-card">
              <h3>Summary</h3>
              <div className="detail-row">
                <span className="label">Total tests</span>
                <span>{quizzes.length}</span>
              </div>
              <div className="detail-row">
                <span className="label">Drafts</span>
                <span>{draftCount}</span>
              </div>
              <div className="detail-row">
                <span className="label">Final</span>
                <span>{finalCount}</span>
              </div>
            </section>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Test Library</h2>
              <p className="muted">Generated tests from your account appear here.</p>
            </div>
          </div>

          {error ? (
            <div className="export-error">
              <p>{error}</p>
            </div>
          ) : null}

          {isLoading ? (
            <div className="empty-state">
              <p>Loading generated tests...</p>
            </div>
          ) : null}

          {!isLoading && filteredQuizzes.length > 0 ? (
            <div className="materials-list">
              {filteredQuizzes.map((quiz) => (
                <div key={quiz.quizId} className="material-row">
                  <div>
                    <p className="material-title">{quiz.title}</p>
                    <p className="muted">{quiz.materialTitle}</p>
                  </div>
                  <div className="status-stack">
                    <span className={`status-pill ${quiz.status === "FINAL" ? "success" : "muted"}`}>
                      {quiz.status}
                    </span>
                    <span className="label">{quiz.reviewStatus}</span>
                  </div>
                  <div className="status-stack">
                    <span className="label">Questions</span>
                    <span>{quiz.questionCount}</span>
                  </div>
                  <div className="status-stack">
                    <span className="label">Created</span>
                    <span>{formatDate(quiz.createdAt)}</span>
                  </div>
                  <div className="button-stack">
                    <button type="button" className="btn btn-outline small" disabled>
                      Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {!isLoading && !error && filteredQuizzes.length === 0 ? (
            <div className="empty-state">
              <p>No tests available yet. Generate a test to populate this page.</p>
              <Link href="/app" className="btn btn-primary">Go to Generator</Link>
            </div>
          ) : null}
        </section>
      </main>

      <Footer />
    </div>
  );
}
