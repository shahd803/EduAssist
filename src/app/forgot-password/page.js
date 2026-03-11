"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/lib/api";
import styles from "@/components/landing/EduAssistAuth.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await forgotPassword(email.trim());
      setMessage(
        typeof response === "string"
          ? response
          : response?.message || "If the email exists, a reset link was sent."
      );
    } catch (submitError) {
      setError(submitError.message || "Unable to send reset link.");
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
          <p className={styles.eyebrow}>Password reset</p>
          <h1 className={styles.title}>Get a new sign-in link started.</h1>
          <p className={styles.description}>
            Enter the email address tied to your account and we will send a reset link if it exists.
          </p>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <p className={styles.panelTitle}>Reset password</p>
            <Link href="/login" className={styles.homeLink}>
              Back to login
            </Link>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <label className={styles.field}>
                <span>Email address</span>
                <input
                  name="email"
                  type="email"
                  placeholder="teacher@school.edu"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>
            </div>

            {error ? <p className={styles.error}>{error}</p> : null}
            {message ? <p className={styles.success}>{message}</p> : null}

            <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
