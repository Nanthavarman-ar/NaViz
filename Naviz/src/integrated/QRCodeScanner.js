import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import QrScanner from 'react-qr-scanner';
export const QRCodeScanner = ({ onScan, onError }) => {
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [delay] = useState(300);
    const handleScan = (data) => {
        if (data) {
            setScanResult(data);
            setScanning(false);
            onScan(data);
        }
    };
    const handleError = (err) => {
        if (onError) {
            onError(err);
        }
    };
    return (_jsxs("div", { children: [_jsx("button", { className: "bg-cyan-600 text-white px-4 py-2 rounded mb-2", onClick: () => setScanning(!scanning), children: scanning ? 'Stop Scanning' : 'Scan QR Code' }), scanning && (_jsx("div", { className: "p-2 bg-white rounded shadow-lg inline-block", children: _jsx(QrScanner, { delay: delay, onError: handleError, onScan: handleScan, style: { width: 220 } }) })), scanResult && (_jsxs("div", { className: "mt-2 text-xs text-gray-700", children: ["Scanned: ", scanResult] }))] }));
};
