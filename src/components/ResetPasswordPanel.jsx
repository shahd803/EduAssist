"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/api";
import styles from "@/components/landing/EduAssistAuth.module.css";

export default function ResetPasswordPanel({ token }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasToken = Boolean(token);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!hasToken) {
      setError("Reset link is missing a token. Request a new password reset link.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await resetPassword(token, password);
      setMessage(
        typeof response === "string"
          ? response
          : response?.message || "Password updated successfully."
      );
      setPassword("");
      setConfirmPassword("");
    } catch (submitError) {
      setError(submitError.message || "Unable to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <p className={styles.panelTitle}>Choose a new password</p>
        <Link href="/login" className={styles.homeLink}>
          Back to login
        </Link>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fieldGroup}>
          <label className={styles.field}>
            <span>New password</span>
            <input
              name="password"
              type="password"
              placeholder="Enter a new password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
              disabled={!hasToken || Boolean(message)}
            />
          </label>

          <label className={styles.field}>
            <span>Confirm password</span>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={8}
              required
              disabled={!hasToken || Boolean(message)}
            />
          </label>
        </div>

        {!hasToken ? (
          <p className={styles.error}>
            Reset link is missing a token. Request a new password reset link.
          </p>
        ) : null}
        {error ? <p className={styles.error}>{error}</p> : null}
        {message ? <p className={styles.success}>{message}</p> : null}

        {message ? (
          <Link href="/login" className={styles.primaryButton}>
            Log In
          </Link>
        ) : (
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={isSubmitting || !hasToken}
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        )}
      </form>
    </section>
  );
}
