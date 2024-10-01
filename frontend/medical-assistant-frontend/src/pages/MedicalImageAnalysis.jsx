import React, { useState } from 'react';
import axios from 'axios';
import './MedicalImageAnalysis.css'; // Import the stylesheet

const MedicalImageAnalysis = () => {
  const [file, setFile] = useState(null);
  const [analysisType, setAnalysisType] = useState('tuberculosis');
  const [imageType, setImageType] = useState('XRAY'); // Default to 'XRAY'
  const [bodyPart, setBodyPart] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setErrorMessage(''); // Clear error message on file change
  };

  const handleAnalysisTypeChange = (e) => {
    setAnalysisType(e.target.value);
  };

  const handleImageTypeChange = (e) => {
    setImageType(e.target.value); // Update image type based on dropdown
  };

  const handleBodyPartChange = (e) => {
    setBodyPart(e.target.value);
    setErrorMessage(''); // Clear error message on body part change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage('Please select an image file.');
      return;
    }
    if (!bodyPart) {
      setErrorMessage('Please enter the body part.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('image_type', imageType); // Add image type to form data
    formData.append('body_part', bodyPart); // Add body part to form data

    try {
      let endpoint;
      switch (analysisType) {
        case 'tuberculosis':
          endpoint = 'http://127.0.0.1:8000/analysis/tuberculosis/';
          break;
        case 'pneumonia':
          endpoint = 'http://127.0.0.1:8000/analysis/pneumonia/';
          break;
        case 'bone-fracture':
          endpoint = 'http://127.0.0.1:8000/analysis/bone-fracture/';
          break;
        case 'breast-cancer':
          endpoint = 'http://127.0.0.1:8000/analysis/breast-cancer/';
          break;
        case 'oral-cancer':
          endpoint = 'http://127.0.0.1:8000/analysis/oral-cancer/';
          break;
        default:
          throw new Error('Invalid analysis type');
      }

      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
      setErrorMessage(''); // Clear error message on success
    } catch (error) {
      console.error('Error during image analysis:', error);
      if (error.response) {
        // Server responded with a status other than 2xx
        setErrorMessage(`Error: ${error.response.data.message || 'An error occurred during image analysis. Please try again.'}`);
      } else {
        // Network or other error
        setErrorMessage('An error occurred. Please check your internet connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medical-image-analysis">
      <h2>Medical Image Analysis</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Error message display */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="image-upload">Upload Medical Image:</label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label htmlFor="analysis-type">Select Analysis Type:</label>
          <select
            id="analysis-type"
            value={analysisType}
            onChange={handleAnalysisTypeChange}
          >
            <option value="tuberculosis">Tuberculosis Test</option>
            <option value="pneumonia">Pneumonia Test</option>
            <option value="bone-fracture">Bone Fracture Test</option>
            <option value="breast-cancer">Breast Cancer Test</option>
            <option value="oral-cancer">Oral Cancer Test</option>
          </select>
        </div>
        <div>
          <label htmlFor="image-type">Select Image Type:</label>
          <select
            id="image-type"
            value={imageType}
            onChange={handleImageTypeChange}
          >
            <option value="XRAY">X-Ray</option>
            <option value="CT">CT Scan</option>
            <option value="MRI">MRI</option>
          </select>
        </div>
        <div>
          <label htmlFor="body-part">Enter Body Part:</label>
          <input
            type="text"
            id="body-part"
            value={bodyPart}
            onChange={handleBodyPartChange}
            placeholder="e.g., Chest, Arm"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Image'}
        </button>
      </form>

      {result && (
        <div className="analysis-result">
          <h3>Analysis Result</h3>
          <p><strong>Message:</strong> {result.message}</p>
          <p><strong>Result:</strong> {result.result}</p>
          <p><strong>Confidence Score:</strong> {result.confidence_score.toFixed(4)}</p>
          <p><strong>Abnormality Detected:</strong> {result.abnormality_detected ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
};

export default MedicalImageAnalysis;
