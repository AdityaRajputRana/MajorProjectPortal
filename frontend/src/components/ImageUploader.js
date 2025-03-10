import React, { useState } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [mask, setMask] = useState(null);
  const [overlay, setOverlay] = useState(null);

  // Function to handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file)); // Set image URL to display
  };

  // Function to submit files to server for processing
  const submitFiles = async () => {
    const formData = new FormData();
    formData.append("image", document.querySelector("#imageInput").files[0]);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      // Set received images as base64 for rendering
      setImage(result.image);
      setMask(result.mask);
      setOverlay(result.overlay);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div className="App">
      <h1>Image and Mask Overlay</h1>

      <div>
        <input type="file" id="imageInput" onChange={handleImageUpload} />
        <button onClick={submitFiles}>Submit Files</button>
      </div>

      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        {image && <img src={`data:image/png;base64,${image}`} alt="Uploaded Image" width="300" />}
        {mask && <img src={`data:image/png;base64,${mask}`} alt="Mask" width="300" />}
        {overlay && <img src={`data:image/png;base64,${overlay}`} alt="Overlay" width="300" />}
      </div>
    </div>
  );
}

export default App;
