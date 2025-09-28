import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "@babylonjs/loaders";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { useApi, apiCall } from '../../hooks/useApi';
import { projectId, publicAnonKey } from '../../supabase/client';
import { supabase } from '../../supabase/client';
import { useApp } from '../../contexts/AppContext';
import {
  Upload,
  File,
  X,
  CheckCircle,
  AlertCircle,
  FileType,
  HardDrive,
  Zap,
  Users,
  Tag,
  Eye,
  LogOut
} from 'lucide-react';

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  originalFormat: string;
  convertedSize?: string;
  optimizations?: string[];
}

export function UploadPage() {
  const navigate = useNavigate();
  const { setCurrentPage, setSelectedModel } = useApp();
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [modelTitle, setModelTitle] = useState('');
  const [modelDescription, setModelDescription] = useState('');
  const [modelTags, setModelTags] = useState('');
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch clients from backend
  const { data: clientsResponse, loading: clientsLoading } = useApi<{ clients: any[] }>('/clients');

  const supportedFormats = [
    '.glb', '.gltf', '.fbx', '.obj', '.dae', '.3ds', '.ply', 
    '.stl', '.x3d', '.blend', '.max', '.ma', '.mb', '.c4d', 
    '.lwo', '.lws', '.3dm', '.step', '.stp', '.iges', '.igs',
    '.dwg', '.dxf', '.ifc', '.skp', '.usd', '.usda', '.usdc'
  ];

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const validFiles: UploadFile[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      const maxSize = 500 * 1024 * 1024; // 500MB limit
      
      if (!supportedFormats.includes(extension)) {
        invalidFiles.push(`${file.name} (unsupported format)`);
        return;
      }
      
      if (file.size > maxSize) {
        invalidFiles.push(`${file.name} (file too large, max 500MB)`);
        return;
      }

      validFiles.push({
        file,
        id: Math.random().toString(36).substr(2, 9),
        progress: 0,
        status: 'pending' as const,
        originalFormat: extension
      });
    });

    if (invalidFiles.length > 0) {
      alert(`Some files were skipped:\n${invalidFiles.join('\n')}`);
    }

    setUploadFiles(prev => [...prev, ...validFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const startUpload = async () => {
    if (uploadFiles.length === 0 || !modelTitle) {
      alert('Please provide a title and select files to upload');
      return;
    }

    setIsUploading(true);

    try {
      for (const uploadFile of uploadFiles) {
        // Start upload
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadFile.id ? { ...f, status: 'uploading' } : f
        ));

        // Create FormData
        const formData = new FormData();
        formData.append('file', uploadFile.file);
        formData.append('title', modelTitle);
        formData.append('description', modelDescription);
        formData.append('tags', modelTags);
        formData.append('assignedClients', JSON.stringify(selectedClients));

        // Progress simulation while uploading
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += Math.random() * 15;
          if (progress < 95) {
            setUploadFiles(prev => prev.map(f => 
              f.id === uploadFile.id ? { ...f, progress } : f
            ));
          }
        }, 200);

        try {
          const { data: { session } } = await supabase.auth.getSession();
          const accessToken = session?.access_token || publicAnonKey;

          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-cf230d31/upload-model`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
              },
              body: formData
            }
          );

          clearInterval(progressInterval);

          if (response.ok) {
            setUploadFiles(prev => prev.map(f => 
              f.id === uploadFile.id ? { 
                ...f, 
                progress: 100, 
                status: 'complete',
                convertedSize: (uploadFile.file.size / (1024 * 1024)).toFixed(1) + ' MB'
              } : f
            ));
          } else {
            const error = await response.text();
            console.error('Upload error:', error);
            setUploadFiles(prev => prev.map(f => 
              f.id === uploadFile.id ? { ...f, status: 'error' } : f
            ));
          }
        } catch (error) {
          clearInterval(progressInterval);
          console.error('Upload error:', error);
          setUploadFiles(prev => prev.map(f => 
            f.id === uploadFile.id ? { ...f, status: 'error' } : f
          ));
        }
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleClientToggle = (clientId: number) => {
    setSelectedClients(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'pending':
        return <File className="w-5 h-5 text-gray-400" />;
      case 'uploading':
        return <Upload className="w-5 h-5 text-blue-400 animate-pulse" />;
      case 'processing':
        return <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />;
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusText = (status: UploadFile['status']) => {
    switch (status) {
      case 'pending':
        return 'Ready to upload';
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Optimizing & Converting...';
      case 'complete':
        return 'Complete';
      case 'error':
        return 'Error occurred';
    }
  };

  const handlePreviewModel = (uploadFile: UploadFile) => {
    // Create a blob URL for the uploaded file
    const modelUrl = URL.createObjectURL(uploadFile.file);
    
    const mockModel = {
      id: uploadFile.id,
      name: uploadFile.file.name.replace(/\.[^/.]+$/, ''),
      description: modelDescription || 'Uploaded 3D model',
      thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
      tags: modelTags.split(',').map(tag => tag.trim()).filter(Boolean),
      uploadDate: new Date().toISOString().split('T')[0],
      uploader: 'admin',
      size: uploadFile.convertedSize || (uploadFile.file.size / (1024 * 1024)).toFixed(1) + ' MB',
      format: 'glTF',
      assignedClients: selectedClients,
      views: 0,
      modelUrl: modelUrl
    };
    
    setSelectedModel(mockModel);
    setCurrentPage('babylon-workspace');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Upload Models</h2>
          <p className="text-gray-400">Upload and optimize 3D models for your clients</p>
        </div>
        <Button
          onClick={() => navigate('/login')}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-red-500/25 transform hover:scale-105 transition-all duration-300"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Back to Login
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="space-y-6">
          {/* Drag & Drop Area */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Upload Files</CardTitle>
              <CardDescription className="text-gray-400">
                Drag & drop 3D model files or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
                  isDragOver 
                    ? 'border-cyan-400 bg-cyan-400/10' 
                    : 'border-slate-600 hover:border-slate-500'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Drop your 3D models here
                </h3>
                <p className="text-gray-400 mb-4">
                  or click to browse your files (Max 500MB per file)
                </p>
                <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                  {supportedFormats.slice(0, 12).map((format) => (
                    <Badge key={format} variant="outline" className="text-xs border-slate-600 justify-center">
                      {format}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  +{supportedFormats.length - 12} more formats supported
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={supportedFormats.join(',')}
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                  title="Select 3D model files to upload"
                />
              </div>
            </CardContent>
          </Card>

          {/* Model Metadata */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Model Information</CardTitle>
              <CardDescription className="text-gray-400">
                Add metadata for better organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">Title</Label>
                <Input
                  id="title"
                  value={modelTitle}
                  onChange={(e) => setModelTitle(e.target.value)}
                  placeholder="e.g., Modern Office Chair"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={modelDescription}
                  onChange={(e) => setModelDescription(e.target.value)}
                  placeholder="Describe the model, its features, and intended use..."
                  className="bg-slate-700/50 border-slate-600 text-white min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="tags" className="text-white">Tags</Label>
                <Input
                  id="tags"
                  value={modelTags}
                  onChange={(e) => setModelTags(e.target.value)}
                  placeholder="furniture, chair, modern, office (comma separated)"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client Assignment & Upload Queue */}
        <div className="space-y-6">
          {/* Client Assignment */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Assign to Clients</CardTitle>
              <CardDescription className="text-gray-400">
                Select which clients can access this model
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clientsResponse?.clients?.map((client) => (
                  <div key={client.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={`client-${client.id}`}
                      checked={selectedClients.includes(client.id)}
                      onCheckedChange={() => handleClientToggle(client.id)}
                      className="border-slate-600 data-[state=checked]:bg-purple-500"
                    />
                    <Label 
                      htmlFor={`client-${client.id}`} 
                      className="text-white cursor-pointer flex-1"
                    >
                      {client.name}
                      <span className="text-gray-400 text-sm ml-2">@{client.username}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upload Queue */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Upload Queue
                {uploadFiles.length > 0 && (
                  <Button
                    onClick={startUpload}
                    disabled={uploadFiles.some(f => f.status === 'uploading' || f.status === 'processing')}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
                    size="sm"
                  >
                    Start Upload
                  </Button>
                )}
              </CardTitle>
              <CardDescription className="text-gray-400">
                Files ready for processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadFiles.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <FileType className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No files selected</p>
                  <p className="text-sm">Add files using the upload area above</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {uploadFiles.map((uploadFile) => (
                    <div key={uploadFile.id} className="border border-slate-600 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(uploadFile.status)}
                          <div>
                            <h4 className="text-white font-medium">{uploadFile.file.name}</h4>
                            <p className="text-sm text-gray-400">
                              {(uploadFile.file.size / (1024 * 1024)).toFixed(1)} MB • {uploadFile.originalFormat}
                            </p>
                          </div>
                        </div>
                        {uploadFile.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(uploadFile.id)}
                            className="text-gray-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">{getStatusText(uploadFile.status)}</span>
                          {uploadFile.status === 'uploading' && (
                            <span className="text-white">{Math.round(uploadFile.progress)}%</span>
                          )}
                        </div>
                        
                        {(uploadFile.status === 'uploading' || uploadFile.status === 'processing') && (
                          <Progress value={uploadFile.progress} className="h-2" />
                        )}

                        {uploadFile.status === 'processing' && uploadFile.optimizations && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-400 mb-1">Optimizations:</p>
                            <div className="flex flex-wrap gap-1">
                              {uploadFile.optimizations.map((opt, index) => (
                                <Badge key={index} variant="outline" className="text-xs border-yellow-400 text-yellow-400">
                                  {opt}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {uploadFile.status === 'complete' && (
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4 text-green-400">
                              <span className="flex items-center gap-1">
                                <HardDrive className="w-3 h-3" />
                                Saved {uploadFile.convertedSize}
                              </span>
                              <span className="flex items-center gap-1">
                                <FileType className="w-3 h-3" />
                                Converted to glTF
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
                              onClick={() => handlePreviewModel(uploadFile)}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Preview
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Optimization Tips */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Optimization Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p>Models are automatically optimized for web viewing with mesh simplification and texture compression.</p>
                </div>
                <div className="flex items-start gap-2">
                  <FileType className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p>All formats are converted to glTF 2.0 for maximum compatibility with Babylon.js.</p>
                </div>
                <div className="flex items-start gap-2">
                  <HardDrive className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <p>LOD (Level of Detail) versions are generated automatically for better performance.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}