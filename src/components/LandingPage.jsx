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


