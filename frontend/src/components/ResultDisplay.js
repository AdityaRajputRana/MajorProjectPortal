import React from 'react';

const ResultDisplay = ({ result }) => {
  return result && (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {result.prediction && (
        <div style={{ fontSize: "24px", fontWeight: "bold" }}>
          {result.prediction}
        </div>
      )}

      {result.prediction && (
        (result.confidence && <div style={{ fontSize: "16px", marginBottom: "20px" }}>
          {result.confidence} Confidence
        </div> )
      )}
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <img src={`data:image/png;base64,${result.image}`} alt="Uploaded Image" width="300" />
        {result.mask && <img src={`data:image/png;base64,${result.mask}`} alt="Mask" width="300" />}
        {result.overlay && <img src={`data:image/png;base64,${result.overlay}`} alt="Overlay" width="300" />}
      </div>
    </div>
  );
};

export default ResultDisplay;
