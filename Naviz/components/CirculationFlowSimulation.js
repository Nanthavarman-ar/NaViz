import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Mesh, Vector3, MeshBuilder, StandardMaterial, Color3, Animation } from '@babylonjs/core';
const CirculationFlowSimulation = ({ scene, engine, isActive, onSimulationComplete }) => {
    const [simulationResults, setSimulationResults] = useState(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const [people, setPeople] = useState([]);
    const [showFlowVisualization, setShowFlowVisualization] = useState(true);
    const [simulationSpeed, setSimulationSpeed] = useState(1);
    const [peopleCount, setPeopleCount] = useState(50);
    const [manualPeopleConfig, setManualPeopleConfig] = useState([
        { type: 'employee', count: 10, pathIndex: 0 },
        { type: 'visitor', count: 10, pathIndex: 1 },
        { type: 'wheelchair', count: 5, pathIndex: 2 },
        { type: 'elderly', count: 5, pathIndex: 3 },
        { type: 'child', count: 5, pathIndex: 4 },
    ]);
    const [showTypeSeparators, setShowTypeSeparators] = useState(true);
    const [peopleSimulationEnabled, setPeopleSimulationEnabled] = useState(false);
    const simulationIdCounter = useRef(0);
    const animationRefs = useRef([]);
    useEffect(() => {
        if (isActive) {
            startSimulation();
        }
        else {
            stopSimulation();
        }
        return () => {
            stopSimulation();
        };
    }, [isActive, peopleCount, simulationSpeed, manualPeopleConfig]);
    useEffect(() => {
        if (peopleSimulationEnabled) {
            // Enable people simulation logic here
            console.log('People simulation enabled');
            // For example, show people meshes or start people animations
        }
        else {
            // Disable people simulation logic here
            console.log('People simulation disabled');
            // For example, hide people meshes or stop people animations
        }
    }, [peopleSimulationEnabled]);
    const startSimulation = async () => {
        setIsSimulating(true);
        try {
            // Clear previous simulation
            clearSimulation();
            // Generate people and paths
            const generatedPeople = generatePeopleManual(manualPeopleConfig);
            setPeople(generatedPeople);
            // Create visual representations
            createPeopleMeshes(generatedPeople);
            // Start movement animations
            startMovementAnimations(generatedPeople);
            // Monitor simulation for 30 seconds
            await monitorSimulation(generatedPeople);
            // Analyze results
            const results = analyzeSimulationResults(generatedPeople);
            setSimulationResults(results);
            if (onSimulationComplete) {
                onSimulationComplete(results);
            }
            // Visualize results
            if (showFlowVisualization) {
                visualizeFlowResults(results);
                if (showTypeSeparators) {
                    visualizeTypeSeparators(generatedPeople);
                }
            }
        }
        catch (error) {
            console.error('Simulation failed:', error);
        }
        finally {
            setIsSimulating(false);
        }
    };
    useEffect(() => {
        if (peopleSimulationEnabled) {
            // Enable people simulation logic here
            // For example, show people meshes or start people movement
            people.forEach(person => {
                if (person.mesh) {
                    person.mesh.setEnabled(true);
                }
            });
        }
        else {
            // Disable people simulation logic here
            // For example, hide people meshes or stop people movement
            people.forEach(person => {
                if (person.mesh) {
                    person.mesh.setEnabled(false);
                }
            });
        }
    }, [peopleSimulationEnabled, people]);
    const stopSimulation = () => {
        clearSimulation();
        setIsSimulating(false);
        setPeopleSimulationEnabled(false); // Also disable people simulation when stopping circulation simulation
    };
    // Modify toggle handler to only disable people simulation without stopping entire simulation
    const togglePeopleSimulation = () => {
        const newValue = !peopleSimulationEnabled;
        setPeopleSimulationEnabled(newValue);
        // If disabling people simulation, keep circulation simulation running but hide people
        // If enabling people simulation, show people again
        if (!newValue) {
            // Disable people simulation logic here
            people.forEach(person => {
                if (person.mesh) {
                    person.mesh.setEnabled(false);
                }
            });
        }
        else {
            // Enable people simulation logic here
            people.forEach(person => {
                if (person.mesh) {
                    person.mesh.setEnabled(true);
                }
            });
        }
    };
    const clearSimulation = () => {
        // Dispose of all person meshes
        people.forEach(person => {
            if (person.mesh) {
                person.mesh.dispose();
            }
        });
        // Clear animations
        animationRefs.current.forEach(animation => {
            scene.stopAnimation(animation.target);
        });
        animationRefs.current = [];
        // Clear visualization meshes
        const flowMeshes = scene.meshes.filter(mesh => mesh.name.startsWith('flow_') ||
            mesh.name.startsWith('bottleneck_') ||
            mesh.name.startsWith('congestion_'));
        flowMeshes.forEach(mesh => mesh.dispose());
        setPeople([]);
    };
    const generatePeopleManual = (config) => {
        const generatedPeople = [];
        // Define common paths in the building
        const commonPaths = [
            // Entrance to office areas
            [new Vector3(-10, 0, -10), new Vector3(0, 0, 0), new Vector3(5, 0, 5)],
            // Office to meeting room
            [new Vector3(5, 0, 5), new Vector3(10, 0, 10), new Vector3(15, 0, 15)],
            // Kitchen to work area
            [new Vector3(-5, 0, 5), new Vector3(0, 0, 5), new Vector3(5, 0, 5)],
            // Exit path
            [new Vector3(5, 0, 5), new Vector3(0, 0, 0), new Vector3(-10, 0, 10)],
            // Restroom path
            [new Vector3(0, 0, 5), new Vector3(-5, 0, 5), new Vector3(-10, 0, 5)]
        ];
        const destinations = ['office', 'meeting', 'kitchen', 'exit', 'restroom', 'elevator'];
        config.forEach(({ type, count, pathIndex }) => {
            for (let i = 0; i < count; i++) {
                const path = commonPaths[pathIndex % commonPaths.length];
                const destination = destinations[Math.floor(Math.random() * destinations.length)];
                const priority = Math.floor(Math.random() * 11); // 0-10
                const accessibility = type === 'wheelchair' || type === 'elderly';
                const fatigue = 0;
                const socialDistance = 1 + Math.random(); // 1 to 2 units
                const person = {
                    id: `person_${simulationIdCounter.current++}`,
                    mesh: null, // Will be created later
                    position: path[0].clone(),
                    target: path[path.length - 1].clone(),
                    speed: 0.5 + Math.random() * 1.5, // Random speed between 0.5-2.0
                    path: path,
                    currentPathIndex: 0,
                    waitTime: 0,
                    isWaiting: false,
                    type,
                    state: 'walking',
                    destination,
                    priority,
                    accessibility,
                    fatigue,
                    socialDistance
                };
                generatedPeople.push(person);
            }
        });
        return generatedPeople;
    };
    const visualizeTypeSeparators = (peopleList) => {
        // Group people by type
        const typeGroups = {};
        peopleList.forEach(person => {
            if (!typeGroups[person.type])
                typeGroups[person.type] = [];
            typeGroups[person.type].push(person);
        });
        // Create visual separators for each group
        Object.entries(typeGroups).forEach(([type, group]) => {
            if (group.length < 2)
                return; // Don't create separators for single people
            // Calculate group center
            const center = group.reduce((sum, person) => sum.add(person.position), Vector3.Zero()).scale(1 / group.length);
            // Calculate group radius
            const radius = Math.max(...group.map(person => Vector3.Distance(center, person.position))) + 1; // Add padding
            // Create separator circle
            const separator = MeshBuilder.CreateCylinder(`separator_${type}`, {
                height: 0.02,
                diameter: radius * 2
            }, scene);
            separator.position = center.clone();
            const material = new StandardMaterial(`separator_mat_${type}`, scene);
            // Color based on person type
            switch (type) {
                case 'employee':
                    material.diffuseColor = new Color3(0.2, 0.4, 0.8);
                    break;
                case 'visitor':
                    material.diffuseColor = new Color3(0.8, 0.4, 0.2);
                    break;
                case 'wheelchair':
                    material.diffuseColor = new Color3(0.8, 0.8, 0.2);
                    break;
                case 'elderly':
                    material.diffuseColor = new Color3(0.6, 0.3, 0.6);
                    break;
                case 'child':
                    material.diffuseColor = new Color3(0.3, 0.8, 0.3);
                    break;
            }
            material.alpha = 0.2;
            separator.material = material;
        });
    };
    const createPeopleMeshes = (peopleList) => {
        peopleList.forEach(person => {
            let personMesh;
            // Create different mesh types based on person type
            switch (person.type) {
                case 'wheelchair':
                    // Create wheelchair representation (cylinder with smaller cylinder on top)
                    const wheelchairBase = MeshBuilder.CreateCylinder(`wheelchair_base_${person.id}`, {
                        height: 0.1,
                        diameter: 0.4
                    }, scene);
                    const wheelchairSeat = MeshBuilder.CreateCylinder(`wheelchair_seat_${person.id}`, {
                        height: 0.05,
                        diameter: 0.3
                    }, scene);
                    wheelchairSeat.position.y = 0.1;
                    personMesh = MeshBuilder.CreateCylinder(`person_${person.id}`, {
                        height: 0.3,
                        diameter: 0.2
                    }, scene);
                    personMesh.position.y = 0.2;
                    // Merge meshes for wheelchair
                    const wheelchairMeshes = [wheelchairBase, wheelchairSeat, personMesh];
                    personMesh = Mesh.MergeMeshes(wheelchairMeshes, true, true, undefined, false, true);
                    personMesh.name = `person_${person.id}`;
                    break;
                case 'elderly':
                    // Create elderly person (slightly taller cylinder)
                    personMesh = MeshBuilder.CreateCylinder(`person_${person.id}`, {
                        height: 0.5,
                        diameter: 0.25
                    }, scene);
                    break;
                case 'child':
                    // Create child (smaller cylinder)
                    personMesh = MeshBuilder.CreateCylinder(`person_${person.id}`, {
                        height: 0.3,
                        diameter: 0.2
                    }, scene);
                    break;
                default:
                    // Default employee/visitor (standard cylinder)
                    personMesh = MeshBuilder.CreateCylinder(`person_${person.id}`, {
                        height: 0.4,
                        diameter: 0.25
                    }, scene);
            }
            personMesh.position = person.position.clone();
            // Create material based on person type and state
            const material = new StandardMaterial(`person_mat_${person.id}`, scene);
            // Color based on person type
            switch (person.type) {
                case 'employee':
                    material.diffuseColor = new Color3(0.2, 0.4, 0.8); // Blue
                    break;
                case 'visitor':
                    material.diffuseColor = new Color3(0.8, 0.4, 0.2); // Orange
                    break;
                case 'wheelchair':
                    material.diffuseColor = new Color3(0.8, 0.8, 0.2); // Yellow
                    break;
                case 'elderly':
                    material.diffuseColor = new Color3(0.6, 0.3, 0.6); // Purple
                    break;
                case 'child':
                    material.diffuseColor = new Color3(0.3, 0.8, 0.3); // Green
                    break;
            }
            // Adjust color based on state
            if (person.state === 'waiting') {
                material.diffuseColor = material.diffuseColor.scale(0.7);
            }
            else if (person.state === 'interacting') {
                material.diffuseColor = material.diffuseColor.scale(1.2);
            }
            material.emissiveColor = material.diffuseColor.scale(0.1);
            personMesh.material = material;
            person.mesh = personMesh;
        });
    };
    const startMovementAnimations = (peopleList) => {
        peopleList.forEach(person => {
            if (!person.mesh)
                return;
            // Create path animation
            const animation = Animation.CreateAndStartAnimation(`person_animation_${person.id}`, person.mesh, 'position', 30 * simulationSpeed, person.path.length * 60, // 2 seconds per path segment
            person.path[0], person.path[person.path.length - 1], Animation.ANIMATIONLOOPMODE_CONSTANT);
            if (animation) {
                animationRefs.current.push(animation);
            }
        });
    };
    const monitorSimulation = async (peopleList) => {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const monitorInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                if (elapsed >= 30000) { // 30 seconds
                    clearInterval(monitorInterval);
                    resolve();
                    return;
                }
                // Update person positions and detect bottlenecks
                updatePeoplePositions(peopleList);
            }, 100); // Update every 100ms
        });
    };
    const updatePeoplePositions = (peopleList) => {
        peopleList.forEach(person => {
            if (!person.mesh)
                return;
            // Update fatigue over time
            person.fatigue = Math.min(1, person.fatigue + 0.001);
            // Calculate effective speed based on type, fatigue, and state
            let effectiveSpeed = person.speed;
            // Adjust speed based on person type
            switch (person.type) {
                case 'wheelchair':
                    effectiveSpeed *= 0.6; // Wheelchairs move slower
                    break;
                case 'elderly':
                    effectiveSpeed *= 0.7; // Elderly move slower
                    break;
                case 'child':
                    effectiveSpeed *= 0.8; // Children move slower
                    break;
            }
            // Adjust speed based on fatigue
            effectiveSpeed *= (1 - person.fatigue * 0.3);
            // Adjust speed based on state
            switch (person.state) {
                case 'waiting':
                    effectiveSpeed *= 0.1; // Very slow when waiting
                    break;
                case 'interacting':
                    effectiveSpeed *= 0.3; // Slow when interacting
                    break;
                case 'resting':
                    effectiveSpeed = 0; // No movement when resting
                    break;
            }
            // Movement logic
            if (person.currentPathIndex < person.path.length - 1 && person.state !== 'resting') {
                const currentTarget = person.path[person.currentPathIndex + 1];
                const direction = currentTarget.subtract(person.position).normalize();
                const distance = Vector3.Distance(person.position, currentTarget);
                // Check for social distancing violations
                const nearbyPeople = peopleList.filter(other => other.id !== person.id &&
                    Vector3.Distance(person.position, other.position) < person.socialDistance);
                const hasPriorityOvercrowding = nearbyPeople.some(other => other.priority < person.priority &&
                    Vector3.Distance(person.position, other.position) < person.socialDistance * 0.5);
                if (distance < 0.1) {
                    // Reached target, move to next point
                    person.currentPathIndex++;
                    person.position = currentTarget.clone();
                    // Chance to rest at destination
                    if (person.destination !== 'exit' && Math.random() < 0.1) {
                        person.state = 'resting';
                        setTimeout(() => {
                            if (person.state === 'resting') {
                                person.state = 'walking';
                                person.fatigue = Math.max(0, person.fatigue - 0.2); // Rest reduces fatigue
                            }
                        }, 2000 + Math.random() * 3000); // Rest for 2-5 seconds
                    }
                    else {
                        person.state = 'walking';
                    }
                }
                else if (nearbyPeople.length > 2 && !hasPriorityOvercrowding) {
                    // Too crowded, wait or find alternative path
                    person.state = 'waiting';
                    person.isWaiting = true;
                    person.waitTime += 0.1;
                    // High priority people might push through
                    if (person.priority > 7 && Math.random() < 0.3) {
                        person.state = 'walking';
                        person.isWaiting = false;
                    }
                }
                else {
                    // Move towards target
                    person.position = person.position.add(direction.scale(effectiveSpeed * 0.1));
                    person.state = 'walking';
                    person.isWaiting = false;
                }
                person.mesh.position = person.position.clone();
            }
            // Check for interactions at destinations
            if (person.currentPathIndex >= person.path.length - 1) {
                // At destination
                if (person.destination === 'meeting' || person.destination === 'kitchen') {
                    if (Math.random() < 0.05) { // 5% chance per update to interact
                        person.state = 'interacting';
                        setTimeout(() => {
                            if (person.state === 'interacting') {
                                person.state = 'walking';
                                // Maybe change destination
                                const destinations = ['office', 'meeting', 'kitchen', 'exit', 'restroom', 'elevator'];
                                person.destination = destinations[Math.floor(Math.random() * destinations.length)];
                                // Generate new path (simplified - just reverse current path)
                                person.path = person.path.slice().reverse();
                                person.currentPathIndex = 0;
                            }
                        }, 3000 + Math.random() * 5000); // Interact for 3-8 seconds
                    }
                }
            }
            // Update material color based on current state
            if (person.mesh.material) {
                const material = person.mesh.material;
                let baseColor;
                // Get base color by type
                switch (person.type) {
                    case 'employee':
                        baseColor = new Color3(0.2, 0.4, 0.8);
                        break;
                    case 'visitor':
                        baseColor = new Color3(0.8, 0.4, 0.2);
                        break;
                    case 'wheelchair':
                        baseColor = new Color3(0.8, 0.8, 0.2);
                        break;
                    case 'elderly':
                        baseColor = new Color3(0.6, 0.3, 0.6);
                        break;
                    case 'child':
                        baseColor = new Color3(0.3, 0.8, 0.3);
                        break;
                    default: baseColor = new Color3(0.5, 0.5, 0.5);
                }
                // Modify color based on state
                switch (person.state) {
                    case 'waiting':
                        material.diffuseColor = baseColor.scale(0.6);
                        break;
                    case 'interacting':
                        material.diffuseColor = baseColor.scale(1.3);
                        break;
                    case 'resting':
                        material.diffuseColor = baseColor.scale(0.8);
                        break;
                    default:
                        material.diffuseColor = baseColor;
                }
                material.emissiveColor = material.diffuseColor.scale(0.1);
            }
        });
    };
    const analyzeSimulationResults = (peopleList) => {
        // Calculate bottlenecks
        const bottlenecks = detectBottlenecks(peopleList);
        // Calculate congestion areas
        const congestionAreas = detectCongestionAreas(peopleList);
        // Calculate flow efficiency
        const totalWaitTime = peopleList.reduce((sum, person) => sum + person.waitTime, 0);
        const averageWaitTime = totalWaitTime / peopleList.length;
        const flowEfficiency = Math.max(0, 100 - (averageWaitTime * 10));
        // Calculate average speed
        const averageSpeed = peopleList.reduce((sum, person) => sum + person.speed, 0) / peopleList.length;
        // Generate recommendations
        const recommendations = generateFlowRecommendations(bottlenecks, congestionAreas, flowEfficiency);
        return {
            timestamp: new Date(),
            totalPeople: peopleList.length,
            bottlenecks,
            flowEfficiency,
            averageSpeed,
            congestionAreas,
            recommendations
        };
    };
    const detectBottlenecks = (peopleList) => {
        const bottlenecks = [];
        const gridSize = 2;
        const grid = {};
        // Group people by grid cells
        peopleList.forEach(person => {
            const gridX = Math.floor(person.position.x / gridSize);
            const gridZ = Math.floor(person.position.z / gridSize);
            const key = `${gridX}_${gridZ}`;
            if (!grid[key])
                grid[key] = [];
            grid[key].push(person);
        });
        // Find high-density areas
        Object.entries(grid).forEach(([key, peopleInCell]) => {
            if (peopleInCell.length >= 5) {
                const avgPosition = peopleInCell.reduce((sum, person) => sum.add(person.position), Vector3.Zero()).scale(1 / peopleInCell.length);
                const avgWaitTime = peopleInCell.reduce((sum, person) => sum + person.waitTime, 0) / peopleInCell.length;
                let severity = 'low';
                if (avgWaitTime > 5)
                    severity = 'critical';
                else if (avgWaitTime > 3)
                    severity = 'high';
                else if (avgWaitTime > 1)
                    severity = 'medium';
                bottlenecks.push({
                    id: `bottleneck_${key}`,
                    position: avgPosition,
                    severity,
                    description: `${peopleInCell.length} people waiting in this area`,
                    affectedPeople: peopleInCell.length,
                    waitTime: avgWaitTime
                });
            }
        });
        return bottlenecks.sort((a, b) => {
            const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            return severityOrder[b.severity] - severityOrder[a.severity];
        });
    };
    const detectCongestionAreas = (peopleList) => {
        const areas = [];
        // Simple clustering algorithm
        const processed = new Set();
        peopleList.forEach(person => {
            if (processed.has(person.id))
                return;
            const cluster = [person];
            processed.add(person.id);
            // Find nearby people
            let changed = true;
            while (changed) {
                changed = false;
                peopleList.forEach(other => {
                    if (!processed.has(other.id)) {
                        const inCluster = cluster.some(p => Vector3.Distance(p.position, other.position) < 2.0);
                        if (inCluster) {
                            cluster.push(other);
                            processed.add(other.id);
                            changed = true;
                        }
                    }
                });
            }
            if (cluster.length >= 3) {
                const center = cluster.reduce((sum, p) => sum.add(p.position), Vector3.Zero())
                    .scale(1 / cluster.length);
                const radius = Math.max(...cluster.map(p => Vector3.Distance(center, p.position)));
                areas.push({
                    id: `congestion_${areas.length}`,
                    center,
                    radius,
                    density: cluster.length / (Math.PI * radius * radius),
                    color: getCongestionColor(cluster.length)
                });
            }
        });
        return areas;
    };
    const getCongestionColor = (peopleCount) => {
        if (peopleCount >= 8)
            return new Color3(1, 0, 0); // Red
        if (peopleCount >= 5)
            return new Color3(1, 0.5, 0); // Orange
        if (peopleCount >= 3)
            return new Color3(1, 1, 0); // Yellow
        return new Color3(0, 1, 0); // Green
    };
    const generateFlowRecommendations = (bottlenecks, congestionAreas, efficiency) => {
        const recommendations = [];
        if (efficiency < 70) {
            recommendations.push("Overall circulation flow is poor. Consider widening corridors.");
        }
        bottlenecks.forEach(bottleneck => {
            if (bottleneck.severity === 'critical') {
                recommendations.push(`Critical bottleneck at ${bottleneck.position.toString()}. Immediate intervention required.`);
            }
            else if (bottleneck.severity === 'high') {
                recommendations.push(`High congestion area detected. Consider adding additional pathways.`);
            }
        });
        if (congestionAreas.length > 3) {
            recommendations.push("Multiple congestion areas detected. Review space layout for better flow.");
        }
        if (recommendations.length === 0) {
            recommendations.push("Circulation flow is generally good. Minor optimizations may be possible.");
        }
        return recommendations;
    };
    const visualizeFlowResults = (results) => {
        // Visualize bottlenecks
        results.bottlenecks.forEach(bottleneck => {
            const indicator = MeshBuilder.CreateCylinder(`bottleneck_${bottleneck.id}`, {
                height: 0.1,
                diameter: bottleneck.affectedPeople * 0.2
            }, scene);
            indicator.position = bottleneck.position.clone();
            const material = new StandardMaterial(`bottleneck_mat_${bottleneck.id}`, scene);
            material.diffuseColor = getBottleneckColor(bottleneck.severity);
            material.emissiveColor = material.diffuseColor.scale(0.3);
            indicator.material = material;
        });
        // Visualize congestion areas
        results.congestionAreas.forEach(area => {
            const circle = MeshBuilder.CreateCylinder(`congestion_${area.id}`, {
                height: 0.05,
                diameter: area.radius * 2
            }, scene);
            circle.position = area.center.clone();
            const material = new StandardMaterial(`congestion_mat_${area.id}`, scene);
            material.diffuseColor = area.color;
            material.alpha = 0.3;
            circle.material = material;
        });
    };
    const getBottleneckColor = (severity) => {
        switch (severity) {
            case 'critical': return new Color3(1, 0, 0);
            case 'high': return new Color3(1, 0.5, 0);
            case 'medium': return new Color3(1, 1, 0);
            case 'low': return new Color3(0, 1, 0);
        }
    };
    const getSeverityColorClass = (severity) => {
        switch (severity) {
            case 'critical': return '#ef4444';
            case 'high': return '#f97316';
            case 'medium': return '#f59e0b';
            case 'low': return '#10b981';
        }
        return '#94a3b8';
    };
    return (_jsxs("div", { className: "p-4 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 h-full flex flex-col", children: [_jsx("h3", { className: "m-0 mb-4 text-base", children: "Circulation Flow Simulation" }), _jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "flex gap-2 mb-2", children: [_jsx("button", { onClick: startSimulation, disabled: isSimulating, className: `flex-1 px-2 py-2 bg-blue-500 border-0 rounded text-white text-xs ${isSimulating ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`, children: isSimulating ? 'Simulating...' : 'Start Simulation' }), _jsx("button", { onClick: stopSimulation, className: "px-2 py-2 bg-red-500 border-0 rounded text-white text-xs cursor-pointer", children: "Stop" })] }), _jsxs("div", { className: "flex gap-2 mb-2", children: [_jsxs("div", { className: "flex-1", children: [_jsx("label", { htmlFor: "people-count", className: "block text-xs text-slate-400 mb-0.5", children: "People Count" }), _jsx("input", { id: "people-count", type: "range", min: "10", max: "200", value: peopleCount, onChange: (e) => setPeopleCount(Number(e.target.value)), className: "w-full h-1 bg-slate-600 outline-none" }), _jsx("div", { className: "text-xs text-slate-400 text-center", children: peopleCount })] }), _jsxs("div", { className: "flex-1", children: [_jsx("label", { htmlFor: "simulation-speed", className: "block text-xs text-slate-400 mb-0.5", children: "Speed" }), _jsx("input", { id: "simulation-speed", type: "range", min: "0.5", max: "3", step: "0.5", value: simulationSpeed, onChange: (e) => setSimulationSpeed(Number(e.target.value)), className: "w-full h-1 bg-slate-600 outline-none" }), _jsxs("div", { className: "text-xs text-slate-400 text-center", children: [simulationSpeed, "x"] })] })] }), _jsx("div", { className: "flex gap-1", children: _jsxs("button", { onClick: () => setShowFlowVisualization(!showFlowVisualization), className: `flex-1 px-1.5 py-1.5 border-0 rounded text-white text-xs cursor-pointer ${showFlowVisualization ? 'bg-emerald-500' : 'bg-gray-500'}`, children: [showFlowVisualization ? 'Hide' : 'Show', " Visualization"] }) }), isSimulating && (_jsx("div", { className: "mt-2 p-2 bg-slate-600 rounded text-center text-xs", children: "\uD83D\uDEB6 Running circulation simulation..." }))] }), simulationResults && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "p-3 bg-slate-600 rounded-md mb-3", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("span", { className: "text-sm font-bold", children: "Flow Efficiency" }), _jsxs("span", { className: `text-lg font-bold ${simulationResults.flowEfficiency > 80 ? 'text-emerald-500' :
                                                    simulationResults.flowEfficiency > 60 ? 'text-amber-500' : 'text-red-500'}`, children: [simulationResults.flowEfficiency.toFixed(0), "%"] })] }), _jsx("div", { className: "w-full h-2 bg-slate-500 rounded overflow-hidden mb-2", children: _jsx("div", { className: `h-full transition-all duration-300 ease-in-out ${simulationResults.flowEfficiency > 80 ? 'bg-emerald-500' :
                                                simulationResults.flowEfficiency > 60 ? 'bg-amber-500' : 'bg-red-500'}`, style: { width: `${simulationResults.flowEfficiency}%` } }) }), _jsxs("div", { className: "text-xs text-slate-400", children: ["Average Speed: ", simulationResults.averageSpeed.toFixed(1), " units/sec"] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2 mb-3", children: [_jsxs("div", { className: "p-2 bg-slate-600 rounded text-center", children: [_jsx("div", { className: "text-base font-bold", children: simulationResults.totalPeople }), _jsx("div", { className: "text-xs text-slate-400", children: "Total People" })] }), _jsxs("div", { className: "p-2 bg-slate-600 rounded text-center", children: [_jsx("div", { className: "text-base font-bold text-red-500", children: simulationResults.bottlenecks.length }), _jsx("div", { className: "text-xs text-slate-400", children: "Bottlenecks" })] })] })] }), _jsx("div", { className: "mb-4", children: _jsx("button", { onClick: togglePeopleSimulation, className: "people-simulation-toggle-button px-3 py-2 bg-blue-600 rounded text-white text-sm", children: peopleSimulationEnabled ? 'Disable People Simulation' : 'Enable People Simulation' }) })] })), _jsx("div", { className: "flex-1 overflow-y-auto border border-slate-600 rounded mb-3", children: simulationResults ? (simulationResults.bottlenecks.length > 0 ? (simulationResults.bottlenecks.map((bottleneck) => (_jsxs("div", { className: "p-2 border-b border-slate-600 text-xs", children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsx("span", { className: "text-xs font-bold", style: { color: getSeverityColorClass(bottleneck.severity) }, children: bottleneck.severity.toUpperCase() }), _jsxs("span", { className: "text-xs text-slate-400", children: [bottleneck.affectedPeople, " people"] })] }), _jsx("div", { className: "mb-1", children: bottleneck.description }), _jsxs("div", { className: "text-xs text-slate-400", children: ["Wait Time: ", bottleneck.waitTime.toFixed(1), "s"] })] }, bottleneck.id)))) : (_jsx("div", { className: "p-4 text-center text-emerald-500 text-xs", children: "\u2705 No significant bottlenecks detected" }))) : (_jsx("div", { className: "p-4 text-center text-slate-400 text-xs", children: "Run simulation to detect bottlenecks" })) }), simulationResults && simulationResults.recommendations.length > 0 && (_jsxs("div", { className: "flex-1 overflow-y-auto border border-slate-600 rounded", children: [_jsx("div", { className: "p-2 bg-slate-600 border-b border-slate-500 text-xs font-bold", children: "Recommendations" }), simulationResults.recommendations.map((rec, index) => (_jsx("div", { className: "p-2 border-b border-slate-600 text-xs", children: rec }, index)))] }))] }));
};
export default CirculationFlowSimulation;
