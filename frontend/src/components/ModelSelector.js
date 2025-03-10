import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const ModelSelector = ({ onModelSelect }) => {
  const [models, setModels] = useState([]);

  useEffect(() => {
    axios.get(`${config.BASE_URL}/config`).then(response => {
        setModels(response.data.models);
        onModelSelect(response.data.models[0].name)
    })
    .catch(err => console.error(err));
  }, []);

  console.log("Rendering Model Selector");

  return (
    <div>
      <label>Select Model: </label>
      <select onChange={(e) => onModelSelect(e.target.value)}>
        {models.map((model, index) => (
          <option key={index} value={model.name}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModelSelector;
