import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { ChevronRight, Eye, Maximize2, Smartphone, Move, MousePointer, Monitor, Tablet, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import BabylonWorkspace from '../BabylonWorkspace';
import { TopBar } from '../BabylonWorkspace/ui/TopBar';

export function HeroSection() {
  const navigate = useNavigate();
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 50, y: 50 });
  const [modalSize, setModalSize] = useState({ width: 375, height: 667 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 375, height: 667 });
  const [resizeDirection, setResizeDirection] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  // Size adjustment functions
  const setSizePreset = (width: number, height: number) => {
    const maxWidth = window.innerWidth - modalPosition.x;
    const maxHeight = window.innerHeight - modalPosition.y;
    const newWidth = Math.min(width, maxWidth);
    const newHeight = Math.min(height, maxHeight);
    setModalSize({ width: newWidth, height: newHeight });
  };

  // Keyboard shortcuts for size adjustment
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (workspaceModalOpen) {
        switch (e.key) {
          case '1':
            setSizePreset(375, 667); // Mobile
            break;
          case '2':
            setSizePreset(768, 1024); // Tablet
            break;
          case '3':
            setSizePreset(1200, 800); // Desktop
            break;
          case '4':
            setSizePreset(1920, 1080); // Full HD
            break;
          case '0':
            setSizePreset(375, 667); // Reset to mobile
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [workspaceModalOpen, modalPosition]);

  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - modalPosition.x,
      y: e.clientY - modalPosition.y
    });
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Keep modal within viewport bounds
      const maxX = window.innerWidth - 375;
      const maxY = window.innerHeight - 667;

      setModalPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Resize functionality
  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    setIsResizing(true);
    setResizeDirection(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: modalSize.width,
      height: modalSize.height
    });
    e.preventDefault();
    e.stopPropagation();
  };

  const handleResizeMouseMove = (e: MouseEvent) => {
    if (isResizing && resizeDirection) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;

      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;

      // Minimum size constraints
      const minWidth = 300;
      const minHeight = 400;
      const maxWidth = window.innerWidth - modalPosition.x;
      const maxHeight = window.innerHeight - modalPosition.y;

      switch (resizeDirection) {
        case 'se': // Southeast corner
          newWidth = Math.max(minWidth, Math.min(resizeStart.width + deltaX, maxWidth));
          newHeight = Math.max(minHeight, Math.min(resizeStart.height + deltaY, maxHeight));
          break;
        case 's': // South edge
          newHeight = Math.max(minHeight, Math.min(resizeStart.height + deltaY, maxHeight));
          break;
        case 'e': // East edge
          newWidth = Math.max(minWidth, Math.min(resizeStart.width + deltaX, maxWidth));
          break;
        case 'sw': // Southwest corner
          newWidth = Math.max(minWidth, Math.min(resizeStart.width - deltaX, maxWidth));
          newHeight = Math.max(minHeight, Math.min(resizeStart.height + deltaY, maxHeight));
          break;
        case 'w': // West edge
          newWidth = Math.max(minWidth, Math.min(resizeStart.width - deltaX, maxWidth));
          break;
        case 'ne': // Northeast corner
          newWidth = Math.max(minWidth, Math.min(resizeStart.width + deltaX, maxWidth));
          newHeight = Math.max(minHeight, Math.min(resizeStart.height - deltaY, maxHeight));
          break;
        case 'n': // North edge
          newHeight = Math.max(minHeight, Math.min(resizeStart.height - deltaY, maxHeight));
          break;
        case 'nw': // Northwest corner
          newWidth = Math.max(minWidth, Math.min(resizeStart.width - deltaX, maxWidth));
          newHeight = Math.max(minHeight, Math.min(resizeStart.height - deltaY, maxHeight));
          break;
      }

      setModalSize({ width: newWidth, height: newHeight });
    }
  };

  const handleResizeMouseUp = () => {
    setIsResizing(false);
    setResizeDirection('');
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = 'auto';
      };
    }
  }, [isDragging, dragStart]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMouseMove);
      document.addEventListener('mouseup', handleResizeMouseUp);
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleResizeMouseMove);
        document.removeEventListener('mouseup', handleResizeMouseUp);
        document.body.style.userSelect = 'auto';
      };
    }
  }, [isResizing, resizeDirection, resizeStart]);

  return (
    <section className="relative min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Empty hero area - home page content removed */}
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center min-h-[600px]">
          <p className="text-gray-500">Home page hero area removed.</p>
          <Button onClick={() => setWorkspaceModalOpen(true)}>Open Workspace Preview</Button>
        </div>
      </div>

      {/* Draggable Modal */}
      <Dialog open={workspaceModalOpen} onOpenChange={setWorkspaceModalOpen}>
        <DialogContent
          ref={modalRef}
          className={`p-0 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{
            position: 'fixed',
            left: `${modalPosition.x}px`,
            top: `${modalPosition.y}px`,
            width: `${modalSize.width}px`,
            height: `${modalSize.height}px`,
            transform: 'none',
            backgroundColor: '#1f2937',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
          onMouseDown={handleMouseDown}
        >
          <DialogHeader className="p-6 pb-4 bg-slate-800 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-bold text-white">
                3D Workspace Preview
              </DialogTitle>
              <div className="flex items-center gap-2">
                <MousePointer className="w-4 h-4 text-gray-400" />
                <Move className="w-4 h-4 text-gray-400" />

                {/* Size Controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSizePreset(375, 667)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="Mobile Size (1)"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSizePreset(768, 1024)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="Tablet Size (2)"
                  >
                    <Tablet className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSizePreset(1200, 800)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="Desktop Size (3)"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSizePreset(1920, 1080)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="Full HD Size (4)"
                  >
                    <Square className="w-4 h-4" />
                  </button>
                </div>

                {/* Size Indicator */}
                <div className="text-xs text-gray-400 px-2 py-1 bg-slate-700 rounded">
                  {modalSize.width}×{modalSize.height}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setWorkspaceModalOpen(false);
                  }}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 p-0 bg-slate-900 overflow-auto w-full h-full scrollbar-thin scrollbar-track-slate-700 scrollbar-thumb-slate-500">
            {/* Mini TopBar for preview */}
            <div className="bg-slate-800 border-b border-slate-700">
              <TopBar
                onSave={() => console.log('Save clicked in preview')}
                onExport={() => console.log('Export clicked in preview')}
                onImport={() => console.log('Import clicked in preview')}
                onSettings={() => console.log('Settings clicked in preview')}
                onPlay={() => console.log('Play clicked in preview')}
                onPause={() => console.log('Pause clicked in preview')}
                onReset={() => console.log('Reset clicked in preview')}
                onFullscreen={() => console.log('Fullscreen clicked in preview')}
                onMinimize={() => console.log('Minimize clicked in preview')}
                onHelp={() => console.log('Help clicked in preview')}
                onShare={() => console.log('Share clicked in preview')}
                onChat={() => console.log('Chat clicked in preview')}
                onCollaborate={() => console.log('Collaborate clicked in preview')}
              />
            </div>
            <div className="w-full h-full min-h-[600px]">
              <BabylonWorkspace
                workspaceId="hero-workspace-preview"
                isAdmin={false}
                layoutMode="compact"
                performanceMode="medium"
                enablePhysics={false}
                enableXR={true}
                enableSpatialAudio={false}
                renderingQuality="high"
              />
            </div>
          </div>

          {/* Resize Handles */}
          {/* Corner handles */}
          <div
            className="absolute -bottom-1 -right-1 w-4 h-4 cursor-se-resize bg-slate-600 hover:bg-slate-500"
            onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
          />
          <div
            className="absolute -bottom-1 -left-1 w-4 h-4 cursor-sw-resize bg-slate-600 hover:bg-slate-500"
            onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
          />
          <div
            className="absolute -top-1 -right-1 w-4 h-4 cursor-ne-resize bg-slate-600 hover:bg-slate-500"
            onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
          />
          <div
            className="absolute -top-1 -left-1 w-4 h-4 cursor-nw-resize bg-slate-600 hover:bg-slate-500"
            onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
          />

          {/* Edge handles */}
          <div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-8 h-2 cursor-n-resize bg-slate-600 hover:bg-slate-500"
            onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
          />
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-8 h-2 cursor-s-resize bg-slate-600 hover:bg-slate-500"
            onMouseDown={(e) => handleResizeMouseDown(e, 's')}
          />
          <div
            className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-8 cursor-w-resize bg-slate-600 hover:bg-slate-500"
            onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
          />
          <div
            className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-8 cursor-e-resize bg-slate-600 hover:bg-slate-500"
            onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}
