import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { SustainabilityManager } from './SustainabilityManager';
import { AccessibilityChecker } from './AccessibilityChecker';
import { LocalCodeValidator } from './LocalCodeValidator';
import './SustainabilityCompliancePanel.css';
const SustainabilityCompliancePanel = ({ scene, bimManager, simulationManager }) => {
    const [activeTab, setActiveTab] = useState('sustainability');
    const [sustainabilityReport, setSustainabilityReport] = useState(null);
    const [accessibilityIssues, setAccessibilityIssues] = useState([]);
    const [complianceIssues, setComplianceIssues] = useState([]);
    const [fireSafetyData, setFireSafetyData] = useState(null);
    // Initialize managers
    const sustainabilityManager = new SustainabilityManager(bimManager, simulationManager);
    const accessibilityChecker = new AccessibilityChecker();
    const localCodeValidator = new LocalCodeValidator();
    useEffect(() => {
        // Initialize with current BIM model if available
        const models = bimManager.getAllModels();
        if (models.length > 0) {
            const currentModel = models[0];
            accessibilityChecker.setModel(currentModel);
            localCodeValidator.setModel(currentModel);
            // Generate initial reports
            updateSustainabilityReport();
            updateAccessibilityIssues();
            updateComplianceIssues();
        }
    }, [bimManager, simulationManager]);
    const updateSustainabilityReport = () => {
        const models = bimManager.getAllModels();
        if (models.length > 0) {
            const report = sustainabilityManager.generateReport(models[0].id);
            setSustainabilityReport(report);
        }
    };
    const updateAccessibilityIssues = () => {
        const issues = accessibilityChecker.analyzeAccessibility();
        setAccessibilityIssues(issues);
    };
    const updateComplianceIssues = () => {
        const issues = localCodeValidator.validateCompliance();
        setComplianceIssues(issues);
    };
    // Enhanced compliance validation with detailed rule checking
    const runDetailedComplianceCheck = () => {
        const models = bimManager.getAllModels();
        if (models.length > 0) {
            const currentModel = models[0];
            localCodeValidator.setModel(currentModel);
            // Run comprehensive validation
            const issues = localCodeValidator.validateCompliance();
            // Group issues by type for better organization
            const groupedIssues = issues.reduce((acc, issue) => {
                if (!acc[issue.issueType]) {
                    acc[issue.issueType] = [];
                }
                acc[issue.issueType].push(issue);
                return acc;
            }, {});
            setComplianceIssues(issues);
            return groupedIssues;
        }
        return {};
    };
    // Resolve compliance issue
    const resolveComplianceIssue = (issueId) => {
        const success = localCodeValidator.resolveIssue(issueId);
        if (success) {
            updateComplianceIssues();
        }
    };
    // Generate compliance report
    const generateComplianceReport = () => {
        const models = bimManager.getAllModels();
        if (models.length === 0)
            return null;
        const issues = localCodeValidator.validateCompliance();
        const groupedIssues = issues.reduce((acc, issue) => {
            if (!acc[issue.issueType]) {
                acc[issue.issueType] = [];
            }
            acc[issue.issueType].push(issue);
            return acc;
        }, {});
        return {
            modelName: models[0].name || 'Unnamed Model',
            totalIssues: issues.length,
            criticalIssues: issues.filter(i => i.severity === 'critical').length,
            highIssues: issues.filter(i => i.severity === 'high').length,
            mediumIssues: issues.filter(i => i.severity === 'medium').length,
            lowIssues: issues.filter(i => i.severity === 'low').length,
            issuesByType: groupedIssues,
            complianceScore: Math.max(0, 100 - (issues.length * 5)), // Simple scoring
            generatedAt: new Date().toISOString()
        };
    };
    const getGreenScoreColor = (score) => {
        if (score >= 0.8)
            return '#10b981'; // green
        if (score >= 0.6)
            return '#f59e0b'; // yellow
        return '#ef4444'; // red
    };
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return '#ef4444';
            case 'medium': return '#f59e0b';
            case 'low': return '#10b981';
            default: return '#6b7280';
        }
    };
    return (_jsxs("div", { className: "sustainability-panel", children: [_jsx("h3", { children: "Sustainability & Compliance" }), _jsx("div", { className: "tab-navigation", children: [
                    { id: 'sustainability', label: 'Green Score', icon: '🌱' },
                    { id: 'accessibility', label: 'Accessibility', icon: '♿' },
                    { id: 'compliance', label: 'Code Compliance', icon: '📋' },
                    { id: 'fire-safety', label: 'Fire Safety', icon: '🔥' }
                ].map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab.id), className: `tab-button ${activeTab === tab.id ? 'active' : 'inactive'}`, children: [_jsx("span", { children: tab.icon }), _jsx("span", { children: tab.label })] }, tab.id))) }), activeTab === 'sustainability' && (_jsxs("div", { children: [_jsx("h4", { children: "Green Score Preview" }), sustainabilityReport ? (_jsxs("div", { children: [_jsxs("div", { className: "green-score-display", children: [_jsxs("div", { className: `green-score-number ${sustainabilityReport.greenScore >= 0.8 ? 'green-score-green' :
                                            sustainabilityReport.greenScore >= 0.6 ? 'green-score-yellow' : 'green-score-red'}`, children: [Math.round(sustainabilityReport.greenScore * 100), "%"] }), _jsx("div", { className: "green-score-label", children: "LEED/BREEAM Certification Score" })] }), _jsxs("div", { className: "energy-dashboard", children: [_jsx("h5", { children: "Energy Dashboard" }), _jsxs("div", { className: "energy-grid", children: [_jsxs("div", { className: "energy-item", children: [_jsxs("div", { className: "energy-value energy-efficiency", children: [sustainabilityReport.energyEfficiency.toFixed(1), "%"] }), _jsx("div", { className: "energy-label", children: "Energy Efficiency" })] }), _jsxs("div", { className: "energy-item", children: [_jsxs("div", { className: "energy-value renewable-energy", children: [sustainabilityReport.renewableEnergyUsage.toFixed(1), "%"] }), _jsx("div", { className: "energy-label", children: "Renewable Energy" })] }), _jsxs("div", { className: "energy-item", children: [_jsxs("div", { className: "energy-value predicted-usage", children: [Math.round(sustainabilityReport.energyUsage), " kWh"] }), _jsx("div", { className: "energy-label", children: "Predicted Usage" })] }), _jsxs("div", { className: "energy-item", children: [_jsxs("div", { className: "energy-value carbon-footprint", children: [Math.round(sustainabilityReport.carbonFootprint), " kg"] }), _jsx("div", { className: "energy-label", children: "CO2 Footprint" })] })] })] }), sustainabilityReport.recommendations.length > 0 && (_jsxs("div", { className: "recommendations-container", children: [_jsx("h5", { children: "Recommendations" }), _jsx("div", { className: "recommendations-list", children: sustainabilityReport.recommendations.map((rec, index) => (_jsx("div", { className: "recommendation-item", children: rec }, index))) })] }))] })) : (_jsx("div", { className: "no-data-message", children: "No BIM model loaded" }))] })), activeTab === 'accessibility' && (_jsxs("div", { children: [_jsx("h4", { children: "Accessibility Checker" }), _jsx("div", { style: { marginBottom: '12px' }, children: _jsx("button", { onClick: updateAccessibilityIssues, className: "scan-button", children: "\uD83D\uDD0D Scan for Issues" }) }), _jsx("div", { className: "issues-container", children: accessibilityIssues.length > 0 ? (accessibilityIssues.map((issue) => (_jsxs("div", { className: `issue-item ${issue.severity === 'high' ? 'severity-border-high' :
                                issue.severity === 'medium' ? 'severity-border-medium' : 'severity-border-low'}`, children: [_jsx("div", { className: "issue-type", children: issue.issueType.replace('_', ' ').toUpperCase() }), _jsx("div", { className: "issue-description", children: issue.description }), _jsxs("div", { className: `issue-severity ${issue.severity === 'high' ? 'severity-high' :
                                        issue.severity === 'medium' ? 'severity-medium' : 'severity-low'}`, children: ["Severity: ", issue.severity.toUpperCase()] })] }, issue.id)))) : (_jsx("div", { className: "no-data-message", children: "No accessibility issues found" })) })] })), activeTab === 'compliance' && (_jsxs("div", { children: [_jsx("h4", { children: "Local Code Compliance" }), _jsx("div", { style: { marginBottom: '12px' }, children: _jsx("button", { onClick: updateComplianceIssues, className: "scan-button", children: "\uD83D\uDCCB Check Compliance" }) }), _jsx("div", { className: "issues-container", children: complianceIssues.length > 0 ? (complianceIssues.map((issue) => (_jsxs("div", { className: `issue-item ${issue.severity === 'high' ? 'severity-border-high' :
                                issue.severity === 'medium' ? 'severity-border-medium' : 'severity-border-low'}`, children: [_jsx("div", { className: "issue-type", children: issue.issueType.toUpperCase() }), _jsx("div", { className: "issue-description", children: issue.description }), _jsxs("div", { className: `issue-severity ${issue.severity === 'high' ? 'severity-high' :
                                        issue.severity === 'medium' ? 'severity-medium' : 'severity-low'}`, children: ["Severity: ", issue.severity.toUpperCase()] })] }, issue.id)))) : (_jsx("div", { className: "no-data-message", children: "All codes compliant" })) })] })), activeTab === 'fire-safety' && (_jsxs("div", { children: [_jsx("h4", { children: "Fire Safety Simulation" }), _jsx("div", { style: { marginBottom: '12px' }, children: _jsx("button", { onClick: () => {
                                // Placeholder for fire safety simulation
                                setFireSafetyData({
                                    evacuationPaths: ['Path 1: 2.5m wide', 'Path 2: 1.8m wide'],
                                    sprinklerCoverage: '85%',
                                    smokeSpread: 'Low risk detected'
                                });
                            }, className: "fire-safety-button", children: "\uD83D\uDD25 Run Fire Simulation" }) }), fireSafetyData ? (_jsxs("div", { className: "fire-safety-results", children: [_jsxs("div", { className: "fire-safety-item", children: [_jsx("div", { className: "fire-safety-label", children: "Evacuation Paths" }), fireSafetyData.evacuationPaths.map((path, index) => (_jsx("div", { className: "fire-safety-value", children: path }, index)))] }), _jsxs("div", { className: "fire-safety-item", children: [_jsx("div", { className: "fire-safety-label", children: "Sprinkler Coverage" }), _jsx("div", { className: "fire-safety-value fire-safety-good", children: fireSafetyData.sprinklerCoverage })] }), _jsxs("div", { className: "fire-safety-item", children: [_jsx("div", { className: "fire-safety-label", children: "Smoke Spread Analysis" }), _jsx("div", { className: "fire-safety-value fire-safety-warning", children: fireSafetyData.smokeSpread })] })] })) : (_jsx("div", { className: "no-data-message", children: "Click \"Run Fire Simulation\" to analyze fire safety" }))] }))] }));
};
export default SustainabilityCompliancePanel;
