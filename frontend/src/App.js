import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import UploadImage from './components/UploadImage';
import CaptureImage from './components/CaptureImage';
import './App.css'; // Import the CSS file for styling

const Home = () => {
  const navigate = useNavigate();

  const handleNavigateToUpload = () => {
    navigate('/upload');
  };

  const handleNavigateToCapture = () => {
    navigate('/capture');
  };

  return (
    <div className="home-container">
      <h1>Portal</h1>
      <h2>Alcohol Detection with NIR Iris Images: Model Comparison</h2>
      <p>This is a simple web-based tool to use the different models that we have trained.</p>
      <div className="button-container">
        <button className="action-button" onClick={handleNavigateToUpload}>
          Upload Image
        </button>
        <button className="action-button" onClick={handleNavigateToCapture}>
          Capture Image
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<UploadImage />} />
        <Route path="/capture" element={<CaptureImage />} />
      </Routes>
    </Router>
  );
}

export default App;