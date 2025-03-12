import React, { useState, useRef } from 'react';
import ResultDisplay from './ResultDisplay';
import './CaptureImage.css'; // Import the CSS file for styling
import ModelSelector from './ModelSelector';

const CaptureImage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [model, setSelectedModel] = useState(null);
  const [result, setResult] = useState(null);

  // Access the user's camera when the component mounts
  React.useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(err => {
        console.error("Error accessing camera: ", err);
      });
  }, []);

  // Capture the current frame from the video stream
  const captureImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size and draw the video frame
    canvas.width = 192;
    canvas.height = 192;
    ctx.drawImage(videoRef.current, 0, 0, 192, 192);

    // Convert the image to grayscale
    const imageData = ctx.getImageData(0, 0, 192, 192);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const grayscale = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
      data[i] = data[i + 1] = data[i + 2] = grayscale; // Set RGB to grayscale value
    }

    ctx.putImageData(imageData, 0, 0);

    setCapturedImage(canvas.toDataURL('image/png'));
  };

  // Send the captured image to the backend
  const sendImage = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      const formData = new FormData();
      formData.append('image', blob, 'image.bmp');
      formData.append('model', model); 

      fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setResult(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }, 'image/bmp');
  };

  return (
    <div className="capture-container">
      <h2>Capture Image from Camera</h2>
      <ModelSelector onModelSelect={setSelectedModel} />
      <div><br></br></div>
      <div className="warning-note">
        <p className='warning-text'>Note: The current camera is not an LG NIR Iris Cam, so the results of this experiment may be inaccurate.</p>
      </div>
      <video ref={videoRef} width="320" height="240" autoPlay className="video-stream" />
      <br />
      <button className="action-button" onClick={captureImage}>Capture Image</button>
      <br />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <br />
      {capturedImage && <img src={capturedImage} alt="Captured" className="captured-image" />}
      <br />
      <button className="action-button" onClick={sendImage}>Send Image to Server</button>
      {result && <ResultDisplay result={result} />}
    </div>
  );
};

export default CaptureImage;