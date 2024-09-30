import React from 'react';
import './HomePage.css'; // Make sure to create this CSS file

const HomePage = () => {
  return (
    <div>
      <header>
        <h1>AI-Powered Medical Diagnosis Assistant</h1>
      </header>

      <nav>
        <div className="logo">MediAI</div>
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Services</a>
          <a href="/login">Login</a>
          <a href="/register">Sign Up</a>
        </div>
      </nav>

      <main>
        <section className="hero">
          <h1>Revolutionizing Medical Diagnosis with AI</h1>
          <p>
            Experience cutting-edge technology that assists doctors and patients in accurate medical diagnoses and personalized healthcare.
          </p>
          <a href="#" className="cta-button">Get Started</a>
        </section>

        <section className="features">
          <div className="feature">
            <img src="img/placeholder.jpg" alt="Medical Image Analysis" />
            <h3>Medical Image Analysis</h3>
            <p>Advanced AI analysis of X-rays, CT scans, and MRIs to detect abnormalities with high accuracy.</p>
          </div>
          <div className="feature">
            <img src="img/placeholder.jpg" alt="Symptom Analysis" />
            <h3>Symptom Analysis</h3>
            <p>Interactive chatbot powered by LLMs to provide detailed information about user conditions.</p>
          </div>
          <div className="feature">
            <img src="img/placeholder.jpg" alt="Drug Interaction" />
            <h3>Drug Interaction</h3>
            <p>Comprehensive drug information system for doctors to ensure safe and effective prescriptions.</p>
          </div>
        </section>

        <section className="slider-container">
          <div className="slider">
            <div className="slide"><img src="img/placeholder.jpg" alt="Slide 1" /></div>
            <div className="slide"><img src="img/placeholder.jpg" alt="Slide 2" /></div>
            <div className="slide"><img src="img/placeholder.jpg" alt="Slide 3" /></div>
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2024 AI-Powered Medical Diagnosis Assistant. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
