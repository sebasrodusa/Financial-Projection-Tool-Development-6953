import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUpload, FiFile, FiCheck, FiX, FiEye, FiLoader } = FiIcons;

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [clientName, setClientName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const { addIllustration, extractDataFromPDF, updateIllustration } = useData();
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setIsUploading(true);
    
    // Simulate upload to Publit.io
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUrl = `https://publit.io/files/${Date.now()}-${file.name}`;
    setUploadedFile({
      name: file.name,
      size: file.size,
      url: mockUrl
    });
    
    setIsUploading(false);
  };

  const handleAnalyze = async () => {
    if (!uploadedFile || !clientName) {
      alert('Please provide client name and upload a file');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Create illustration record
      const illustration = addIllustration({
        clientName,
        pdfUrl: uploadedFile.url,
        fileName: uploadedFile.name
      });

      // Extract data using mock OCR
      const data = await extractDataFromPDF(uploadedFile.url);
      
      // Update illustration with extracted data
      updateIllustration(illustration.id, {
        status: 'analyzed',
        extractedData: data
      });

      setExtractedData(data);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleProceedToAnalysis = () => {
    navigate('/dashboard');
  };

  const removeFile = () => {
    setUploadedFile(null);
    setExtractedData(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload IUL Illustration</h1>
        <p className="text-gray-600">Upload a PDF illustration to analyze and compare investment strategies</p>
      </div>

      {/* Client Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Client Information</h3>
        <div className="max-w-md">
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
            Client Name
          </label>
          <input
            type="text"
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-financial-blue focus:border-financial-blue"
            placeholder="Enter client name"
          />
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">PDF Upload</h3>
        
        {!uploadedFile ? (
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 ${
              dragActive ? 'border-financial-blue bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <SafeIcon icon={FiUpload} className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    {isUploading ? 'Uploading...' : 'Drop PDF file here, or click to select'}
                  </span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".pdf"
                    className="sr-only"
                    onChange={handleChange}
                    disabled={isUploading}
                  />
                </label>
                <p className="mt-1 text-xs text-gray-500">PDF files only, up to 10MB</p>
              </div>
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                <SafeIcon icon={FiLoader} className="animate-spin h-8 w-8 text-financial-blue" />
              </div>
            )}
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiFile} className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="text-red-600 hover:text-red-800"
              >
                <SafeIcon icon={FiX} className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Section */}
      {uploadedFile && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Analysis</h3>
          
          {!extractedData ? (
            <div className="text-center">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !clientName}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-financial-blue hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <SafeIcon icon={FiLoader} className="animate-spin w-4 h-4 mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiEye} className="w-4 h-4 mr-2" />
                    Analyze PDF
                  </>
                )}
              </button>
              {isAnalyzing && (
                <p className="mt-2 text-sm text-gray-600">
                  Extracting data from PDF using OCR...
                </p>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <SafeIcon icon={FiCheck} className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Analysis Complete</span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Extracted Data Summary:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Premiums:</span>
                    <span className="ml-2 font-medium">{extractedData.premiums.length} years</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Death Benefits:</span>
                    <span className="ml-2 font-medium">{extractedData.deathBenefits.length} years</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Cash Values:</span>
                    <span className="ml-2 font-medium">{extractedData.cashValues.length} years</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Income Stream:</span>
                    <span className="ml-2 font-medium">{extractedData.incomeStream.length} years</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceedToAnalysis}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2" />
                Proceed to Dashboard
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Upload;