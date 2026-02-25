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

