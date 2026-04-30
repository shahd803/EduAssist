import React from "react";
import Link from "next/link";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  return (
    <div className={styles.landing}>

      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>EduAssist AI</div>
      </nav>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div>
          <h1>The AI Teacher Assistant for Smarter Teaching</h1>
          <p>
            Boost your teaching efficiency with AI-powered tools to manage
            classrooms, create quizzes, and analyze student performance.
          </p>
          <div className={styles.heroActions}>
            <Link href="/login" className={styles.secondaryBtn}>
              Log In
            </Link>
            <Link href="/signup" className={styles.primaryBtn}>
              Sign Up
            </Link>
          </div>
          <span className={styles.note}>No credit card required</span>
        </div>
      </section>

            {/* Features Section */}
      <section id="features" className={styles.features}>
        <h2>How EduAssist AI Helps Teachers</h2>

        <div className={styles.featureCards}>
          <div className={styles.card}>
            <h3>Generate Quizzes Instantly</h3>
            <p>
              Create custom quizzes in seconds with AI-generated questions
              tailored to your lessons.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Multiple Question Types</h3>
            <p>
              Choose from multiple-choice, true/false, and short answer
                questions to match your teaching style.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Export & Share Easily</h3>
            <p>
              Download your quizzes or share them with students and colleagues
             directly from the app.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}



