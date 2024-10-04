import React, { useState } from 'react';
import axios from 'axios';
import './MedicalImageAnalysis.css';

const MedicalImageAnalysis = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analysisType, setAnalysisType] = useState('tuberculosis');
  const [imageType, setImageType] = useState('XRAY');
  const [bodyPart, setBodyPart] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setErrorMessage('');
    } else {
      setErrorMessage('Please select a valid image file.');
      setFile(null);
      setPreviewUrl(null);
    }
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
    formData.append('image_type', imageType);
    formData.append('body_part', bodyPart);

    try {
      const endpoints = {
        tuberculosis: 'http://127.0.0.1:8000/analysis/tuberculosis/',
        pneumonia: 'http://127.0.0.1:8000/analysis/pneumonia/',
        'bone-fracture': 'http://127.0.0.1:8000/analysis/bones-fracture/',
        'breast-cancer': 'http://127.0.0.1:8000/analysis/breast-cancer/',
        'oral-cancer': 'http://127.0.0.1:8000/analysis/oral-cancer/',
      };

      const endpoint = endpoints[analysisType];
      if (!endpoint) throw new Error('Invalid analysis type');

      const response = await axios.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResult(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error during image analysis:', error);
      setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medical-image-analysis">
      <h2>Medical Image Analysis</h2>

      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="image-upload">Upload Medical Image:</label>
          <input
            type="file"
            id="image-upload"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        {previewUrl && (
          <div className="image-preview">
            <h3>Image Preview</h3>
            <img src={previewUrl} alt="Preview" />
          </div>
        )}

        <div>
          <label htmlFor="analysis-type">Select Analysis Type:</label>
          <select
            id="analysis-type"
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value)}
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
            onChange={(e) => setImageType(e.target.value)}
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
            onChange={(e) => setBodyPart(e.target.value)}
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