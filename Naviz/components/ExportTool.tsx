import React from 'react';
import * as BABYLON from '@babylonjs/core';

interface ExportToolProps {
  scene: BABYLON.Scene;
  isActive?: boolean;
}

const ExportTool: React.FC<ExportToolProps> = ({ scene, isActive = true }) => {
  if (!isActive) return null;

  return (
    <div className="absolute top-15 right-2.5 w-72 bg-black bg-opacity-90 rounded-lg p-4 text-white text-xs z-[1000]">
      <h3 className="m-0 mb-4 text-cyan-400">📤 Export Tool</h3>
      <p>This feature enables scene export functionality.</p>
      <p>Feature coming soon.</p>
    </div>
  );
};

export default ExportTool;
