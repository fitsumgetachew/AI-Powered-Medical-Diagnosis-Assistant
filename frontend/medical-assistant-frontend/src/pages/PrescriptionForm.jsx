import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PrescriptionForm.css'; // Import the custom styles

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
  const [interactionResult, setInteractionResult] = useState('');
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingDrugs, setLoadingDrugs] = useState(true);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState('');

  useEffect(() => {
    fetchPatients();
    fetchDrugs();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/users/list');
      setPatients(response.data);
      console.log(response.data);
      setLoadingPatients(false);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Failed to fetch patients. Please try again later.');
      setErrorDetails(error.response?.data?.detail || error.message);
      setLoadingPatients(false);
    }
  };

  const fetchDrugs = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/prescriptions/drugs/');
      setDrugs(response.data);
      setLoadingDrugs(false);
    } catch (error) {
      console.error('Error fetching drugs:', error);
      setError('Failed to fetch drugs. Please try again later.');
      setErrorDetails(error.response?.data?.detail || error.message);
      setLoadingDrugs(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDrugSelection = (e) => {
    const selectedDrugs = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, drugs: selectedDrugs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/prescriptions/prescriptions/', formData);
      alert('Prescription saved successfully');
    } catch (error) {
      console.error('Error saving prescription:', error);
      setError('Failed to save prescription. Please check your input and try again.');
      setErrorDetails(error.response?.data?.detail || error.message);
    }
  };

  const checkDrugInteractions = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/prescriptions/drug-interactions/', { prescription_drugs: formData.drugs });
      setInteractionResult(response.data.interactions);
    } catch (error) {
      console.error('Error checking drug interactions:', error);
      setInteractionResult('Error checking interactions. Please try again later.');
      setErrorDetails(error.response?.data?.detail || error.message);
    }
  };

  if (loadingPatients || loadingDrugs) {
    return <div>Loading...</div>;
  }

  return (
    <div className="prescription-form-container">
      <h2>Create Prescription</h2>

      {/* Error message display */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          {errorDetails && <p className="error-details">{errorDetails}</p>} {/* Display detailed error info */}
        </div>
      )}

      <form onSubmit={handleSubmit} className="prescription-form">
        <div className="form-group">
          <label>Patient:</label>
          <select name="patient" value={formData.patient} onChange={handleInputChange} className="form-select">
            <option value="">Select Patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.first_name} {patient.last_name}  {/* Use first_name and last_name */}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Diagnosis:</label>
          <textarea name="diagnosis" value={formData.diagnosis} onChange={handleInputChange} className="form-textarea" />
        </div>
        <div className="form-group">
          <label>Drugs:</label>
          <select name="drugs" multiple={true} value={formData.drugs} onChange={handleDrugSelection} className="form-select">
            {drugs.map((drug) => (
              <option key={drug.id} value={drug.id}>
                {drug.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Dosage:</label>
          <input type="text" name="dosage" value={formData.dosage} onChange={handleInputChange} className="form-input" />
        </div>
        <div className="form-group">
          <label>Frequency:</label>
          <input type="text" name="frequency" value={formData.frequency} onChange={handleInputChange} className="form-input" />
        </div>
        <div className="form-group">
          <label>Duration:</label>
          <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} className="form-input" />
        </div>
        <div className="form-group">
          <label>Instructions:</label>
          <textarea name="instructions" value={formData.instructions} onChange={handleInputChange} className="form-textarea" />
        </div>

        <button type="submit" className="submit-button">Save Prescription</button>
      </form>

      <button onClick={checkDrugInteractions} className="check-interaction-button">Check Drug Interactions</button>

      {interactionResult && (
        <div className="interaction-result">
          <h3>Drug Interaction Result:</h3>
          <p>{interactionResult}</p>
        </div>
      )}
    </div>
  );
};

export default PrescriptionForm;
