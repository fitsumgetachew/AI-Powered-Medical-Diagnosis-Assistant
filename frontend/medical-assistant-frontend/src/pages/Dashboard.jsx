import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Share2, X } from 'lucide-react';
import './Dashboard.css';

// Modal component for doctor selection
const ShareModal = ({ isOpen, onClose, doctors, onShare, analysisType, analysisId }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Share with Doctor</h3>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>
        <div className="modal-content">
          <p>Select a doctor to share your {analysisType} analysis:</p>
          <div className="doctors-list">
            {doctors.map(doctor => (
              <button
                key={doctor.user_id}
                className="doctor-item"
                onClick={() => onShare(doctor.user_id, analysisId)}
              >
                <h4>{doctor.name}</h4>
                <p>{doctor.specialization}</p>
                <span>Experience: {doctor.years_of_experience} years</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AnalysisBox = ({ item, type, onShareClick }) => (
  <div className="analysis-box">
    {type === 'symptom' && (
      <>
        <div className="box-date">{new Date(item.created_at).toLocaleDateString()}</div>
        <div className="box-content">
          {item.symptom_analysis.symptoms.map(symptom => (
            <span key={symptom.id} className="symptom-tag">{symptom.name}</span>
          ))}
        </div>
      </>
    )}
    {type === 'image' && (
      <>
        <div className="box-date">{item.date}</div>
        <div className="box-content">
          <div className="image-type">{item.type}</div>
          <div className="image-result">{item.result}</div>
        </div>
      </>
    )}
    {type === 'prescription' && (
      <>
        <div className="box-date">{item.date}</div>
        <div className="box-content">
          <div className="prescription-med">{item.medication}</div>
          <div className="prescription-dosage">{item.dosage}</div>
        </div>
      </>
    )}
    <button onClick={() => onShareClick(item.id, type)} className="share-button">
      <Share2 size={16} />
      Share with Doctor
    </button>
  </div>
);

const AnalysisSection = ({ title, items, type, ctaLink, onShareClick }) => (
  <div className="analysis-section">
    <div className="section-header">
      <h2>{title}</h2>
      <a href={ctaLink} className="new-analysis-button">
        <Plus size={16} />
        New Analysis
      </a>
    </div>
    <div className="boxes-container">
      {items.map((item, index) => (
        <AnalysisBox
          key={index}
          item={item}
          type={type}
          onShareClick={onShareClick}
        />
      ))}
    </div>
  </div>
);

function Dashboard() {
  const [imageAnalyses, setImageAnalyses] = useState([]);
  const [symptomAnalyses, setSymptomAnalyses] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const fetchDoctors = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.get('http://34.66.93.187/history/list-doctors/', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem('access_token');
      const headers = {
        Authorization: `Bearer ${accessToken}`
      };

      try {
        // Fetch symptom analyses
        const symptomResponse = await axios.get(
          'http://34.66.93.187/history/symptom-analysis/',
          { headers }
        );
        setSymptomAnalyses(symptomResponse.data);

        // Fetch doctors
        await fetchDoctors();

        // Sample data for image analyses and prescriptions
        setImageAnalyses([
          { id: 1, date: '2024-09-25', type: 'X-ray', result: 'Normal chest X-ray' },
          { id: 2, date: '2024-09-20', type: 'MRI', result: 'No significant findings' },
          { id: 3, date: '2024-09-15', type: 'CT Scan', result: 'Minor abnormalities detected' }
        ]);

        setPrescriptions([
          { id: 1, date: '2024-09-26', medication: 'Amoxicillin', dosage: '500mg, 3x daily' },
          { id: 2, date: '2024-09-21', medication: 'Ibuprofen', dosage: '400mg as needed' },
          { id: 3, date: '2024-09-18', medication: 'Loratadine', dosage: '10mg daily' }
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleShareClick = (analysisId, type) => {
    setSelectedAnalysis({ id: analysisId, type });
    setIsModalOpen(true);
  };

  const handleShare = async (doctorUserId, analysisId) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      await axios.post(
        'http://34.66.93.187/history/share/',
        {
          doctor_user_id: doctorUserId,
          patient_history_id: analysisId
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      // Close modal and show success message
      setIsModalOpen(false);
      alert('Analysis shared successfully!');
    } catch (error) {
      console.error('Error sharing analysis:', error);
      alert('Failed to share analysis. Please try again.');
    }
  };

  return (
    <div className="dashboard-container">
      <AnalysisSection
        title="Medical Image Analyses"
        items={imageAnalyses}
        type="image"
        ctaLink="/medical-image"
        onShareClick={handleShareClick}
      />
      <AnalysisSection
        title="Symptom Analyses"
        items={symptomAnalyses}
        type="symptom"
        ctaLink="/symptom-analysis"
        onShareClick={handleShareClick}
      />
      <AnalysisSection
        title="Prescriptions"
        items={prescriptions}
        type="prescription"
        ctaLink="/prescription"
        onShareClick={handleShareClick}
      />

      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctors={doctors}
        onShare={handleShare}
        analysisType={selectedAnalysis?.type}
        analysisId={selectedAnalysis?.id}
      />
    </div>
  );
}

export default Dashboard;