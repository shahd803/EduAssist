"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, signup } from "@/lib/api";
import styles from "./EduAssistAuth.module.css";

const copyByMode = {
  login: {
    eyebrow: "Teacher access",
    title: "Pick up where your planning left off.",
    description:
      "Log in to generate quizzes, manage materials, and track what your students need next.",
    cta: "Log In",
    altLabel: "New to EduAssist AI?",
    altAction: "Create an account",
    altHref: "/signup",
  },
  signup: {
    eyebrow: "Get started",
    title: "Create your EduAssist AI workspace.",
    description:
      "Set up your account and start building lesson-ready quizzes with the same workflow as the rest of the app.",
    cta: "Create Account",
    altLabel: "Already have an account?",
    altAction: "Log in",
    altHref: "/login",
  },
};

export default function EduAssistAuthPage({ mode = "login" }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const activeMode = mode === "signup" ? "signup" : "login";
  const activeCopy = copyByMode[activeMode];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (activeMode === "login") {
        await login({
          email: formData.email.trim(),
          password: formData.password,
        });
      } else {
        await signup({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        });

        await login({
          email: formData.email.trim(),
          password: formData.password,
        });
      }

      router.push("/app");
    } catch (submitError) {
      setError(submitError.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.shell}>
      <div className={styles.backdrop} />
      <div className={styles.layout}>
        <section className={styles.marketing}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark}>EA</span>
            <span>EduAssist AI</span>
          </Link>
          <p className={styles.eyebrow}>{activeCopy.eyebrow}</p>
          <h1 className={styles.title}>{activeCopy.title}</h1>
          <p className={styles.description}>{activeCopy.description}</p>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <p className={styles.panelTitle}>{activeCopy.cta}</p>
            <Link href="/" className={styles.homeLink}>
              Back to landing page
            </Link>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              {activeMode === "signup" ? (
                <label className={styles.field}>
                  <span>Full name</span>
                  <input
                    name="name"
                    type="text"
                    placeholder="Jane Teacher"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </label>
              ) : null}

              <label className={styles.field}>
                <span>Email address</span>
                <input
                  name="email"
                  type="email"
                  placeholder="teacher@school.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className={styles.field}>
                <span>Password</span>
                <input
                  name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={activeMode === "signup" ? 8 : undefined}
                    required
                  />
                </label>
            </div>

            {error ? <p className={styles.error}>{error}</p> : null}

            <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
              {isSubmitting ? "Please wait..." : activeCopy.cta}
            </button>
          </form>

          <p className={styles.altAction}>
            {activeCopy.altLabel}{" "}
            <Link href={activeCopy.altHref}>
              {activeCopy.altAction}
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
