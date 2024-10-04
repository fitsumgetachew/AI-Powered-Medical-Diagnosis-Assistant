import React, { useState, useEffect } from 'react';
import { Brain, Activity, Pill } from 'lucide-react';

// Import your images
import medicalImage from '../img/iloveimg-converted/medical_image.jpg';
import chatbotImage from '../img/iloveimg-converted/chatbot.jpg';
import drugImage from '../img/iloveimg-converted/drug_interaction.jpg';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "Revolutionizing healthcare with cutting-edge AI technology";

  const slides = [
    {
      image: medicalImage,
      title: "Advanced Medical Image Analysis",
      description: "State-of-the-art AI analysis for X-rays, CT scans, and MRIs"
    },
    {
      image: chatbotImage,
      title: "Intelligent Symptom Analysis",
      description: "AI-powered chatbot for comprehensive symptom evaluation"
    },
    {
      image: drugImage,
      title: "Smart Drug Interaction Checker",
      description: "Ensure safe prescriptions with our advanced drug analysis system"
    }
  ];

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(typingInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-900 text-white shadow-lg' : 'bg-white text-gray-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className={`text-2xl font-bold ${scrolled ? 'text-white' : 'text-blue-600'}`}>MediAI</span>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => scrollToSection('home')} className="hover:text-blue-600">Home</button>
              <button onClick={() => scrollToSection('features')} className="hover:text-blue-600">Our Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-blue-600">How It Works</button>
              <a href="/login" className={`${scrolled ? 'text-blue-400' : 'text-blue-600'} hover:text-blue-800`}>Login</a>
              <a href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Sign Up</a>
            </div>
          </div>
        </div>
      </nav>

      <header id="home" className="pt-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">AI-Powered Medical Diagnosis Assistant</h1>
            <p className="text-xl h-8 overflow-hidden whitespace-nowrap">{typedText}</p>
            <a href="/register" className="inline-block mt-8 bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-100 transition-colors">
              Get Started
            </a>
          </div>
        </div>
      </header>

      <main>
        <section id="features" className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
            <div className="space-y-8">
              {[
                { icon: Brain, title: "Medical Image Analysis", desc: "Advanced AI analysis of medical images with high accuracy detection of abnormalities." },
                { icon: Activity, title: "Symptom Analysis", desc: "Interactive AI chatbot for detailed symptom evaluation and preliminary diagnosis." },
                { icon: Pill, title: "Drug Interaction", desc: "Comprehensive drug information system for safe and effective prescriptions." }
              ].map((feature, index) => (
                <div key={index} className="flex items-center bg-white p-6 rounded-lg shadow-lg">
                  <feature.icon className="w-16 h-16 text-blue-600 flex-shrink-0" />
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="relative">
              <div className="overflow-hidden rounded-lg shadow-lg">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {slides.map((slide, index) => (
                    <div key={index} className="flex-shrink-0 w-full">
                      <div className="relative">
                        <img src={slide.image} alt={slide.title} className="w-full h-[400px] object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                          <h3 className="text-white text-2xl font-bold mb-2">{slide.title}</h3>
                          <p className="text-white">{slide.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to transform your medical practice?</h2>
              <p className="text-xl text-gray-600 mb-8">Experience the future of medical diagnosis with our innovative AI solutions.</p>
              <a href="/register" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors">
                Start Free Trial
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">MediAI</h3>
              <p className="text-gray-400">Advancing medical diagnosis with artificial intelligence.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;