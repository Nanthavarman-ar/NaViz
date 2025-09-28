import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, AlertCircle, Play } from 'lucide-react';
const BabylonWorkspaceButtonTest = () => {
    const [testResults, setTestResults] = useState({});
    const [isRunning, setIsRunning] = useState(false);
    const buttonTests = [
        // Simulation Features
        { id: 'weather-toggle', name: 'Weather System Toggle', category: 'Simulation', test: () => testWeatherToggle() },
        { id: 'flood-toggle', name: 'Flood Simulation Toggle', category: 'Simulation', test: () => testFloodToggle() },
        { id: 'enhanced-flood-toggle', name: 'Enhanced Flood Toggle', category: 'Simulation', test: () => testEnhancedFloodToggle() },
        { id: 'wind-tunnel-toggle', name: 'Wind Tunnel Toggle', category: 'Simulation', test: () => testWindTunnelToggle() },
        { id: 'noise-toggle', name: 'Noise Simulation Toggle', category: 'Simulation', test: () => testNoiseToggle() },
        { id: 'traffic-toggle', name: 'Traffic & Parking Toggle', category: 'Simulation', test: () => testTrafficToggle() },
        { id: 'shadow-toggle', name: 'Shadow Analysis Toggle', category: 'Simulation', test: () => testShadowToggle() },
        { id: 'circulation-toggle', name: 'Circulation Flow Toggle', category: 'Simulation', test: () => testCirculationToggle() },
        // Analysis Features
        { id: 'measure-toggle', name: 'Measure Tool Toggle', category: 'Analysis', test: () => testMeasureToggle() },
        { id: 'ergonomic-toggle', name: 'Ergonomic Testing Toggle', category: 'Analysis', test: () => testErgonomicToggle() },
        { id: 'energy-toggle', name: 'Energy Analysis Toggle', category: 'Analysis', test: () => testEnergyToggle() },
        { id: 'cost-estimator-toggle', name: 'Cost Estimator Toggle', category: 'Analysis', test: () => testCostEstimatorToggle() },
        { id: 'sound-privacy-toggle', name: 'Sound Privacy Toggle', category: 'Analysis', test: () => testSoundPrivacyToggle() },
        { id: 'furniture-toggle', name: 'Furniture Clearance Toggle', category: 'Analysis', test: () => testFurnitureToggle() },
        // AI Features
        { id: 'ai-advisor-toggle', name: 'AI Structural Advisor Toggle', category: 'AI', test: () => testAiAdvisorToggle() },
        { id: 'auto-furnish-toggle', name: 'Auto-Furnish Toggle', category: 'AI', test: () => testAutoFurnishToggle() },
        { id: 'ai-codesigner-toggle', name: 'AI Co-Designer Toggle', category: 'AI', test: () => testAiCoDesignerToggle() },
        { id: 'voice-chat-toggle', name: 'Voice Assistant Toggle', category: 'AI', test: () => testVoiceChatToggle() },
        // Environment Features
        { id: 'site-context-toggle', name: 'Site Context Toggle', category: 'Environment', test: () => testSiteContextToggle() },
        { id: 'topography-toggle', name: 'Topography Toggle', category: 'Environment', test: () => testTopographyToggle() },
        { id: 'lighting-mood-toggle', name: 'Lighting Moods Toggle', category: 'Environment', test: () => testLightingMoodToggle() },
        { id: 'geo-location-toggle', name: 'Geo Location Toggle', category: 'Environment', test: () => testGeoLocationToggle() },
        // Construction Features
        { id: 'construction-toggle', name: 'Construction Overlay Toggle', category: 'Construction', test: () => testConstructionToggle() },
        // Interaction Features
        { id: 'multi-sensory-toggle', name: 'Multi-Sensory Toggle', category: 'Interaction', test: () => testMultiSensoryToggle() },
        { id: 'vr-ar-toggle', name: 'VR/AR Mode Toggle', category: 'Interaction', test: () => testVrArToggle() },
        { id: 'hand-tracking-toggle', name: 'Hand Tracking Toggle', category: 'Interaction', test: () => testHandTrackingToggle() },
        // Collaboration Features
        { id: 'presenter-mode-toggle', name: 'Presenter Mode Toggle', category: 'Collaboration', test: () => testPresenterModeToggle() },
        { id: 'annotations-toggle', name: 'Annotations Toggle', category: 'Collaboration', test: () => testAnnotationsToggle() },
        // Utilities
        { id: 'property-inspector-toggle', name: 'Property Inspector Toggle', category: 'Utilities', test: () => testPropertyInspectorToggle() },
        { id: 'workspace-mode-toggle', name: 'Workspace Mode Toggle', category: 'Utilities', test: () => testWorkspaceModeToggle() },
        // Advanced Features
        { id: 'path-tracing-toggle', name: 'Path Tracing Toggle', category: 'Advanced', test: () => testPathTracingToggle() },
        { id: 'iot-integration-toggle', name: 'IoT Integration Toggle', category: 'Advanced', test: () => testIotIntegrationToggle() },
        // Animation Controls
        { id: 'animation-play-pause', name: 'Animation Play/Pause Button', category: 'Animation', test: () => testAnimationPlayPause() },
        { id: 'animation-selector', name: 'Animation Selector Dropdown', category: 'Animation', test: () => testAnimationSelector() },
        // Weather Controls
        { id: 'weather-type-selector', name: 'Weather Type Selector', category: 'Weather', test: () => testWeatherTypeSelector() },
        { id: 'weather-intensity-slider', name: 'Weather Intensity Slider', category: 'Weather', test: () => testWeatherIntensitySlider() },
        // Property Panel Controls
        { id: 'position-x-input', name: 'Position X Input', category: 'Property Panel', test: () => testPositionXInput() },
        { id: 'position-y-input', name: 'Position Y Input', category: 'Property Panel', test: () => testPositionYInput() },
        { id: 'position-z-input', name: 'Position Z Input', category: 'Property Panel', test: () => testPositionZInput() },
        { id: 'material-color-picker', name: 'Material Color Picker', category: 'Property Panel', test: () => testMaterialColorPicker() }
    ];
    // Test Functions
    const testWeatherToggle = () => {
        try {
            const button = document.querySelector('[title="Weather System"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Weather toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Weather toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testFloodToggle = () => {
        try {
            const button = document.querySelector('[title="Flood Simulation"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Flood toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Flood toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testEnhancedFloodToggle = () => {
        try {
            const button = document.querySelector('[title="Enhanced Flood"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Enhanced flood toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Enhanced flood toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testWindTunnelToggle = () => {
        try {
            const button = document.querySelector('[title="Wind Tunnel"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Wind tunnel toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Wind tunnel toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testNoiseToggle = () => {
        try {
            const button = document.querySelector('[title="Noise Simulation"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Noise simulation toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Noise simulation toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testTrafficToggle = () => {
        try {
            const button = document.querySelector('[title="Traffic & Parking"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Traffic & parking toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Traffic & parking toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testShadowToggle = () => {
        try {
            const button = document.querySelector('[title="Shadow Analysis"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Shadow analysis toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Shadow analysis toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testCirculationToggle = () => {
        try {
            const button = document.querySelector('[title="Circulation Flow"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Circulation flow toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Circulation flow toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testMeasureToggle = () => {
        try {
            const button = document.querySelector('[title="Measure Tool"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Measure tool toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Measure tool toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testErgonomicToggle = () => {
        try {
            const button = document.querySelector('[title="Ergonomic Testing"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Ergonomic testing toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Ergonomic testing toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testEnergyToggle = () => {
        try {
            const button = document.querySelector('[title="Energy Analysis"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Energy analysis toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Energy analysis toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testCostEstimatorToggle = () => {
        try {
            const button = document.querySelector('[title="Cost Estimator"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Cost estimator toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Cost estimator toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testSoundPrivacyToggle = () => {
        try {
            const button = document.querySelector('[title="Sound Privacy"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Sound privacy toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Sound privacy toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testFurnitureToggle = () => {
        try {
            const button = document.querySelector('[title="Furniture Clearance"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Furniture clearance toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Furniture clearance toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testAiAdvisorToggle = () => {
        try {
            const button = document.querySelector('[title="AI Structural Advisor"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'AI structural advisor toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'AI structural advisor toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testAutoFurnishToggle = () => {
        try {
            const button = document.querySelector('[title="Auto-Furnish"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Auto-furnish toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Auto-furnish toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testAiCoDesignerToggle = () => {
        try {
            const button = document.querySelector('[title="AI Co-Designer"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'AI co-designer toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'AI co-designer toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testVoiceChatToggle = () => {
        try {
            const button = document.querySelector('[title="Voice Assistant"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Voice assistant toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Voice assistant toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testSiteContextToggle = () => {
        try {
            const button = document.querySelector('[title="Site Context"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Site context toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Site context toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testTopographyToggle = () => {
        try {
            const button = document.querySelector('[title="Topography"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Topography toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Topography toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testLightingMoodToggle = () => {
        try {
            const button = document.querySelector('[title="Lighting Moods"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Lighting moods toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Lighting moods toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testGeoLocationToggle = () => {
        try {
            const button = document.querySelector('[title="Geo Location"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Geo location toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Geo location toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testConstructionToggle = () => {
        try {
            const button = document.querySelector('[title="Construction Overlay"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Construction overlay toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Construction overlay toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testMultiSensoryToggle = () => {
        try {
            const button = document.querySelector('[title="Multi-Sensory"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Multi-sensory toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Multi-sensory toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testVrArToggle = () => {
        try {
            const button = document.querySelector('[title="VR/AR Mode"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'VR/AR mode toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'VR/AR mode toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testHandTrackingToggle = () => {
        try {
            const button = document.querySelector('[title="Hand Tracking"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Hand tracking toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Hand tracking toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testPresenterModeToggle = () => {
        try {
            const button = document.querySelector('[title="Presenter Mode"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Presenter mode toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Presenter mode toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testAnnotationsToggle = () => {
        try {
            const button = document.querySelector('[title="Annotations"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Annotations toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Annotations toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testPropertyInspectorToggle = () => {
        try {
            const button = document.querySelector('[title="Property Inspector"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Property inspector toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Property inspector toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testWorkspaceModeToggle = () => {
        try {
            const button = document.querySelector('[title="Workspace Mode"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Workspace mode toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Workspace mode toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testPathTracingToggle = () => {
        try {
            const button = document.querySelector('[title="Path Tracing"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Path tracing toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'Path tracing toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testIotIntegrationToggle = () => {
        try {
            const button = document.querySelector('[title="IoT Integration"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'IoT integration toggle button clicked successfully' };
            }
            return { status: 'fail', message: 'IoT integration toggle button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testAnimationPlayPause = () => {
        try {
            const button = document.querySelector('[title="Play/Pause Animation"]');
            if (button) {
                button.click();
                return { status: 'pass', message: 'Animation play/pause button clicked successfully' };
            }
            return { status: 'fail', message: 'Animation play/pause button not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testAnimationSelector = () => {
        try {
            const selector = document.querySelector('[data-testid="animation-selector"]');
            if (selector) {
                return { status: 'pass', message: 'Animation selector found successfully' };
            }
            return { status: 'fail', message: 'Animation selector not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testWeatherTypeSelector = () => {
        try {
            const selector = document.querySelector('[data-testid="weather-type-selector"]');
            if (selector) {
                return { status: 'pass', message: 'Weather type selector found successfully' };
            }
            return { status: 'fail', message: 'Weather type selector not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testWeatherIntensitySlider = () => {
        try {
            const slider = document.querySelector('[data-testid="weather-intensity-slider"]');
            if (slider) {
                return { status: 'pass', message: 'Weather intensity slider found successfully' };
            }
            return { status: 'fail', message: 'Weather intensity slider not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testPositionXInput = () => {
        try {
            const input = document.querySelector('[data-testid="position-x-input"]');
            if (input) {
                return { status: 'pass', message: 'Position X input found successfully' };
            }
            return { status: 'fail', message: 'Position X input not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testPositionYInput = () => {
        try {
            const input = document.querySelector('[data-testid="position-y-input"]');
            if (input) {
                return { status: 'pass', message: 'Position Y input found successfully' };
            }
            return { status: 'fail', message: 'Position Y input not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testPositionZInput = () => {
        try {
            const input = document.querySelector('[data-testid="position-z-input"]');
            if (input) {
                return { status: 'pass', message: 'Position Z input found successfully' };
            }
            return { status: 'fail', message: 'Position Z input not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const testMaterialColorPicker = () => {
        try {
            const picker = document.querySelector('[data-testid="material-color-picker"]');
            if (picker) {
                return { status: 'pass', message: 'Material color picker found successfully' };
            }
            return { status: 'fail', message: 'Material color picker not found' };
        }
        catch (error) {
            return { status: 'fail', message: error.message };
        }
    };
    const runSingleTest = async (testId) => {
        const test = buttonTests.find(t => t.id === testId);
        if (!test)
            return;
        try {
            const result = test.test();
            setTestResults(prev => ({ ...prev, [testId]: result }));
        }
        catch (error) {
            setTestResults(prev => ({
                ...prev,
                [testId]: { status: 'fail', message: error.message }
            }));
        }
    };
    const runAllTests = async () => {
        setIsRunning(true);
        setTestResults({});
        for (const test of buttonTests) {
            try {
                const result = test.test();
                setTestResults(prev => ({ ...prev, [test.id]: result }));
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            catch (error) {
                setTestResults(prev => ({
                    ...prev,
                    [test.id]: { status: 'fail', message: error.message }
                }));
            }
        }
        setIsRunning(false);
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pass':
                return _jsx(CheckCircle, { className: "w-4 h-4 text-green-500" });
            case 'fail':
                return _jsx(XCircle, { className: "w-4 h-4 text-red-500" });
            default:
                return _jsx(AlertCircle, { className: "w-4 h-4 text-yellow-500" });
        }
    };
    const getStatusBadge = (status) => {
        const variant = status === 'pass' ? 'default' : status === 'fail' ? 'destructive' : 'secondary';
        return _jsx(Badge, { variant: variant, children: status });
    };
    const groupedTests = buttonTests.reduce((acc, test) => {
        if (!acc[test.category])
            acc[test.category] = [];
        acc[test.category].push(test);
        return acc;
    }, {});
    const totalTests = buttonTests.length;
    const completedTests = Object.keys(testResults).length;
    const passedTests = Object.values(testResults).filter(r => r.status === 'pass').length;
    const failedTests = Object.values(testResults).filter(r => r.status === 'fail').length;
    return (_jsxs("div", { className: "p-6 max-w-6xl mx-auto", children: [_jsxs(Card, { className: "mb-6", children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Play, { className: "w-5 h-5" }), "Babylon Workspace Button Test Suite"] }), _jsxs("div", { className: "flex gap-4 text-sm text-muted-foreground", children: [_jsxs("span", { children: ["Total: ", totalTests] }), _jsxs("span", { children: ["Completed: ", completedTests] }), _jsxs("span", { className: "text-green-600", children: ["Passed: ", passedTests] }), _jsxs("span", { className: "text-red-600", children: ["Failed: ", failedTests] })] })] }), _jsx(CardContent, { children: _jsx(Button, { onClick: runAllTests, disabled: isRunning, className: "mb-4", children: isRunning ? 'Running Tests...' : 'Run All Tests' }) })] }), _jsx("div", { className: "grid gap-6", children: Object.entries(groupedTests).map(([category, tests]) => (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "text-lg", children: [category, " Features"] }) }), _jsx(CardContent, { children: _jsx("div", { className: "grid gap-3", children: tests.map(test => {
                                    const result = testResults[test.id];
                                    return (_jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [result && getStatusIcon(result.status), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: test.name }), result && (_jsx("div", { className: "text-sm text-muted-foreground", children: result.message }))] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [result && getStatusBadge(result.status), _jsx(Button, { size: "sm", variant: "outline", onClick: () => runSingleTest(test.id), children: "Test" })] })] }, test.id));
                                }) }) })] }, category))) })] }));
};
export default BabylonWorkspaceButtonTest;
