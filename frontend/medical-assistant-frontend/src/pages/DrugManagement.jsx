import React, { useState } from 'react';
import axios from 'axios';
import './DrugManagement.css'; // Import the CSS file

const DrugManagement = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    side_effects: '',
    contraindications: ''
  });
  const [error, setError] = useState(null); // State to store error messages
  const [errorDetails, setErrorDetails] = useState(''); // State for detailed error messages

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/prescriptions/drugs/', formData);
      alert('Drug added successfully');
      setFormData({
        name: '',
        description: '',
        side_effects: '',
        contraindications: ''
      });
      setError(null); // Clear error message on successful submission
    } catch (error) {
      console.error('Error adding drug:', error);
      setError('Failed to add drug. Please try again.'); // General error message
      setErrorDetails(error.response?.data?.detail || error.message); // Detailed error message
    }
  };

  return (
    <div className="drug-management-container">
      <h2>Add New Drug</h2>

      {/* Error message display */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          {errorDetails && <p className="error-details">{errorDetails}</p>} {/* Detailed error info */}
        </div>
      )}

      <form className="drug-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-input" />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} className="form-input" />
        </div>
        <div className="form-group">
          <label>Side Effects:</label>
          <textarea name="side_effects" value={formData.side_effects} onChange={handleInputChange} className="form-input" />
        </div>
        <div className="form-group">
          <label>Contraindications:</label>
          <textarea name="contraindications" value={formData.contraindications} onChange={handleInputChange} className="form-input" />
        </div>
        <button type="submit" className="submit-button">Add Drug</button>
      </form>
    </div>
  );
};

export default DrugManagement;
