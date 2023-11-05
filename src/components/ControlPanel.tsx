import React from 'react';


interface ControlPanelProps {
  inputUrl: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddAsset: () => void;
  logAssetInfo: () => void;
}

function ControlPanel({ inputUrl, handleInputChange, handleAddAsset, logAssetInfo }: ControlPanelProps) {

 
  return (
    <div className="controls">
      <input
        type="text"
        placeholder="Enter URL"
        value={inputUrl}
        onChange={handleInputChange}
      />
      <button onClick={handleAddAsset}>Add Asset</button>
      <button onClick={logAssetInfo}>Log Asset Info</button>
    </div>
  );
}

export default ControlPanel;
