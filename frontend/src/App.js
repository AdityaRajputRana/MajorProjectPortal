import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import UploadImage from './components/UploadImage';
import CaptureImage from './components/CaptureImage';

const Home = () => {
  const navigate = useNavigate();

  const handleNavigateToUpload = () => {
    navigate('/upload');
  };

  const handleNavigateToCapture = () => {
    navigate('/capture');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Select an Action</h2>
      <button onClick={handleNavigateToUpload} style={{ marginRight: '10px', padding: '10px 20px' }}>
        Upload Image
      </button>
      <button onClick={handleNavigateToCapture} style={{ padding: '10px 20px' }}>
        Capture Image
      </button>
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
