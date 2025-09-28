import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
const EnergyDashboard = ({ bimManager, simulationManager, modelId }) => {
    const [energyData, setEnergyData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [timeRange, setTimeRange] = useState('month');
    useEffect(() => {
        if (modelId) {
            loadEnergyData();
        }
    }, [modelId, timeRange]);
    const loadEnergyData = async () => {
        if (!modelId)
            return;
        setLoading(true);
        try {
            // Simulate energy data calculation
            const data = await calculateEnergyData(modelId);
            setEnergyData(data);
        }
        catch (error) {
            console.error('Failed to load energy data:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const calculateEnergyData = async (modelId) => {
        // Get BIM model data for energy calculations
        const bimModel = bimManager.getModelById(modelId);
        let bimEnergyData;
        if (bimModel) {
            // Calculate BIM-based energy metrics
            const buildingVolume = bimModel.elements.reduce((volume, element) => {
                const scale = element.scale;
                return volume + (scale.x * scale.y * scale.z);
            }, 0);
            const materialEfficiency = simulationManager.calculateEnergyEfficiency ?
                simulationManager.calculateEnergyEfficiency(modelId) : 0.7;
            const energyIntensity = buildingVolume > 0 ? 150 * (1 - materialEfficiency) : 150; // kWh/m³/year
            bimEnergyData = {
                materialEfficiency,
                systemEfficiency: 0.8, // Would come from MEP systems analysis
                buildingVolume,
                energyIntensity
            };
        }
        // Get simulation data
        let simulationData;
        if (simulationManager) {
            const currentLoad = simulationManager.calculateEnergyUsage ?
                simulationManager.calculateEnergyUsage(modelId) : 1000;
            simulationData = {
                currentLoad,
                predictedConsumption: currentLoad * 1.1, // 10% increase prediction
                maintenanceImpact: 0.05, // 5% efficiency loss due to maintenance
                weatherAdjustment: 0.02 // 2% weather impact
            };
        }
        // Base energy calculations with BIM and simulation integration
        const baseConsumption = bimEnergyData ?
            (bimEnergyData.buildingVolume * bimEnergyData.energyIntensity / 12) : 1000; // Monthly consumption
        const renewableGeneration = bimEnergyData ?
            baseConsumption * (bimEnergyData.materialEfficiency * 0.3) : 250; // Renewable based on efficiency
        const peakDemand = baseConsumption / 720; // Average peak demand calculation
        // Calculate efficiency with BIM and simulation factors
        let efficiency = 0.75;
        if (bimEnergyData) {
            efficiency = (bimEnergyData.materialEfficiency + bimEnergyData.systemEfficiency) / 2;
        }
        if (simulationData) {
            efficiency -= simulationData.maintenanceImpact;
            efficiency += simulationData.weatherAdjustment;
        }
        efficiency = Math.max(0.1, Math.min(1.0, efficiency));
        const costPerKwh = 0.12;
        const carbonFactor = 0.4; // kg CO2 per kWh
        // Generate hourly data with more realistic patterns
        const hours = timeRange === 'day' ? 24 : timeRange === 'week' ? 168 : timeRange === 'month' ? 720 : 8760;
        const hourlyData = Array.from({ length: hours }, (_, index) => {
            // Create realistic consumption patterns
            const hourOfDay = index % 24;
            const baseLoad = baseConsumption / hours;
            // Peak hours (9-5 work hours)
            const isPeakHour = hourOfDay >= 9 && hourOfDay <= 17;
            const peakMultiplier = isPeakHour ? 1.5 : 0.7;
            // Weekend adjustment
            const dayOfWeek = Math.floor(index / 24) % 7;
            const isWeekend = dayOfWeek >= 5;
            const weekendMultiplier = isWeekend ? 0.8 : 1.0;
            // Random variation
            const randomVariation = 0.8 + Math.random() * 0.4;
            return baseLoad * peakMultiplier * weekendMultiplier * randomVariation;
        });
        // Device capabilities detection
        const deviceCapabilities = {
            webgpu: typeof navigator !== 'undefined' && 'gpu' in navigator,
            webxr: typeof navigator !== 'undefined' && 'xr' in navigator,
            performanceScore: typeof performance !== 'undefined' ? performance.now() : 0
        };
        return {
            totalConsumption: baseConsumption,
            renewableGeneration,
            netConsumption: baseConsumption - renewableGeneration,
            peakDemand,
            efficiency,
            cost: baseConsumption * costPerKwh,
            carbonFootprint: baseConsumption * carbonFactor,
            hourlyData,
            bimEnergyData,
            simulationData,
            deviceCapabilities
        };
    };
    const formatEnergy = (value, unit = 'kWh') => {
        if (value >= 1000) {
            return `${(value / 1000).toFixed(1)} M${unit}`;
        }
        return `${value.toFixed(1)} ${unit}`;
    };
    const getEfficiencyColor = (efficiency) => {
        if (efficiency >= 0.8)
            return '#10b981';
        if (efficiency >= 0.6)
            return '#f59e0b';
        if (efficiency >= 0.4)
            return '#f97316';
        return '#ef4444';
    };
    if (!modelId) {
        return (_jsxs("div", { style: {
                padding: '16px',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9'
            }, children: [_jsx("h3", { style: { margin: '0 0 16px 0', fontSize: '16px' }, children: "Energy Dashboard" }), _jsx("p", { style: { color: '#94a3b8' }, children: "Load a BIM model to view energy analysis" })] }));
    }
    return (_jsxs("div", { style: {
            padding: '16px',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#f1f5f9'
        }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }, children: [_jsx("h3", { style: { margin: 0, fontSize: '16px' }, children: "Energy Dashboard" }), _jsxs("select", { value: timeRange, onChange: (e) => setTimeRange(e.target.value), title: "Select time range", style: {
                            padding: '4px 8px',
                            background: '#334155',
                            border: '1px solid #475569',
                            borderRadius: '4px',
                            color: '#f1f5f9',
                            fontSize: '12px'
                        }, children: [_jsx("option", { value: "day", children: "Day" }), _jsx("option", { value: "week", children: "Week" }), _jsx("option", { value: "month", children: "Month" }), _jsx("option", { value: "year", children: "Year" })] })] }), loading ? (_jsx("div", { style: { textAlign: 'center', padding: '40px' }, children: _jsx("div", { children: "Loading energy data..." }) })) : energyData ? (_jsxs(_Fragment, { children: [_jsxs("div", { style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                            gap: '12px',
                            marginBottom: '20px'
                        }, children: [_jsxs("div", { style: {
                                    padding: '12px',
                                    background: '#334155',
                                    borderRadius: '6px',
                                    textAlign: 'center'
                                }, children: [_jsx("div", { style: { fontSize: '18px', fontWeight: 'bold', color: '#60a5fa' }, children: formatEnergy(energyData.totalConsumption) }), _jsx("div", { style: { fontSize: '11px', color: '#94a3b8' }, children: "Total Consumption" })] }), _jsxs("div", { style: {
                                    padding: '12px',
                                    background: '#334155',
                                    borderRadius: '6px',
                                    textAlign: 'center'
                                }, children: [_jsx("div", { style: { fontSize: '18px', fontWeight: 'bold', color: '#10b981' }, children: formatEnergy(energyData.renewableGeneration) }), _jsx("div", { style: { fontSize: '11px', color: '#94a3b8' }, children: "Renewable Generation" })] }), _jsxs("div", { style: {
                                    padding: '12px',
                                    background: '#334155',
                                    borderRadius: '6px',
                                    textAlign: 'center'
                                }, children: [_jsx("div", { style: { fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }, children: formatEnergy(energyData.netConsumption) }), _jsx("div", { style: { fontSize: '11px', color: '#94a3b8' }, children: "Net Consumption" })] }), _jsxs("div", { style: {
                                    padding: '12px',
                                    background: '#334155',
                                    borderRadius: '6px',
                                    textAlign: 'center'
                                }, children: [_jsxs("div", { style: { fontSize: '18px', fontWeight: 'bold', color: '#ef4444' }, children: [energyData.peakDemand.toFixed(1), " kW"] }), _jsx("div", { style: { fontSize: '11px', color: '#94a3b8' }, children: "Peak Demand" })] })] }), _jsxs("div", { style: { marginBottom: '20px' }, children: [_jsxs("div", { style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '12px'
                                }, children: [_jsx("span", { style: { fontSize: '14px' }, children: "Energy Efficiency" }), _jsxs("span", { style: {
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            color: getEfficiencyColor(energyData.efficiency)
                                        }, children: [(energyData.efficiency * 100).toFixed(1), "%"] })] }), _jsx("div", { style: {
                                    width: '100%',
                                    height: '8px',
                                    background: '#334155',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }, children: _jsx("div", { style: {
                                        width: `${energyData.efficiency * 100}%`,
                                        height: '100%',
                                        background: getEfficiencyColor(energyData.efficiency),
                                        borderRadius: '4px'
                                    } }) })] }), _jsxs("div", { style: {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px',
                            marginBottom: '20px'
                        }, children: [_jsxs("div", { style: {
                                    padding: '12px',
                                    background: '#334155',
                                    borderRadius: '6px',
                                    textAlign: 'center'
                                }, children: [_jsxs("div", { style: { fontSize: '16px', fontWeight: 'bold', color: '#fbbf24' }, children: ["$", energyData.cost.toFixed(2)] }), _jsx("div", { style: { fontSize: '11px', color: '#94a3b8' }, children: "Monthly Cost" })] }), _jsxs("div", { style: {
                                    padding: '12px',
                                    background: '#334155',
                                    borderRadius: '6px',
                                    textAlign: 'center'
                                }, children: [_jsxs("div", { style: { fontSize: '16px', fontWeight: 'bold', color: '#f87171' }, children: [energyData.carbonFootprint.toFixed(1), " kg"] }), _jsx("div", { style: { fontSize: '11px', color: '#94a3b8' }, children: "CO\u2082 Footprint" })] })] }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("h4", { style: { margin: '0 0 12px 0', fontSize: '14px' }, children: "Consumption Pattern" }), _jsx("div", { style: {
                                    height: '100px',
                                    background: '#334155',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'end',
                                    justifyContent: 'space-between',
                                    padding: '8px'
                                }, children: energyData.hourlyData.slice(0, 24).map((value, index) => (_jsx("div", { style: {
                                        width: '2px',
                                        height: `${(value / 75) * 80}px`,
                                        background: '#60a5fa',
                                        borderRadius: '1px'
                                    }, title: `${value.toFixed(1)} kWh` }, index))) }), _jsxs("div", { style: { fontSize: '11px', color: '#94a3b8', textAlign: 'center', marginTop: '4px' }, children: ["Hourly consumption (", timeRange, ")"] })] }), energyData.bimEnergyData && (_jsxs("div", { style: { marginBottom: '20px' }, children: [_jsx("h4", { style: { margin: '0 0 12px 0', fontSize: '14px' }, children: "BIM Analysis" }), _jsxs("div", { style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                                    gap: '8px'
                                }, children: [_jsxs("div", { style: {
                                            padding: '8px',
                                            background: '#334155',
                                            borderRadius: '4px',
                                            textAlign: 'center'
                                        }, children: [_jsxs("div", { style: { fontSize: '12px', fontWeight: 'bold', color: '#60a5fa' }, children: [(energyData.bimEnergyData.materialEfficiency * 100).toFixed(1), "%"] }), _jsx("div", { style: { fontSize: '9px', color: '#94a3b8' }, children: "Material Efficiency" })] }), _jsxs("div", { style: {
                                            padding: '8px',
                                            background: '#334155',
                                            borderRadius: '4px',
                                            textAlign: 'center'
                                        }, children: [_jsxs("div", { style: { fontSize: '12px', fontWeight: 'bold', color: '#10b981' }, children: [(energyData.bimEnergyData.systemEfficiency * 100).toFixed(1), "%"] }), _jsx("div", { style: { fontSize: '9px', color: '#94a3b8' }, children: "System Efficiency" })] }), _jsxs("div", { style: {
                                            padding: '8px',
                                            background: '#334155',
                                            borderRadius: '4px',
                                            textAlign: 'center'
                                        }, children: [_jsxs("div", { style: { fontSize: '12px', fontWeight: 'bold', color: '#f59e0b' }, children: [energyData.bimEnergyData.buildingVolume.toFixed(0), " m\u00B3"] }), _jsx("div", { style: { fontSize: '9px', color: '#94a3b8' }, children: "Building Volume" })] }), _jsxs("div", { style: {
                                            padding: '8px',
                                            background: '#334155',
                                            borderRadius: '4px',
                                            textAlign: 'center'
                                        }, children: [_jsx("div", { style: { fontSize: '12px', fontWeight: 'bold', color: '#ef4444' }, children: energyData.bimEnergyData.energyIntensity.toFixed(0) }), _jsx("div", { style: { fontSize: '9px', color: '#94a3b8' }, children: "Energy Intensity" })] })] })] })), energyData.simulationData && (_jsxs("div", { style: { marginBottom: '20px' }, children: [_jsx("h4", { style: { margin: '0 0 12px 0', fontSize: '14px' }, children: "Simulation Insights" }), _jsxs("div", { style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                                    gap: '8px'
                                }, children: [_jsxs("div", { style: {
                                            padding: '8px',
                                            background: '#334155',
                                            borderRadius: '4px',
                                            textAlign: 'center'
                                        }, children: [_jsx("div", { style: { fontSize: '12px', fontWeight: 'bold', color: '#60a5fa' }, children: formatEnergy(energyData.simulationData.currentLoad) }), _jsx("div", { style: { fontSize: '9px', color: '#94a3b8' }, children: "Current Load" })] }), _jsxs("div", { style: {
                                            padding: '8px',
                                            background: '#334155',
                                            borderRadius: '4px',
                                            textAlign: 'center'
                                        }, children: [_jsx("div", { style: { fontSize: '12px', fontWeight: 'bold', color: '#f59e0b' }, children: formatEnergy(energyData.simulationData.predictedConsumption) }), _jsx("div", { style: { fontSize: '9px', color: '#94a3b8' }, children: "Predicted" })] }), _jsxs("div", { style: {
                                            padding: '8px',
                                            background: '#334155',
                                            borderRadius: '4px',
                                            textAlign: 'center'
                                        }, children: [_jsxs("div", { style: { fontSize: '12px', fontWeight: 'bold', color: '#ef4444' }, children: [(energyData.simulationData.maintenanceImpact * 100).toFixed(1), "%"] }), _jsx("div", { style: { fontSize: '9px', color: '#94a3b8' }, children: "Maintenance Impact" })] }), _jsxs("div", { style: {
                                            padding: '8px',
                                            background: '#334155',
                                            borderRadius: '4px',
                                            textAlign: 'center'
                                        }, children: [_jsxs("div", { style: { fontSize: '12px', fontWeight: 'bold', color: '#10b981' }, children: [(energyData.simulationData.weatherAdjustment * 100).toFixed(1), "%"] }), _jsx("div", { style: { fontSize: '9px', color: '#94a3b8' }, children: "Weather Adjustment" })] })] })] })), energyData.deviceCapabilities && (_jsxs("div", { style: { marginBottom: '20px' }, children: [_jsx("h4", { style: { margin: '0 0 12px 0', fontSize: '14px' }, children: "Device Capabilities" }), _jsxs("div", { style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                                    gap: '6px'
                                }, children: [_jsx("div", { style: {
                                            padding: '6px',
                                            background: energyData.deviceCapabilities.webgpu ? '#10b981' : '#ef4444',
                                            borderRadius: '4px',
                                            textAlign: 'center',
                                            fontSize: '10px',
                                            color: '#ffffff'
                                        }, children: "WebGPU" }), _jsx("div", { style: {
                                            padding: '6px',
                                            background: energyData.deviceCapabilities.webxr ? '#10b981' : '#ef4444',
                                            borderRadius: '4px',
                                            textAlign: 'center',
                                            fontSize: '10px',
                                            color: '#ffffff'
                                        }, children: "WebXR" }), _jsxs("div", { style: {
                                            padding: '6px',
                                            background: '#334155',
                                            borderRadius: '4px',
                                            textAlign: 'center'
                                        }, children: [_jsx("div", { style: { fontSize: '10px', fontWeight: 'bold', color: '#60a5fa' }, children: energyData.deviceCapabilities.performanceScore.toFixed(0) }), _jsx("div", { style: { fontSize: '8px', color: '#94a3b8' }, children: "Perf Score" })] })] })] })), _jsxs("div", { children: [_jsx("h4", { style: { margin: '0 0 12px 0', fontSize: '14px' }, children: "Energy Optimization Tips" }), _jsxs("div", { style: { fontSize: '12px', color: '#cbd5e1' }, children: [_jsx("div", { style: { marginBottom: '4px' }, children: "\u2022 Consider solar panel installation to reduce net consumption" }), _jsx("div", { style: { marginBottom: '4px' }, children: "\u2022 Implement energy-efficient lighting systems" }), _jsx("div", { style: { marginBottom: '4px' }, children: "\u2022 Optimize HVAC scheduling for peak demand reduction" }), _jsx("div", { children: "\u2022 Monitor and maintain equipment for better efficiency" })] })] })] })) : (_jsx("div", { style: { textAlign: 'center', padding: '40px', color: '#94a3b8' }, children: "No energy data available" }))] }));
};
export default EnergyDashboard;
