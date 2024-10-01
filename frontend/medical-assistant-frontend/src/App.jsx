import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import PrivateLayout from './layouts/PrivateLayout';
import HomePage from "./pages/HomePage.jsx";
import SymptomAnalysis from "./pages/SymptomAnalysis.jsx";

// Lazy loading components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MedicalImageAnalysis = lazy(() => import('./pages/MedicalImageAnalysis'));
const Login = lazy(() => import('./components/AuthComponents').then(module => ({ default: module.Login })));
const Register = lazy(() => import('./components/AuthComponents').then(module => ({ default: module.Register })));
const UserProfile = lazy(() => import('./components/AuthComponents').then(module => ({ default: module.UserProfile })));
const PrescriptionForm = lazy(() => import('./pages/PrescriptionForm')); // New PrescriptionForm page
const DrugManagement = lazy(() => import('./pages/DrugManagement')); // New DrugManagement page

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
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
            <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

            {/* Private Routes */}
            <Route path="/dashboard" element={<PrivateLayout><Dashboard /></PrivateLayout>} />
            <Route path="/medical-image" element={<PrivateLayout><MedicalImageAnalysis /></PrivateLayout>} />
            <Route path="/prescription" element={<PrivateLayout><PrescriptionForm /></PrivateLayout>} />
            <Route path="/drug-management" element={<PrivateLayout><DrugManagement /></PrivateLayout>} />
            <Route path="/profile" element={<PrivateLayout><UserProfile /></PrivateLayout>} />
              <Route path="/symptom-analysis" element={<PrivateLayout><SymptomAnalysis /></PrivateLayout>} />
            {/*<Route path="/drug-interaction" element={<PrivateLayout><DrugInteraction /></PrivateLayout>} />*/}
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;