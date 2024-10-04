import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PrescriptionForm.css';

const PrescriptionForm = () => {
  const [patients, setPatients] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [formData, setFormData] = useState({
    patient: '',
    diagnosis: '',
    drugs: [],
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });
  const [loading, setLoading] = useState({ patients: true, drugs: true });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [interactionPopup, setInteractionPopup] = useState({ isOpen: false, content: '' });

  useEffect(() => {
    fetchPatients();
    fetchDrugs();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/users/list');
      setPatients(response.data);
      setLoading(prev => ({ ...prev, patients: false }));
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Failed to fetch patients. Please try again later.');
      setLoading(prev => ({ ...prev, patients: false }));
    }
  };

  const fetchDrugs = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/prescriptions/drugs/');
      setDrugs(response.data);
      setLoading(prev => ({ ...prev, drugs: false }));
    } catch (error) {
      console.error('Error fetching drugs:', error);
      setError('Failed to fetch drugs. Please try again later.');
      setLoading(prev => ({ ...prev, drugs: false }));
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDrugSelection = (e) => {
    const selectedDrugs = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, drugs: selectedDrugs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/prescriptions/prescriptions/', formData);
      setSuccess(true);
      setInteractionPopup({ isOpen: true, content: response.data.interactions });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving prescription:', error);
      setError('Failed to save prescription. Please check your input and try again.');
    }
  };

  if (loading.patients || loading.drugs) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="prescription-form-container">
      <h2>Create Prescription</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Prescription saved successfully</div>}

      <form onSubmit={handleSubmit} className="prescription-form">
        <div className="form-group">
          <label htmlFor="patient">Patient:</label>
          <select id="patient" name="patient" value={formData.patient} onChange={handleInputChange} className="form-select">
            <option value="">Select Patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.first_name} {patient.last_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="diagnosis">Diagnosis:</label>
          <textarea id="diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleInputChange} className="form-textarea" />
        </div>

        <div className="form-group">
          <label htmlFor="drugs">Drugs:</label>
          <select id="drugs" name="drugs" multiple={true} value={formData.drugs} onChange={handleDrugSelection} className="form-select">
            {drugs.map((drug) => (
              <option key={drug.id} value={drug.id}>
                {drug.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dosage">Dosage:</label>
            <input id="dosage" type="text" name="dosage" value={formData.dosage} onChange={handleInputChange} className="form-input" />
          </div>

          <div className="form-group">
            <label htmlFor="frequency">Frequency:</label>
            <input id="frequency" type="text" name="frequency" value={formData.frequency} onChange={handleInputChange} className="form-input" />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration:</label>
            <input id="duration" type="text" name="duration" value={formData.duration} onChange={handleInputChange} className="form-input" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="instructions">Instructions:</label>
          <textarea id="instructions" name="instructions" value={formData.instructions} onChange={handleInputChange} className="form-textarea" />
        </div>

        <div className="button-group">
          <button type="submit" className="submit-button">Save Prescription</button>
        </div>
      </form>

      {interactionPopup.isOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Drug Interaction Information</h3>
            <p>{interactionPopup.content}</p>
            <button onClick={() => setInteractionPopup(prev => ({ ...prev, isOpen: false }))}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionForm;