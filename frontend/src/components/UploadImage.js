import React, { useState } from 'react';
import ModelSelector from './ModelSelector'
import ImageUploader from './ImageUploader';
import ResultDisplay from './ResultDisplay';

const App = () => {
    const [selectedModel, setSelectedModel] = useState('');
    const [result, setResult] = useState(null);
  
    return (
      <div className="App">
        <h1>Model Showcase</h1>
        <ModelSelector onModelSelect={setSelectedModel} />
        <ImageUploader selectedModel={selectedModel} onResult={setResult} />
        {result && <ResultDisplay result={result} />}
      </div>
    );
  };

export default App;