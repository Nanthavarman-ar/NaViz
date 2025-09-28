import React from 'react';
import NewBabylonWorkspace from './NewBabylonWorkspace';

const BabylonPreview = () => {
  return (
    <div className="w-full h-screen bg-gray-900">
      <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-75 text-white p-3 rounded">
        <h2 className="text-lg font-bold mb-2">Babylon Workspace Preview</h2>
        <div className="text-sm space-y-1">
          <p>✓ Babylon.js Engine: v8.26.1</p>
          <p>✓ 3D Scene with Camera Controls</p>
          <p>✓ Test Objects: Box, Sphere, Cylinder</p>
          <p>✓ PropertyInspector Integration</p>
          <p className="text-yellow-300 mt-2">Click objects to inspect properties</p>
        </div>
      </div>
      <NewBabylonWorkspace workspaceId="preview" />
    </div>
  );
};

export default BabylonPreview;