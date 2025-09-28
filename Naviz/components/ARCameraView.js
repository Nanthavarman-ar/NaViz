import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
const ARCameraView = ({ scene, onModelPlace }) => {
    const [isActive, setIsActive] = useState(false);
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setIsActive(true);
        }
        catch (error) {
            console.error('Camera access denied:', error);
        }
    };
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
        setIsActive(false);
    };
    const placeModel = (event) => {
        if (!videoRef.current)
            return;
        const rect = videoRef.current.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
        const z = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
        if (onModelPlace) {
            onModelPlace({ x, y: 0, z });
        }
    };
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);
    return (_jsxs("div", { className: "bg-slate-800 border border-slate-600 rounded-lg p-3 text-white", children: [_jsxs("div", { className: "flex justify-between items-center mb-3", children: [_jsx("h3", { className: "font-bold", children: "AR Camera" }), _jsxs("button", { onClick: isActive ? stopCamera : startCamera, className: `px-3 py-1 rounded text-xs ${isActive ? 'bg-red-600' : 'bg-green-600'}`, children: [isActive ? 'Stop' : 'Start', " Camera"] })] }), isActive && (_jsxs("div", { className: "relative", children: [_jsx("video", { ref: videoRef, autoPlay: true, playsInline: true, onClick: placeModel, className: "w-full h-48 bg-black rounded cursor-crosshair" }), _jsx("div", { className: "absolute top-2 left-2 bg-black bg-opacity-50 p-2 rounded text-xs", children: "Click to place model" })] })), !isActive && (_jsx("div", { className: "w-full h-48 bg-gray-700 rounded flex items-center justify-center text-gray-400", children: "Camera not active" }))] }));
};
export default ARCameraView;
