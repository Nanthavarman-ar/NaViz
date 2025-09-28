import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
const MovementControlChecker = ({ camera, scene }) => {
    const [controls, setControls] = useState({
        wasd: false,
        mouse: false,
        touch: false,
        joystick: false,
        mobile: false,
        tablet: false,
        ios: false
    });
    const [activeInputs, setActiveInputs] = useState([]);
    useEffect(() => {
        if (!camera || !scene)
            return;
        const checkControls = () => {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth > 768;
            const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
            setControls({
                wasd: true, // Always available
                mouse: !isMobile,
                touch: isMobile || isTablet,
                joystick: !!navigator.getGamepads,
                mobile: isMobile,
                tablet: isTablet,
                ios: isIOS
            });
        };
        // WASD Controls
        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase();
            if (['w', 'a', 's', 'd'].includes(key)) {
                setActiveInputs(prev => [...prev.filter(i => i !== key), key]);
                const speed = 0.1;
                switch (key) {
                    case 'w':
                        camera.position.z += speed;
                        break;
                    case 's':
                        camera.position.z -= speed;
                        break;
                    case 'a':
                        camera.position.x -= speed;
                        break;
                    case 'd':
                        camera.position.x += speed;
                        break;
                }
            }
        };
        const handleKeyUp = (e) => {
            const key = e.key.toLowerCase();
            setActiveInputs(prev => prev.filter(i => i !== key));
        };
        // Touch Controls
        const handleTouchStart = (e) => {
            setActiveInputs(prev => [...prev, 'touch']);
        };
        const handleTouchEnd = () => {
            setActiveInputs(prev => prev.filter(i => i !== 'touch'));
        };
        // Gamepad Check
        const checkGamepad = () => {
            const gamepads = navigator.getGamepads();
            const hasActiveGamepad = Array.from(gamepads).some(gp => gp?.connected);
            if (hasActiveGamepad) {
                setActiveInputs(prev => prev.includes('gamepad') ? prev : [...prev, 'gamepad']);
            }
            else {
                setActiveInputs(prev => prev.filter(i => i !== 'gamepad'));
            }
        };
        checkControls();
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchend', handleTouchEnd);
        const gamepadInterval = setInterval(checkGamepad, 1000);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchend', handleTouchEnd);
            clearInterval(gamepadInterval);
        };
    }, [camera, scene]);
    const getStatus = (available, active = false) => {
        if (active)
            return '🟢';
        return available ? '✅' : '❌';
    };
    return (_jsxs("div", { className: "fixed bottom-20 left-4 bg-slate-800 border border-slate-600 rounded-lg p-3 z-50 text-xs text-white", children: [_jsx("div", { className: "font-bold mb-2", children: "Movement Controls" }), _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { children: ["WASD: ", getStatus(controls.wasd, activeInputs.some(i => ['w', 'a', 's', 'd'].includes(i)))] }), _jsxs("div", { children: ["Mouse: ", getStatus(controls.mouse)] }), _jsxs("div", { children: ["Touch: ", getStatus(controls.touch, activeInputs.includes('touch'))] }), _jsxs("div", { children: ["Joystick: ", getStatus(controls.joystick, activeInputs.includes('gamepad'))] }), _jsxs("div", { children: ["Mobile: ", getStatus(controls.mobile)] }), _jsxs("div", { children: ["Tablet: ", getStatus(controls.tablet)] }), _jsxs("div", { children: ["iOS: ", getStatus(controls.ios)] })] }), activeInputs.length > 0 && (_jsxs("div", { className: "mt-2 text-green-400", children: ["Active: ", activeInputs.join(', ')] }))] }));
};
export default MovementControlChecker;
