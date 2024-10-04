import React, { useState } from 'react';
import axios from 'axios';
import './DrugManagement.css';

const DrugManagement = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    side_effects: '',
    contraindications: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
      setSuccess(true);
      setFormData({
        name: '',
        description: '',
        side_effects: '',
        contraindications: ''
      });
      setError(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding drug:', error);
      setError(error.response?.data?.detail || 'Failed to add drug. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <div className="drug-management-container">
      <h2>Add New Drug</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Drug added successfully!</div>}
      <form className="drug-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="side_effects">Side Effects:</label>
          <textarea
            id="side_effects"
            name="side_effects"
            value={formData.side_effects}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contraindications">Contraindications:</label>
          <textarea
            id="contraindications"
            name="contraindications"
            value={formData.contraindications}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="submit-button">Add Drug</button>
      </form>
    </div>
  );
};

export default DrugManagement;