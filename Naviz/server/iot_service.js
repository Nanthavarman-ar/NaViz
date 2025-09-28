// Server-side IoT Service for API operations (Node.js version)
class IoTService {
  constructor() {
    this.sensors = new Map();
    this.devices = new Map();
    this.energyHistory = [];
    this.simulationConfig = {
      updateInterval: 5000,
      realisticValues: true,
      energyTracking: true,
      predictiveMaintenance: false
    };
    this.isSimulating = false;
    this.initializeDefaultData();
  }

  initializeDefaultData() {
    // Initialize with default sensors and devices
    this.sensors.set('temp_living_room', {
      id: 'temp_living_room',
      name: 'Living Room Temperature',
      type: 'temperature',
      value: 22,
      unit: '°C',
      status: 'active',
      lastUpdate: Date.now(),
      threshold: { min: 18, max: 26, warning: 28 }
    });

    this.sensors.set('humidity_kitchen', {
      id: 'humidity_kitchen',
      name: 'Kitchen Humidity',
      type: 'humidity',
      value: 45,
      unit: '%',
      status: 'active',
      lastUpdate: Date.now(),
      threshold: { min: 30, max: 60, warning: 70 }
    });

    this.devices.set('light_living_room', {
      id: 'light_living_room',
      name: 'Living Room Light',
      type: 'light',
      status: 'on',
      powerConsumption: 0.06,
      controllable: true
    });

    this.devices.set('thermostat_main', {
      id: 'thermostat_main',
      name: 'Main Thermostat',
      type: 'thermostat',
      status: 'on',
      powerConsumption: 0.02,
      controllable: true
    });
  }

  // Get all sensors
  getAllSensors() {
    return Array.from(this.sensors.values());
  }

  // Get all devices
  getAllDevices() {
    return Array.from(this.devices.values());
  }

  // Get sensor value
  getSensorValue(sensorId) {
    const sensor = this.sensors.get(sensorId);
    return sensor ? sensor.value : null;
  }

  // Control device
  async controlDevice(deviceId, command) {
    const device = this.devices.get(deviceId);
    if (!device || !device.controllable) {
      return false;
    }

    switch (command) {
      case 'on':
        device.status = 'on';
        break;
      case 'off':
        device.status = 'off';
        break;
      case 'toggle':
        device.status = device.status === 'on' ? 'off' : 'on';
        break;
    }

    return true;
  }

  // Get energy history
  getEnergyHistory(hours = 24) {
    const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
    return this.energyHistory.filter(data => data.timestamp >= cutoffTime);
  }

  // Get sensor alerts
  getSensorAlerts() {
    return Array.from(this.sensors.values()).filter(sensor => {
      if (!sensor.threshold) return false;

      return sensor.value < sensor.threshold.min ||
             sensor.value > sensor.threshold.max ||
             sensor.value > sensor.threshold.warning;
    });
  }

  // Get simulation status
  getSimulationStatus() {
    return {
      isRunning: this.isSimulating,
      config: this.simulationConfig
    };
  }

  // Start simulation
  startSimulation() {
    this.isSimulating = true;
  }

  // Stop simulation
  stopSimulation() {
    this.isSimulating = false;
  }

  // Update simulation config
  updateSimulationConfig(config) {
    this.simulationConfig = { ...this.simulationConfig, ...config };
  }

  // Export IoT data
  exportIoTData() {
    return {
      sensors: this.getAllSensors(),
      devices: this.getAllDevices(),
      energyHistory: this.energyHistory,
      alerts: this.getSensorAlerts()
    };
  }

  // Simulate environmental conditions
  async simulateEnvironmentalConditions() {
    const conditions = {
      temperature: 20 + Math.random() * 15, // 20-35°C
      humidity: 40 + Math.random() * 40, // 40-80%
      airQuality: Math.random() * 100, // 0-100 (lower is better)
      noiseLevel: 30 + Math.random() * 40, // 30-70 dB
      lightLevel: 200 + Math.random() * 800, // 200-1000 lux
      timestamp: Date.now()
    };

    return conditions;
  }

  // Create automation rule
  async createAutomationRule(trigger, action) {
    const ruleId = `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const rule = {
      id: ruleId,
      trigger,
      action,
      enabled: true,
      created: Date.now()
    };

    // Store rule (in real implementation, this would be persisted)
    console.log('Created automation rule:', rule);

    return ruleId;
  }

  // Execute automation rule
  async executeAutomationRule(ruleId) {
    // Execute a specific automation rule
    console.log('Executing automation rule:', ruleId);

    // Simplified execution - in real implementation would check conditions and perform actions
    return true;
  }

  // Energy optimization
  async optimizeEnergyUsage() {
    // AI-powered energy optimization recommendations
    const optimization = {
      recommendations: [
        'Reduce lighting in unoccupied rooms',
        'Adjust thermostat by 2°C during off-hours',
        'Schedule appliance usage for off-peak hours'
      ],
      potentialSavings: 25, // percentage
      actions: this.generateEnergyActions()
    };

    return optimization;
  }

  generateEnergyActions() {
    const actions = [];
    this.devices.forEach(device => {
      if (device.status === 'on' && device.controllable) {
        actions.push({
          deviceId: device.id,
          action: 'schedule_off',
          time: Date.now() + 3600000, // 1 hour from now
          reason: 'energy_optimization'
        });
      }
    });
    return actions;
  }

  // Predictive maintenance
  async predictMaintenanceNeeds() {
    const predictions = [];

    this.devices.forEach(device => {
      const prediction = {
        deviceId: device.id,
        maintenanceType: this.determineMaintenanceType(device),
        urgency: Math.random() > 0.8 ? 'high' : 'low',
        estimatedTime: Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000, // Within 30 days
        reason: 'predictive_analysis'
      };
      predictions.push(prediction);
    });

    return predictions;
  }

  determineMaintenanceType(device) {
    const types = ['cleaning', 'calibration', 'replacement', 'inspection'];
    return types[Math.floor(Math.random() * types.length)];
  }

  // Smart scheduling
  async createSmartSchedule(deviceId, schedule) {
    const device = this.devices.get(deviceId);
    if (!device || !device.controllable) {
      return false;
    }

    console.log(`Created smart schedule for ${device.name}:`, schedule);
    return true;
  }

  // Environmental impact analysis
  async calculateEnvironmentalImpact() {
    let totalConsumption = 0;
    this.devices.forEach(device => {
      if (device.status === 'on') {
        totalConsumption += device.powerConsumption;
      }
    });

    const impact = {
      dailyConsumption: totalConsumption * 24,
      monthlyConsumption: totalConsumption * 24 * 30,
      carbonFootprint: totalConsumption * 0.5, // kg CO2 per kWh
      renewablePercentage: 75, // percentage
      recommendations: [
        'Switch to LED lighting',
        'Use energy-efficient appliances',
        'Implement smart scheduling'
      ]
    };

    return impact;
  }

  // Add custom sensor
  addSensor(sensor) {
    this.sensors.set(sensor.id, sensor);
  }

  // Add custom device
  addDevice(device) {
    this.devices.set(device.id, device);
  }

  // Remove sensor
  removeSensor(sensorId) {
    return this.sensors.delete(sensorId);
  }

  // Remove device
  removeDevice(deviceId) {
    return this.devices.delete(deviceId);
  }
}

// Singleton instance
let iotServiceInstance = null;

function getIoTService() {
  if (!iotServiceInstance) {
    iotServiceInstance = new IoTService();
  }
  return iotServiceInstance;
}

module.exports = { IoTService, getIoTService };
