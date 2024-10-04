import React, { useState, useEffect } from 'react';
import { Plus, Share2, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Share Modal component
const ShareModal = ({ isOpen, onClose, doctors, onShare, analysisType, analysisId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Share with Doctor</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <p className="mb-4 text-gray-600">Select a doctor to share your {analysisType} analysis:</p>
          <div className="space-y-3">
            {doctors.map(doctor => (
              <button
                key={doctor.user_id}
                onClick={() => onShare(doctor.user_id, analysisId)}
                className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h4 className="font-semibold">{doctor.name}</h4>
                <p className="text-sm text-gray-600">{doctor.specialization}</p>
                <span className="text-xs text-gray-500">Experience: {doctor.years_of_experience} years</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
// Detail Modal component
const DetailModal = ({ isOpen, onClose, data, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">
            {type === 'image' && 'Image Analysis Details'}
            {type === 'symptom' && 'Symptom Analysis Details'}
            {type === 'prescription' && 'Prescription Details'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          {type === 'image' && (
            <>
              <p className="mb-2"><span className="font-semibold">Type:</span> {data.medical_image.image_type}</p>
              <p className="mb-2"><span className="font-semibold">Body Part:</span> {data.medical_image.body_part}</p>
              <p className="mb-2"><span className="font-semibold">Result:</span> {data.result}</p>
              <p className="mb-2"><span className="font-semibold">Abnormality Detected:</span> {data.abnormality_detected ? 'Yes' : 'No'}</p>
              <p><span className="font-semibold">Confidence Score:</span> {(data.confidence_score * 100).toFixed(2)}%</p>
            </>
          )}
          {type === 'symptom' && (
            <>
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Symptoms:</h4>
                <ul className="list-disc pl-5">
                  {data.symptom_analysis.symptoms.map(symptom => (
                    <li key={symptom.id} className="mb-1">{symptom.name}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Analysis Result:</h4>
                <p className="text-gray-700">{data.symptom_analysis.analysis_result}</p>
              </div>
            </>
          )}
          {type === 'prescription' && (
            <>
              <p className="mb-2"><span className="font-semibold">Diagnosis:</span> {data.diagnosis}</p>
              <p className="mb-2"><span className="font-semibold">Dosage:</span> {data.dosage}</p>
              <p className="mb-2"><span className="font-semibold">Frequency:</span> {data.frequency}</p>
              <p className="mb-2"><span className="font-semibold">Duration:</span> {data.duration}</p>
              <p className="mb-2"><span className="font-semibold">Instructions:</span> {data.instructions}</p>
              <p><span className="font-semibold">Created:</span> {new Date(data.created_at).toLocaleDateString()}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Share Modal component (keep your existing ShareModal component)

const AnalysisBox = ({ item, type, onShareClick, isAddNew, onBoxClick }) => {
  const navigate = useNavigate();

  if (isAddNew) {
    const getRedirectPath = () => {
      switch (type) {
        case 'image':
          return '/medical-image';
        case 'symptom':
          return '/symptom-analysis';
        case 'prescription':
          return '/prescription';
        default:
          return '/';
      }
    };

    return (
      <button
        onClick={() => navigate(getRedirectPath())}
        className="h-full min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 hover:border-blue-500 hover:bg-blue-50 transition-colors group"
      >
        <Plus size={24} className="text-gray-400 group-hover:text-blue-500 mb-2" />
        <span className="text-gray-500 group-hover:text-blue-600 font-medium">New {type}</span>
      </button>
    );
  }

  // ... rest of AnalysisBox component remains the same ...
};

const AnalysisSection = ({ title, items = [], type, onShareClick, onBoxClick }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.slice(0, 3).map((item, index) => (
        <AnalysisBox
          key={index}
          item={item}
          type={type}
          onShareClick={onShareClick}
          onBoxClick={onBoxClick}
        />
      ))}
      <AnalysisBox isAddNew type={type} />
    </div>
  </div>
);

function Dashboard() {
  const [imageAnalyses, setImageAnalyses] = useState([]);
  const [symptomAnalyses, setSymptomAnalyses] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [detailModalData, setDetailModalData] = useState(null);
  const [detailModalType, setDetailModalType] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem('access_token');
      const config = {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      };

      // Fetch image analyses
      try {
        const imageResponse = await axios.get('http://127.0.0.1:8000/analysis/results/', config);
        setImageAnalyses(imageResponse.data);
      } catch (error) {
        console.error('Error fetching image analyses:', error);
        setImageAnalyses([]);
      }

      // Fetch symptom analyses
      try {
        const symptomResponse = await axios.get('http://127.0.0.1:8000/history/symptom-analysis/', config);
        setSymptomAnalyses(symptomResponse.data);
      } catch (error) {
        console.error('Error fetching symptom analyses:', error);
        setSymptomAnalyses([]);
      }

      // Fetch prescriptions
      try {
        const prescriptionResponse = await axios.get('http://127.0.0.1:8000/prescriptions/prescriptions/', config);
        setPrescriptions(prescriptionResponse.data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
        setPrescriptions([]);
      }

      // Fetch doctors
      try {
        const doctorsResponse = await axios.get('http://127.0.0.1:8000/history/list-doctors/', config);
        setDoctors(doctorsResponse.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setDoctors([]);
      }
    };

    fetchData();
  }, []);

  const handleShareClick = (analysisId, type) => {
    setSelectedAnalysis({ id: analysisId, type });
    setIsShareModalOpen(true);
  };

  const handleBoxClick = (item, type) => {
    setDetailModalData(item);
    setDetailModalType(type);
  };

  const handleShare = async (doctorUserId, analysisId) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      await axios.post(
        'http://127.0.0.1:8000/history/share/',
        {
          doctor_user_id: doctorUserId,
          patient_history_id: analysisId
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      setIsShareModalOpen(false);
      alert('Analysis shared successfully!');
    } catch (error) {
      console.error('Error sharing analysis:', error);
      alert('Failed to share analysis. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AnalysisSection
        title="Medical Image Analyses"
        items={imageAnalyses}
        type="image"
        onShareClick={handleShareClick}
        onBoxClick={(item) => handleBoxClick(item, 'image')}
      />
      <AnalysisSection
        title="Symptom Analyses"
        items={symptomAnalyses}
        type="symptom"
        onShareClick={handleShareClick}
        onBoxClick={(item) => handleBoxClick(item, 'symptom')}
      />
      <AnalysisSection
        title="Prescriptions"
        items={prescriptions}
        type="prescription"
        onShareClick={handleShareClick}
        onBoxClick={(item) => handleBoxClick(item, 'prescription')}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        doctors={doctors}
        onShare={handleShare}
        analysisType={selectedAnalysis?.type}
        analysisId={selectedAnalysis?.id}
      />

      <DetailModal
        isOpen={detailModalData !== null}
        onClose={() => setDetailModalData(null)}
        data={detailModalData}
        type={detailModalType}
      />
    </div>
  );
}

export default Dashboard;