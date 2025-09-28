export class LocalCodeValidator {
    constructor(regulations) {
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "regulations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "issues", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        // Default regulations can be overridden by passing custom regulations
        this.regulations = regulations || this.getDefaultRegulations();
    }
    setModel(model) {
        this.model = model;
        this.issues = [];
    }
    validateCompliance() {
        if (!this.model)
            return [];
        this.issues = [];
        this.model.elements.forEach((element) => {
            this.checkSetbackRules(element);
            this.checkFireExitCompliance(element);
            this.checkVentilationCompliance(element);
        });
        return this.issues;
    }
    checkSetbackRules(element) {
        // Placeholder: Check if element respects setback rules
        // For demo, assume all walls must be at least minDistance from property line (0,0)
        if (element.type === 'wall') {
            this.regulations.setbackRules.forEach(rule => {
                // Simplified check: distance from origin
                const distance = Math.sqrt(element.position.x ** 2 + element.position.z ** 2);
                if (distance < rule.minDistance) {
                    this.issues.push(this.createIssue(element, 'setback', `Element is too close to property line. Minimum setback is ${rule.minDistance}m.`, 'high'));
                }
            });
        }
    }
    checkFireExitCompliance(element) {
        // Placeholder: Check fire exit compliance for doors and exits
        if (element.type === 'door') {
            this.regulations.fireExitRules.forEach(rule => {
                // Simplified check: door width
                const width = element.properties?.width || 0;
                if (width < rule.minExitWidth) {
                    this.issues.push(this.createIssue(element, 'fire_exit', `Door width ${width}m is less than minimum required ${rule.minExitWidth}m for fire exit.`, 'high'));
                }
            });
        }
    }
    checkVentilationCompliance(element) {
        // Placeholder: Check ventilation compliance for floors (representing rooms/spaces)
        if (element.type === 'floor') {
            this.regulations.ventilationRules.forEach(rule => {
                if (rule.applicableRoomTypes.includes(element.category)) {
                    const airChanges = element.properties?.airChangesPerHour || 0;
                    if (airChanges < rule.minAirChangesPerHour) {
                        this.issues.push(this.createIssue(element, 'ventilation', `Air changes per hour ${airChanges} is less than minimum required ${rule.minAirChangesPerHour}.`, 'medium'));
                    }
                }
            });
        }
    }
    createIssue(element, issueType, description, severity) {
        return {
            id: `compliance_${element.id}_${issueType}`,
            elementId: element.id,
            issueType,
            description,
            severity,
            location: element.position,
            resolved: false,
        };
    }
    getIssues() {
        return this.issues;
    }
    resolveIssue(issueId) {
        const issue = this.issues.find(i => i.id === issueId);
        if (issue) {
            issue.resolved = true;
            return true;
        }
        return false;
    }
    getDefaultRegulations() {
        return {
            setbackRules: [
                { minDistance: 3, applicableZones: ['residential', 'commercial'], direction: 'all' }
            ],
            fireExitRules: [
                { maxDistanceToExit: 30, minExitWidth: 0.9, minExitCount: 2, maxOccupantLoad: 50 }
            ],
            ventilationRules: [
                { minAirChangesPerHour: 6, applicableRoomTypes: ['residential', 'office'], minOutdoorAirRate: 15, maxCO2Level: 1000 }
            ],
            accessibilityRules: [
                {
                    minDoorWidth: 0.81,
                    minRampSlope: 12,
                    minRampWidth: 0.91,
                    maxRampRise: 0.15,
                    minClearFloorSpace: 2.25,
                    minGrabBarLength: 0.9,
                    applicableAreas: ['public', 'commercial', 'multi-family']
                }
            ],
            structuralRules: [
                {
                    maxFloorAreaRatio: 2.5,
                    maxBuildingHeight: 30,
                    minFoundationDepth: 1.5,
                    seismicZone: 'moderate',
                    windSpeedDesign: 160,
                    snowLoad: 1.5
                }
            ],
            energyEfficiencyRules: [
                {
                    minInsulationRValue: { walls: 13, roof: 30, floor: 19 },
                    maxUFactor: { windows: 0.35, doors: 0.50 },
                    minEnergyStarRating: 75,
                    renewableEnergyRequirement: 20,
                    maxEnergyUseIntensity: 150
                }
            ],
            parkingRules: [
                {
                    minSpacesPerUnit: { residential: 1.5, commercial: 3.0, retail: 4.0 },
                    minAccessibleSpaces: 2,
                    minSpaceDimensions: { width: 2.5, length: 5.5 },
                    maxDistanceToEntrance: 100
                }
            ],
            environmentalRules: [
                {
                    maxImperviousSurface: 70,
                    minGreenSpace: 20,
                    stormwaterRetention: 25,
                    noiseLimit: { daytime: 55, nighttime: 45 },
                    airQualityStandards: { PM25: 12, NO2: 40 }
                }
            ]
        };
    }
}
