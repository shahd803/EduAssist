import React from "react";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">EduAssist AI</div>
        <ul className="nav-links">
          <li>Home</li>
          <li>Features</li>
          <li>Pricing</li>
          <li>Resources</li>
          <li>Login</li>
          <button className="signup-btn">Sign Up</button>
        </ul>
      </nav>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>The AI Teacher Assistant for Smarter Teaching</h1>
          <p>
            Boost your teaching efficiency with AI-powered tools to manage
            classrooms, create quizzes, and analyze student performance.
          </p>
          <button className="primary-btn">Get Started for Free</button>
          <span className="note">No credit card required</span>
        </div>
      </section>

            {/* Features Section */}
      <section className="features">
        <h2>How EduAssist AI Helps Teachers</h2>

        <div className="feature-cards">
          <div className="card">
            <h3>Generate Quizzes Instantly</h3>
            <p>
              Create custom quizzes in seconds with AI-generated questions
              tailored to your lessons.
            </p>
          </div>

          <div className="card">
            <h3>Multiple Question Types</h3>
            <p>
              Choose from multiple-choice, true/false, and short answer
                questions to match your teaching style.
            </p>
          </div>

          <div className="card">
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



