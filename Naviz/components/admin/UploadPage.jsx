import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Upload, File, X, Check, Image, Loader2, Trash2, Edit, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { supabase } from '../../supabase/client';
import { showToast } from '../utils/toast';

// Mock categories for model tagging
const categories = [
    'Furniture', 'Lighting', 'Electronics', 'Architecture', 'Decor', 'Office', 'Kitchen', 'Bathroom', 'Outdoor', 'Industrial'
];

export function UploadPage() {
    const navigate = useNavigate();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [newModel, setNewModel] = useState({
        name: '',
        description: '',
        category: '',
        tags: '',
        license: 'commercial',
        price: 0
    });
    const [errors, setErrors] = useState({});
    const [showPreviewDialog, setShowPreviewDialog] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || e.dataTransfer.files);
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e);
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const previewFileHandler = (file, index) => {
        setPreviewFile({ file, index });
        setShowPreviewDialog(true);
    };

    const validateModelForm = () => {
        const newErrors = {};
        if (!newModel.name.trim()) newErrors.name = 'Model name is required';
        if (!newModel.description.trim()) newErrors.description = 'Description is required';
        if (!newModel.category) newErrors.category = 'Category is required';
        if (newModel.price < 0) newErrors.price = 'Price cannot be negative';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            showToast.error('Please select files to upload');
            return;
        }

        if (!validateModelForm()) {
            showToast.error('Please fix form errors');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                const progress = ((i + 1) / selectedFiles.length) * 100;
                setUploadProgress(progress);

                // Validate file type
                const allowedTypes = ['.glb', '.gltf', '.fbx', '.obj', '.dae'];
                const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
                if (!allowedTypes.includes(fileExtension)) {
                    showToast.error(`Unsupported file type: ${file.name}`);
                    continue;
                }

                // Upload to Supabase Storage
                const fileName = `${Date.now()}_${file.name}`;
                const { data, error } = await supabase.storage
                    .from('models')
                    .upload(fileName, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (error) {
                    showToast.error(`Upload failed for ${file.name}: ${error.message}`);
                    continue;
                }

                // Create model record in database
                const modelData = {
                    name: newModel.name,
                    description: newModel.description,
                    category: newModel.category,
                    tags: newModel.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                    file_url: supabase.storage.from('models').getPublicUrl(fileName).data.publicUrl,
                    file_name: file.name,
                    file_size: file.size,
                    uploader: 'admin', // From auth context
                    license: newModel.license,
                    price: newModel.price,
                    status: 'pending_review'
                };

                const { error: dbError } = await supabase
                    .from('models')
                    .insert([modelData]);

                if (dbError) {
                    showToast.error(`Database error for ${file.name}: ${dbError.message}`);
                    // Optionally delete uploaded file if DB insert fails
                    await supabase.storage.from('models').remove([fileName]);
                    continue;
                }

                // Add to local state for preview
                setUploadedFiles(prev => [...prev, { ...modelData, id: Date.now() + i, uploadDate: new Date().toISOString() }]);

                showToast.success(`${file.name} uploaded successfully`);
            }

            setUploadProgress(100);
            setSelectedFiles([]);
            resetForm();
        } catch (error) {
            console.error('Upload error:', error);
            showToast.error('Upload process failed');
        } finally {
            setIsUploading(false);
            setTimeout(() => setUploadProgress(0), 2000);
        }
    };

    const resetForm = () => {
        setNewModel({
            name: '',
            description: '',
            category: '',
            tags: '',
            license: 'commercial',
            price: 0
        });
        setErrors({});
    };

    const handleEditModel = (modelId) => {
        // Navigate to models page for editing or open inline editor
        navigate('/?page=admin-dashboard&view=models');
        showToast.info('Model editing available in Models Library');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">Upload Models</h2>
                    <p className="text-gray-400">Add new 3D models to the library</p>
                </div>
                <Button onClick={() => navigate('/?page=login')} variant="outline" className="border-red-400 text-red-400">
                    Back to Login
                </Button>
            </div>

            {/* Upload Form */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">Model Information</CardTitle>
                    <CardDescription>Enter details for the model(s) being uploaded</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-white">Model Name *</Label>
                            <Input
                                value={newModel.name}
                                onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                                className={`bg-slate-700 border-slate-600 text-white ${errors.name ? 'border-red-500' : ''}`}
                                placeholder="e.g., Modern Conference Table"
                            />
                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <Label className="text-white">Category *</Label>
                            <select
                                value={newModel.category}
                                onChange={(e) => setNewModel({ ...newModel, category: e.target.value })}
                                className={`bg-slate-700 border-slate-600 text-white rounded-lg px-3 py-2 w-full ${errors.category ? 'border-red-500' : ''}`}
                            >
                                <option value="">Select category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <Label className="text-white">Description *</Label>
                            <Textarea
                                value={newModel.description}
                                onChange={(e) => setNewModel({ ...newModel, description: e.target.value })}
                                className={`bg-slate-700 border-slate-600 text-white ${errors.description ? 'border-red-500' : ''}`}
                                placeholder="Describe the model, materials, usage..."
                                rows={3}
                            />
                            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <Label className="text-white">Tags (comma-separated)</Label>
                            <Input
                                value={newModel.tags}
                                onChange={(e) => setNewModel({ ...newModel, tags: e.target.value })}
                                className="bg-slate-700 border-slate-600 text-white"
                                placeholder="e.g., furniture, office, modern"
                            />
                        </div>
                        <div>
                            <Label className="text-white">License Type</Label>
                            <select
                                value={newModel.license}
                                onChange={(e) => setNewModel({ ...newModel, license: e.target.value })}
                                className="bg-slate-700 border-slate-600 text-white rounded-lg px-3 py-2 w-full"
                            >
                                <option value="commercial">Commercial</option>
                                <option value="personal">Personal Use</option>
                                <option value="creative-commons">Creative Commons</option>
                            </select>
                        </div>
                        <div>
                            <Label className="text-white">Price ($)</Label>
                            <Input
                                type="number"
                                value={newModel.price}
                                onChange={(e) => setNewModel({ ...newModel, price: parseFloat(e.target.value) || 0 })}
                                className={`bg-slate-700 border-slate-600 text-white w-full ${errors.price ? 'border-red-500' : ''}`}
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                            />
                            {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* File Upload Area */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Select Files
                    </CardTitle>
                    <CardDescription>Supported formats: GLB, GLTF, FBX, OBJ, DAE (Max 100MB per file)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                            dragActive ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-600 hover:border-slate-500'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-white mb-2">Drag & drop files here, or click to browse</p>
                        <Input
                            type="file"
                            multiple
                            accept=".glb,.gltf,.fbx,.obj,.dae"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                        />
                        <Button asChild type="button" variant="outline" className="border-slate-600">
                            <label htmlFor="file-upload">
                                <File className="w-4 h-4 mr-2" />
                                Browse Files
                            </label>
                        </Button>
                    </div>

                    {selectedFiles.length > 0 && (
                        <div className="mt-6 space-y-3">
                            <h3 className="text-white font-medium">Selected Files ({selectedFiles.length})</h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded border border-slate-600">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <File className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-white truncate font-medium">{file.name}</p>
                                                <p className="text-sm text-gray-400">
                                                    {Math.round(file.size / 1024)} KB • {file.type}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => previewFileHandler(file, index)}
                                                className="border-blue-400 text-blue-400"
                                            >
                                                <Eye className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => removeFile(index)}
                                                className="border-red-400 text-red-400"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Upload Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleUpload}
                    disabled={isUploading || selectedFiles.length === 0}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 px-8"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Models
                        </>
                    )}
                </Button>
            </div>

            {/* Progress Bar */}
            {isUploading && (
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-white">Upload Progress</span>
                            <Badge variant="secondary">{Math.round(uploadProgress)}%</Badge>
                        </div>
                        <Progress value={uploadProgress} className="w-full" />
                    </CardContent>
                </Card>
            )}

            {/* Recently Uploaded */}
            {uploadedFiles.length > 0 && (
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">Recently Uploaded</CardTitle>
                        <CardDescription>Models successfully added to the library</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {uploadedFiles.slice(-5).map((model) => (
                                <div key={model.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded border border-slate-600">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded flex items-center justify-center">
                                            <File className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{model.name}</p>
                                            <p className="text-sm text-gray-400">{model.category} • {model.tags.join(', ')}</p>
                                        </div>
                                        <Badge variant="outline" className="border-green-400 text-green-400">
                                            {model.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" variant="outline" onClick={() => handleEditModel(model.id)}>
                                            <Edit className="w-3 h-3 mr-1" />
                                            Edit
                                        </Button>
                                        <Button size="sm" variant="outline" className="border-red-400 text-red-400">
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Preview Dialog */}
            <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
                <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Preview File</DialogTitle>
                        <DialogDescription>Preview of selected file before upload</DialogDescription>
                    </DialogHeader>
                    {previewFile && (
                        <div className="space-y-4">
                            <div className="text-center">
                                <p className="text-white font-medium">{previewFile.file.name}</p>
                                <p className="text-gray-400 text-sm">{Math.round(previewFile.file.size / 1024)} KB</p>
                            </div>
                            {/* For 3D files, show thumbnail or message */}
                            <div className="bg-slate-700/50 rounded p-4 text-center">
                                <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-400">3D model preview not available in upload dialog. View in Models Library after upload.</p>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
                                    Close
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {errors.name || errors.description || errors.category || errors.price ? (
                <Alert className="border-red-500/50 bg-red-500/10">
                    <AlertDescription className="text-red-400">
                        Please fix the errors above before uploading.
                    </AlertDescription>
                </Alert>
            ) : null}
        </div>
    );
}
