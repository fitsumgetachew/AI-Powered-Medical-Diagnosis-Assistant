import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import HomePage from "./pages/HomePage.jsx";
import SymptomAnalysis from "./pages/SymptomAnalysis.jsx";

// Lazy loading components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MedicalImageAnalysis = lazy(() => import('./pages/MedicalImageAnalysis'));
const Login = lazy(() => import('./components/AuthComponents').then(module => ({ default: module.Login })));
const Register = lazy(() => import('./components/AuthComponents').then(module => ({ default: module.Register })));
const UserProfile = lazy(() => import('./components/AuthComponents').then(module => ({ default: module.UserProfile })));

const Loading = () => (
  <div className="loading">
    <h2>Loading...</h2>
    <p>Please wait a moment.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          {/* Suspense component to show fallback while loading */}
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path='/symptom-analysis' element={<SymptomAnalysis />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/medical-image" element={<MedicalImageAnalysis />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
