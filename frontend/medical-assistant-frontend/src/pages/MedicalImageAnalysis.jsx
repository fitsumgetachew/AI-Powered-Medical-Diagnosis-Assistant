import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const MedicalImageAnalysis = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analysisType, setAnalysisType] = useState('tuberculosis');
  const [imageType, setImageType] = useState('XRAY');
  const [bodyPart, setBodyPart] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setErrorMessage('');
    } else {
      setErrorMessage('Please select a valid image file.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false
  });

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
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Medical Image Analysis
        </h2>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Medical Image
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                ${isDragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-500'}`}
            >
              <input {...getInputProps()} />
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                {isDragActive
                  ? "Drop the image here..."
                  : "Drag & drop an image here, or click to select"}
              </p>
            </div>
          </div>

          {previewUrl && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Preview
              </label>
              <div className="relative mt-2 rounded-lg overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="analysis-type" className="block text-sm font-medium text-gray-700 mb-2">
                Analysis Type
              </label>
              <select
                id="analysis-type"
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="tuberculosis">Tuberculosis Test</option>
                <option value="pneumonia">Pneumonia Test</option>
                <option value="bone-fracture">Bone Fracture Test</option>
                <option value="breast-cancer">Breast Cancer Test</option>
                <option value="oral-cancer">Oral Cancer Test</option>
              </select>
            </div>

            <div>
              <label htmlFor="image-type" className="block text-sm font-medium text-gray-700 mb-2">
                Image Type
              </label>
              <select
                id="image-type"
                value={imageType}
                onChange={(e) => setImageType(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="XRAY">X-Ray</option>
                <option value="CT">CT Scan</option>
                <option value="MRI">MRI</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="body-part" className="block text-sm font-medium text-gray-700 mb-2">
              Body Part
            </label>
            <input
              type="text"
              id="body-part"
              value={bodyPart}
              onChange={(e) => setBodyPart(e.target.value)}
              placeholder="e.g., Chest, Arm"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${loading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              'Analyze Image'
            )}
          </button>
        </form>

        {result && (
          <div className="mt-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Analysis Result</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Message:</span>
                <span className="text-gray-900">{result.message}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Result:</span>
                <span className="text-gray-900">{result.result}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Confidence Score:</span>
                <span className="text-gray-900">{result.confidence_score.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Abnormality Detected:</span>
                <span className={`flex items-center ${result.abnormality_detected ? 'text-red-600' : 'text-green-600'}`}>
                  {result.abnormality_detected ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalImageAnalysis;