import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const ButtonTestRunner = () => {
    const [testResults, setTestResults] = useState({});
    const [isRunning, setIsRunning] = useState(false);
    const buttonTests = [
        { id: 'weather', selector: '[title="Weather System"]', name: 'Weather Toggle' },
        { id: 'flood', selector: '[title="Flood Simulation"]', name: 'Flood Toggle' },
        { id: 'wind', selector: '[title="Wind Tunnel"]', name: 'Wind Tunnel Toggle' },
        { id: 'noise', selector: '[title="Noise Simulation"]', name: 'Noise Toggle' },
        { id: 'shadow', selector: '[title="Shadow Analysis"]', name: 'Shadow Toggle' },
        { id: 'measure', selector: '[title="Measure Tool"]', name: 'Measure Tool Toggle' },
        { id: 'ai-advisor', selector: '[title="AI Structural Advisor"]', name: 'AI Advisor Toggle' },
        { id: 'property-inspector', selector: '[title="Property Inspector"]', name: 'Property Inspector Toggle' },
        { id: 'workspace-mode', selector: '[title="Workspace Mode"]', name: 'Workspace Mode Toggle' }
    ];
    const testButton = (test) => {
        try {
            const button = document.querySelector(test.selector);
            if (button) {
                // Check if button is clickable
                const isClickable = !button.disabled && button.offsetParent !== null;
                if (isClickable) {
                    return { status: 'pass', message: 'Button found and clickable' };
                }
                else {
                    return { status: 'fail', message: 'Button found but not clickable' };
                }
            }
            else {
                return { status: 'fail', message: 'Button not found in DOM' };
            }
        }
        catch (error) {
            return { status: 'fail', message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` };
        }
    };
    const runTests = async () => {
        setIsRunning(true);
        setTestResults({});
        for (const test of buttonTests) {
            await new Promise(resolve => setTimeout(resolve, 200));
            const result = testButton(test);
            setTestResults(prev => ({
                ...prev,
                [test.id]: result
            }));
        }
        setIsRunning(false);
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'pass': return 'text-green-400';
            case 'fail': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };
    const passedCount = Object.values(testResults).filter((r) => r.status === 'pass').length;
    const failedCount = Object.values(testResults).filter((r) => r.status === 'fail').length;
    return (_jsxs("div", { className: "fixed top-4 right-4 bg-slate-800 border border-slate-600 rounded-lg p-4 z-50 w-80", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-white font-bold", children: "Button Test" }), _jsx("button", { onClick: runTests, disabled: isRunning, className: "px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50", children: isRunning ? 'Testing...' : 'Test Buttons' })] }), Object.keys(testResults).length > 0 && (_jsx("div", { className: "mb-4", children: _jsxs("div", { className: "text-sm text-gray-300", children: ["Results: ", _jsxs("span", { className: "text-green-400", children: [passedCount, " passed"] }), ", ", _jsxs("span", { className: "text-red-400", children: [failedCount, " failed"] })] }) })), _jsx("div", { className: "space-y-2 max-h-60 overflow-y-auto", children: buttonTests.map((test) => {
                    const result = testResults[test.id];
                    return (_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-gray-300", children: test.name }), _jsx("span", { className: getStatusColor(result?.status), children: result?.status || 'pending' })] }, test.id));
                }) })] }));
};
export default ButtonTestRunner;
