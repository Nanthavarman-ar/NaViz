import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const QRCode = require('qrcode.react');
export const QRCodeTour = ({ tourId, tourData, onScan }) => {
    const [showQR, setShowQR] = useState(false);
    const qrValue = JSON.stringify({ tourId, tourData });
    return (_jsxs("div", { children: [_jsx("button", { className: "bg-cyan-600 text-white px-4 py-2 rounded mb-2", onClick: () => setShowQR(!showQR), children: showQR ? 'Hide QR Code' : 'Share Tour (QR)' }), showQR && (_jsxs("div", { className: "p-4 bg-white rounded shadow-lg inline-block", children: [_jsx(QRCode, { value: qrValue, size: 180 }), _jsx("div", { className: "mt-2 text-xs text-gray-700", children: "Scan to join this tour" })] }))] }));
};
