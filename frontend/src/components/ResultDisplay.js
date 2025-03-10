import React from 'react';

const ResultDisplay = ({ result }) => {
  return result && (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        {result && <img src={`data:image/png;base64,${result.image}`} alt="Uploaded Image" width="300" />}
        {result && <img src={`data:image/png;base64,${result.mask}`} alt="Mask" width="300" />}
        {result && <img src={`data:image/png;base64,${result.overlay}`} alt="Overlay" width="300" />}
      </div>
  );
};

export default ResultDisplay;
