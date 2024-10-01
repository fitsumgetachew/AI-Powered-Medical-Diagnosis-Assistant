import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for API calls
import DashboardCard from '../components/DashboardCard';
import './Dashboard.css'; // Import the stylesheet

function Dashboard() {
  const [imageAnalyses, setImageAnalyses] = useState([]);
  const [symptomAnalyses, setSymptomAnalyses] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent image analyses
        const imageResponse = await axios.get('http://127.0.0.1:8000/analysis/results/'); // Replace with your actual API endpoint
        setImageAnalyses(imageResponse.data);

        // Fetch recent symptom analyses
        const symptomResponse = await axios.get('http://127.0.0.1:8000/symptom/analysis/'); // Replace with your actual API endpoint
        setSymptomAnalyses(symptomResponse.data);

        // Fetch recent prescriptions
        const prescriptionResponse = await axios.get('http://127.0.0.1:8000/prescriptions/prescriptions/'); // Replace with your actual API endpoint
        setPrescriptions(prescriptionResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Optional: Set dummy data if API calls fail
        setImageAnalyses([
          { date: '2024-09-25', type: 'X-ray', result: 'No abnormalities detected' },
          { date: '2024-09-20', type: 'CT Scan', result: 'Minor irregularities found' },
        ]);
        setSymptomAnalyses([
          { date: '2024-09-27', symptoms: 'Headache, Fever', condition: 'Common Cold' },
          { date: '2024-09-22', symptoms: 'Cough, Shortness of breath', condition: 'Bronchitis' },
        ]);
        setPrescriptions([
          { date: '2024-09-26', medication: 'Amoxicillin', dosage: '500mg, 3 times daily' },
          { date: '2024-09-21', medication: 'Ibuprofen', dosage: '400mg, as needed' },
        ]);
      }
    };

    fetchData();
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
        ctaLink="/prescription"
        ctaText="New Prescription"
      />
    </div>
  );
}

export default Dashboard;
