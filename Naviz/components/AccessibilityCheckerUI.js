import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { AccessibilityChecker } from './AccessibilityChecker';
const AccessibilityCheckerUI = ({ bimManager, simulationManager, modelId }) => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const [filterSeverity, setFilterSeverity] = useState('all');
    const accessibilityChecker = new AccessibilityChecker();
    useEffect(() => {
        if (modelId) {
            runAccessibilityCheck();
        }
    }, [modelId]);
    const runAccessibilityCheck = async () => {
        if (!modelId)
            return;
        const model = bimManager.getModelById(modelId);
        if (!model)
            return;
        setLoading(true);
        try {
            accessibilityChecker.setModel(model);
            const foundIssues = accessibilityChecker.analyzeAccessibility();
            setIssues(foundIssues);
        }
        catch (error) {
            console.error('Failed to run accessibility check:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return '#f97316';
            case 'medium': return '#f59e0b';
            case 'low': return '#10b981';
            default: return '#6b7280';
        }
    };
    const getTypeIcon = (issueType) => {
        switch (issueType) {
            case 'wheelchair_path': return '♿';
            case 'door_width': return '🚪';
            case 'stairs': return '🪜';
            case 'ramp': return '♿';
            case 'elevator_access': return '🛗';
            default: return '⚠️';
        }
    };
    const filteredIssues = issues.filter(issue => {
        const typeMatch = filterType === 'all' || issue.issueType === filterType;
        const severityMatch = filterSeverity === 'all' || issue.severity === filterSeverity;
        return typeMatch && severityMatch;
    });
    if (!modelId) {
        return (_jsxs("div", { className: "accessibility-checker-container", children: [_jsx("h3", { className: "accessibility-checker-title", children: "Accessibility Checker" }), _jsx("p", { className: "accessibility-checker-subtitle", children: "Load a BIM model to check accessibility compliance" })] }));
    }
    return (_jsxs("div", { className: "accessibility-checker-container", children: [_jsxs("div", { className: "accessibility-checker-header", children: [_jsx("h3", { className: "accessibility-checker-title", children: "Accessibility Checker" }), _jsx("button", { onClick: runAccessibilityCheck, disabled: loading, className: `accessibility-checker-run-button ${loading ? 'disabled' : ''}`, children: loading ? 'Checking...' : 'Run Check' })] }), loading ? (_jsx("div", { className: "accessibility-checker-loading", children: _jsx("div", { children: "Running accessibility analysis..." }) })) : issues.length === 0 ? (_jsx("div", { className: "accessibility-checker-empty", children: "Click \"Run Check\" to analyze accessibility" })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "accessibility-checker-summary-cards", children: [_jsxs("div", { className: "summary-card", children: [_jsx("div", { className: "summary-card-value total-issues", children: issues.length }), _jsx("div", { className: "summary-card-label", children: "Total Issues" })] }), _jsxs("div", { className: "summary-card", children: [_jsxs("div", { className: "summary-card-value compliance-score", children: [Math.max(0, 100 - (issues.length * 10)).toFixed(1), "%"] }), _jsx("div", { className: "summary-card-label", children: "Compliance" })] })] }), _jsx("div", { className: "accessibility-checker-filters", children: _jsxs("div", { className: "filters-row", children: [_jsxs("select", { value: filterType, onChange: (e) => setFilterType(e.target.value), title: "Filter by accessibility type", className: "filter-select", children: [_jsx("option", { value: "all", children: "All Types" }), _jsx("option", { value: "mobility", children: "Mobility" }), _jsx("option", { value: "visual", children: "Visual" }), _jsx("option", { value: "hearing", children: "Hearing" }), _jsx("option", { value: "cognitive", children: "Cognitive" })] }), _jsxs("select", { value: filterSeverity, onChange: (e) => setFilterSeverity(e.target.value), title: "Filter by severity", className: "filter-select", children: [_jsx("option", { value: "all", children: "All Severities" }), _jsx("option", { value: "critical", children: "Critical" }), _jsx("option", { value: "high", children: "High" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "low", children: "Low" })] })] }) }), _jsxs("div", { className: "accessibility-checker-issues-section", children: [_jsxs("h4", { className: "issues-section-title", children: ["Issues (", filteredIssues.length, ")"] }), _jsx("div", { className: "issues-list-container", children: filteredIssues.length === 0 ? (_jsx("div", { className: "no-issues-message", children: "No issues found with current filters" })) : (filteredIssues.map((issue) => (_jsxs("div", { onClick: () => setSelectedIssue(issue), className: `issue-item ${selectedIssue?.id === issue.id ? 'selected' : ''}`, children: [_jsxs("div", { className: "issue-header", children: [_jsx("span", { className: "issue-icon", children: getTypeIcon(issue.issueType) }), _jsx("span", { className: `issue-severity severity-${issue.severity}`, children: issue.severity }), _jsx("span", { className: "issue-type", children: issue.issueType })] }), _jsx("div", { className: "issue-description", children: issue.description }), _jsxs("div", { className: "issue-location", children: ["Location: (", issue.location.center.x.toFixed(1), ", ", issue.location.center.y.toFixed(1), ", ", issue.location.center.z.toFixed(1), ")"] })] }, issue.id)))) })] }), selectedIssue && (_jsxs("div", { className: `selected-issue-details severity-border-${selectedIssue.severity}`, children: [_jsxs("h4", { className: "selected-issue-title", children: [getTypeIcon(selectedIssue.issueType), " ", selectedIssue.description] }), _jsxs("div", { className: "selected-issue-info", children: [_jsxs("div", { className: "issue-info-item", children: [_jsx("strong", { children: "Type:" }), " ", selectedIssue.issueType] }), _jsxs("div", { className: "issue-info-item", children: [_jsx("strong", { children: "Severity:" }), _jsx("span", { className: `severity-text severity-${selectedIssue.severity}`, children: selectedIssue.severity.toUpperCase() })] }), _jsxs("div", { className: "issue-info-item", children: [_jsx("strong", { children: "Location:" }), " (", selectedIssue.location.center.x.toFixed(1), ", ", selectedIssue.location.center.y.toFixed(1), ", ", selectedIssue.location.center.z.toFixed(1), ")"] })] })] }))] }))] }));
};
export default AccessibilityCheckerUI;
