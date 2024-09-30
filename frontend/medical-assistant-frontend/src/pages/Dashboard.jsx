import React, { useState, useEffect } from 'react';
import DashboardCard from '../components/DashboardCard';
import './Dashboard.css'; // Import the stylesheet

function Dashboard() {
  const [imageAnalyses, setImageAnalyses] = useState([]);
  const [symptomAnalyses, setSymptomAnalyses] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    // Fetch data from your Django API endpoints
    // For now, we'll use placeholder data
    setImageAnalyses([
      { date: '2024-09-25', type: 'X-ray', result: 'No abnormalities detected' },
      { date: '2024-09-20', type: 'CT Scan', result: 'Minor irregularities found' }
    ]);
    setSymptomAnalyses([
      { date: '2024-09-27', symptoms: 'Headache, Fever', condition: 'Common Cold' },
      { date: '2024-09-22', symptoms: 'Cough, Shortness of breath', condition: 'Bronchitis' }
    ]);
    setPrescriptions([
      { date: '2024-09-26', medication: 'Amoxicillin', dosage: '500mg, 3 times daily' },
      { date: '2024-09-21', medication: 'Ibuprofen', dosage: '400mg, as needed' }
    ]);
  }, []);

  return (
    <div className="dashboard">
      <DashboardCard
        title="Recent Medical Image Analyses"
        items={imageAnalyses}
        itemType="image"
        ctaLink="/medical-image"
        ctaText="New Analysis"
      />
      <DashboardCard
        title="Recent Symptom Analyses"
        items={symptomAnalyses}
        itemType="symptom"
        ctaLink="/symptom-analysis"
        ctaText="New Analysis"
      />
      <DashboardCard
        title="Recent Prescriptions"
        items={prescriptions}
        itemType="prescription"
        ctaLink="/drug-interaction"
        ctaText="New Prescription"
      />
    </div>
  );
}

export default Dashboard;
