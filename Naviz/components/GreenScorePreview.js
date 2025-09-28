import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
const GreenScorePreview = ({ bimManager, sustainabilityManager, modelId }) => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedCertification, setSelectedCertification] = useState('LEED');
    useEffect(() => {
        if (modelId) {
            generateReport();
        }
    }, [modelId, selectedCertification]);
    const generateReport = async () => {
        if (!modelId)
            return;
        setLoading(true);
        try {
            const sustainabilityReport = sustainabilityManager.generateReport(modelId);
            setReport(sustainabilityReport);
        }
        catch (error) {
            console.error('Failed to generate sustainability report:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const getScoreColor = (score) => {
        if (score >= 80)
            return '#10b981'; // green
        if (score >= 60)
            return '#f59e0b'; // yellow
        if (score >= 40)
            return '#f97316'; // orange
        return '#ef4444'; // red
    };
    const getCertificationLevel = (score, type) => {
        if (type === 'LEED') {
            if (score >= 80)
                return 'Platinum';
            if (score >= 60)
                return 'Gold';
            if (score >= 50)
                return 'Silver';
            if (score >= 40)
                return 'Certified';
            return 'Not Certified';
        }
        else {
            if (score >= 85)
                return 'Outstanding';
            if (score >= 70)
                return 'Excellent';
            if (score >= 55)
                return 'Very Good';
            if (score >= 45)
                return 'Good';
            if (score >= 30)
                return 'Pass';
            return 'Unclassified';
        }
    };
    if (!modelId) {
        return (_jsxs("div", { style: {
                padding: '16px',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9'
            }, children: [_jsx("h3", { style: { margin: '0 0 16px 0', fontSize: '16px' }, children: "Green Score Preview" }), _jsx("p", { style: { color: '#94a3b8' }, children: "Load a BIM model to see sustainability analysis" })] }));
    }
    return (_jsxs("div", { style: {
            padding: '16px',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#f1f5f9'
        }, children: [_jsx("h3", { style: { margin: '0 0 16px 0', fontSize: '16px' }, children: "Green Score Preview" }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("label", { style: { display: 'block', marginBottom: '8px', fontSize: '14px' }, children: "Certification Type:" }), _jsxs("select", { value: selectedCertification, onChange: (e) => setSelectedCertification(e.target.value), title: "Select certification type", style: {
                            width: '100%',
                            padding: '8px',
                            background: '#334155',
                            border: '1px solid #475569',
                            borderRadius: '4px',
                            color: '#f1f5f9',
                            fontSize: '14px'
                        }, children: [_jsx("option", { value: "LEED", children: "LEED" }), _jsx("option", { value: "BREEAM", children: "BREEAM" })] })] }), loading ? (_jsx("div", { style: { textAlign: 'center', padding: '20px' }, children: _jsx("div", { children: "Analyzing sustainability..." }) })) : report ? (_jsxs(_Fragment, { children: [_jsxs("div", { style: {
                            textAlign: 'center',
                            marginBottom: '20px',
                            padding: '20px',
                            background: '#334155',
                            borderRadius: '8px'
                        }, children: [_jsx("div", { style: {
                                    fontSize: '48px',
                                    fontWeight: 'bold',
                                    color: getScoreColor(report.greenScore * 100),
                                    marginBottom: '8px'
                                }, children: (report.greenScore * 100).toFixed(1) }), _jsx("div", { style: { fontSize: '18px', color: '#94a3b8' }, children: getCertificationLevel(report.greenScore * 100, selectedCertification) }), _jsxs("div", { style: { fontSize: '14px', color: '#64748b' }, children: [selectedCertification, " Score"] })] }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("h4", { style: { margin: '0 0 12px 0', fontSize: '14px' }, children: "Score Breakdown" }), _jsxs("div", { style: { marginBottom: '8px' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }, children: [_jsx("span", { style: { fontSize: '12px' }, children: "Energy Efficiency" }), _jsxs("span", { style: { fontSize: '12px', color: getScoreColor(report.energyEfficiency * 100) }, children: [(report.energyEfficiency * 100).toFixed(1), "%"] })] }), _jsx("div", { style: {
                                            width: '100%',
                                            height: '6px',
                                            background: '#334155',
                                            borderRadius: '3px',
                                            overflow: 'hidden'
                                        }, children: _jsx("div", { style: {
                                                width: `${report.energyEfficiency * 100}%`,
                                                height: '100%',
                                                background: getScoreColor(report.energyEfficiency * 100),
                                                borderRadius: '3px'
                                            } }) })] }), _jsxs("div", { style: { marginBottom: '8px' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }, children: [_jsx("span", { style: { fontSize: '12px' }, children: "Water Efficiency" }), _jsxs("span", { style: { fontSize: '12px', color: getScoreColor(report.waterEfficiency * 100) }, children: [(report.waterEfficiency * 100).toFixed(1), "%"] })] }), _jsx("div", { style: {
                                            width: '100%',
                                            height: '6px',
                                            background: '#334155',
                                            borderRadius: '3px',
                                            overflow: 'hidden'
                                        }, children: _jsx("div", { style: {
                                                width: `${report.waterEfficiency * 100}%`,
                                                height: '100%',
                                                background: getScoreColor(report.waterEfficiency * 100),
                                                borderRadius: '3px'
                                            } }) })] }), _jsxs("div", { style: { marginBottom: '8px' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }, children: [_jsx("span", { style: { fontSize: '12px' }, children: "Renewable Energy" }), _jsxs("span", { style: { fontSize: '12px', color: getScoreColor(report.renewableEnergyUsage * 100) }, children: [(report.renewableEnergyUsage * 100).toFixed(1), "%"] })] }), _jsx("div", { style: {
                                            width: '100%',
                                            height: '6px',
                                            background: '#334155',
                                            borderRadius: '3px',
                                            overflow: 'hidden'
                                        }, children: _jsx("div", { style: {
                                                width: `${report.renewableEnergyUsage * 100}%`,
                                                height: '100%',
                                                background: getScoreColor(report.renewableEnergyUsage * 100),
                                                borderRadius: '3px'
                                            } }) })] })] }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("h4", { style: { margin: '0 0 12px 0', fontSize: '14px' }, children: "Key Metrics" }), _jsxs("div", { style: { fontSize: '12px', color: '#94a3b8' }, children: [_jsxs("div", { children: ["Carbon Footprint: ", report.carbonFootprint.toFixed(1), " kg CO\u2082/year"] }), _jsxs("div", { children: ["Energy Usage: ", report.energyUsage.toFixed(1), " kWh/year"] }), _jsxs("div", { children: ["Water Footprint: ", report.waterFootprint.toFixed(1), " m\u00B3/year"] })] })] }), _jsxs("div", { children: [_jsx("h4", { style: { margin: '0 0 12px 0', fontSize: '14px' }, children: "Top Recommendations" }), _jsx("div", { style: { maxHeight: '120px', overflowY: 'auto' }, children: report.recommendations.slice(0, 5).map((rec, index) => (_jsx("div", { style: {
                                        padding: '8px',
                                        marginBottom: '4px',
                                        background: '#334155',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        color: '#cbd5e1'
                                    }, children: rec }, index))) })] })] })) : (_jsx("div", { style: { textAlign: 'center', padding: '20px', color: '#94a3b8' }, children: "No sustainability data available" }))] }));
};
export default GreenScorePreview;
