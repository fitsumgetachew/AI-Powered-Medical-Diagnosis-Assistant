import React, { useState, useEffect } from 'react';
import './HomePage.css';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "https://via.placeholder.com/800x400.png?text=Medical+Image+Analysis",
      title: "Advanced Medical Image Analysis",
      description: "State-of-the-art AI analysis for X-rays, CT scans, and MRIs"
    },
    {
      image: "https://via.placeholder.com/800x400.png?text=Symptom+Analysis",
      title: "Intelligent Symptom Analysis",
      description: "AI-powered chatbot for comprehensive symptom evaluation"
    },
    {
      image: "https://via.placeholder.com/800x400.png?text=Drug+Interaction",
      title: "Smart Drug Interaction Checker",
      description: "Ensure safe prescriptions with our advanced drug analysis system"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">MediAI</div>
          <div className="nav-links">
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Services</a>
            <a href="/login" className="login-link">Login</a>
            <a href="/register" className="signup-button">Sign Up</a>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <h1>AI-Powered Medical Diagnosis Assistant</h1>
          <p>Revolutionizing healthcare with cutting-edge AI technology</p>
          <a href="/register" className="cta-button">Get Started</a>
        </div>
      </header>

      <main>
        <section className="features">
          <h2>Our Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon brain-icon"></div>
              <div className="feature-content">
                <h3>Medical Image Analysis</h3>
                <p>Advanced AI analysis of medical images with high accuracy detection of abnormalities. Our system can
                  process X-rays, CT scans, and MRIs to provide quick and accurate diagnoses.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon activity-icon"></div>
              <div className="feature-content">
                <h3>Symptom Analysis</h3>
                <p>Interactive AI chatbot for detailed symptom evaluation and preliminary diagnosis. Our system uses
                  natural language processing to understand patient symptoms and provide accurate medical advice.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon pill-icon"></div>
              <div className="feature-content">
                <h3>Drug Interaction</h3>
                <p>Comprehensive drug information system for safe and effective prescriptions. Our AI analyzes potential
                  drug interactions and provides dosage recommendations based on patient history and current
                  medications.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="slider-section">
          <h2>How It Works</h2>
          <div className="slider-container">
            <div
                className="slider"
                style={{transform: `translateX(-${currentSlide * 100}%)`}}
            >
              {slides.map((slide, index) => (
                  <div key={index} className="slide">
                    <img src={slide.image} alt={slide.title}/>
                    <div className="slide-content">
                      <h3>{slide.title}</h3>
                      <p>{slide.description}</p>
                    </div>
                  </div>
              ))}
            </div>
            <button className="slider-button prev" onClick={prevSlide}>←</button>
            <button className="slider-button next" onClick={nextSlide}>→</button>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to transform your medical practice?</h2>
            <p>Join thousands of healthcare professionals using MediAI to improve patient care.</p>
            <a href="/register" className="cta-button">Start Free Trial</a>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h3>MediAI</h3>
            <p>Revolutionizing medical diagnosis with artificial intelligence.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Legal</h3>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 MediAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;