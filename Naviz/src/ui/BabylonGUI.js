import { AdvancedDynamicTexture, Rectangle, Button, TextBlock, StackPanel, Control, Slider, Checkbox } from '@babylonjs/gui';
export class BabylonGUI {
    constructor(scene, config = {}, callbacks = {}) {
        Object.defineProperty(this, "scene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "advancedTexture", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "panels", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "callbacks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.scene = scene;
        this.config = {
            showNavigation: true,
            showLighting: true,
            showMaterials: true,
            showObjects: true,
            showEffects: true,
            showAdmin: false,
            ...config
        };
        this.callbacks = callbacks;
        this.initializeGUI();
        this.createPanels();
    }
    initializeGUI() {
        this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI');
        this.advancedTexture.idealWidth = 1920;
        this.advancedTexture.idealHeight = 1080;
    }
    createPanels() {
        if (this.config.showNavigation) {
            this.createNavigationPanel();
        }
        if (this.config.showLighting) {
            this.createLightingPanel();
        }
        if (this.config.showMaterials) {
            this.createMaterialsPanel();
        }
        if (this.config.showObjects) {
            this.createObjectsPanel();
        }
        if (this.config.showEffects) {
            this.createEffectsPanel();
        }
        if (this.config.showSectionCut) {
            this.createSectionCutPanel();
        }
        if (this.config.showAdmin) {
            this.createAdminPanel();
        }
    }
    createSectionCutPanel() {
        const panel = new Rectangle('sectionCutPanel');
        panel.widthInPixels = 200;
        panel.heightInPixels = 180;
        panel.cornerRadius = 10;
        panel.color = 'white';
        panel.thickness = 2;
        panel.background = 'rgba(0, 0, 0, 0.8)';
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        panel.leftInPixels = 1140;
        panel.topInPixels = 20;
        const stackPanel = new StackPanel();
        stackPanel.isVertical = true;
        stackPanel.spacing = 10;
        panel.addControl(stackPanel);
        // Title
        const title = new TextBlock();
        title.text = 'Section Cut';
        title.color = 'white';
        title.fontSize = 18;
        title.fontWeight = 'bold';
        title.heightInPixels = 30;
        stackPanel.addControl(title);
        // Add Section Cut button
        const addButton = Button.CreateSimpleButton('addSectionCut', 'Add Section Cut');
        addButton.widthInPixels = 160;
        addButton.heightInPixels = 40;
        addButton.color = 'white';
        addButton.cornerRadius = 5;
        addButton.background = 'rgba(200, 0, 0, 0.8)';
        addButton.onPointerUpObservable.add(() => {
            if (this.callbacks.onSectionCutAdd) {
                // Example: add a horizontal cut plane at origin
                this.callbacks.onSectionCutAdd({ x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: 0 });
            }
        });
        stackPanel.addControl(addButton);
        // Remove Section Cut button
        const removeButton = Button.CreateSimpleButton('removeSectionCut', 'Remove Section Cuts');
        removeButton.widthInPixels = 160;
        removeButton.heightInPixels = 40;
        removeButton.color = 'white';
        removeButton.cornerRadius = 5;
        removeButton.background = 'rgba(100, 0, 0, 0.8)';
        removeButton.onPointerUpObservable.add(() => {
            if (this.callbacks.onSectionCutRemove) {
                this.callbacks.onSectionCutRemove();
            }
        });
        stackPanel.addControl(removeButton);
        this.advancedTexture.addControl(panel);
        this.panels.set('sectionCut', panel);
    }
    createNavigationPanel() {
        const panel = new Rectangle('navigationPanel');
        panel.widthInPixels = 200;
        panel.heightInPixels = 300;
        panel.cornerRadius = 10;
        panel.color = 'white';
        panel.thickness = 2;
        panel.background = 'rgba(0, 0, 0, 0.8)';
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        panel.leftInPixels = 20;
        panel.topInPixels = 20;
        const stackPanel = new StackPanel();
        stackPanel.isVertical = true;
        stackPanel.spacing = 10;
        panel.addControl(stackPanel);
        // Title
        const title = new TextBlock();
        title.text = 'Navigation';
        title.color = 'white';
        title.fontSize = 18;
        title.fontWeight = 'bold';
        title.heightInPixels = 30;
        stackPanel.addControl(title);
        // Navigation mode buttons
        const modes = [
            { name: 'Orbit', value: 'orbit' },
            { name: 'Walk', value: 'walk' },
            { name: 'Tabletop', value: 'tabletop' },
            { name: 'Fly', value: 'fly' }
        ];
        modes.forEach(mode => {
            const button = Button.CreateSimpleButton(`nav_${mode.value}`, mode.name);
            button.widthInPixels = 160;
            button.heightInPixels = 40;
            button.color = 'white';
            button.cornerRadius = 5;
            button.background = 'rgba(0, 100, 200, 0.8)';
            button.onPointerUpObservable.add(() => {
                if (this.callbacks.onNavigationModeChange) {
                    this.callbacks.onNavigationModeChange(mode.value);
                }
            });
            stackPanel.addControl(button);
        });
        // Reset view button
        const resetButton = Button.CreateSimpleButton('resetView', 'Reset View');
        resetButton.widthInPixels = 160;
        resetButton.heightInPixels = 40;
        resetButton.color = 'white';
        resetButton.cornerRadius = 5;
        resetButton.background = 'rgba(200, 100, 0, 0.8)';
        stackPanel.addControl(resetButton);
        this.advancedTexture.addControl(panel);
        this.panels.set('navigation', panel);
    }
    createLightingPanel() {
        const panel = new Rectangle('lightingPanel');
        panel.widthInPixels = 200;
        panel.heightInPixels = 250;
        panel.cornerRadius = 10;
        panel.color = 'white';
        panel.thickness = 2;
        panel.background = 'rgba(0, 0, 0, 0.8)';
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        panel.leftInPixels = 240;
        panel.topInPixels = 20;
        const stackPanel = new StackPanel();
        stackPanel.isVertical = true;
        stackPanel.spacing = 10;
        panel.addControl(stackPanel);
        // Title
        const title = new TextBlock();
        title.text = 'Lighting';
        title.color = 'white';
        title.fontSize = 18;
        title.fontWeight = 'bold';
        title.heightInPixels = 30;
        stackPanel.addControl(title);
        // Lighting presets
        const presets = ['Day', 'Night', 'Interior', 'HDRI'];
        presets.forEach(preset => {
            const button = Button.CreateSimpleButton(`light_${preset.toLowerCase()}`, preset);
            button.widthInPixels = 160;
            button.heightInPixels = 35;
            button.color = 'white';
            button.cornerRadius = 5;
            button.background = 'rgba(200, 150, 0, 0.8)';
            button.onPointerUpObservable.add(() => {
                if (this.callbacks.onLightingPresetChange) {
                    this.callbacks.onLightingPresetChange(preset.toLowerCase());
                }
            });
            stackPanel.addControl(button);
        });
        this.advancedTexture.addControl(panel);
        this.panels.set('lighting', panel);
    }
    createMaterialsPanel() {
        const panel = new Rectangle('materialsPanel');
        panel.widthInPixels = 200;
        panel.heightInPixels = 300;
        panel.cornerRadius = 10;
        panel.color = 'white';
        panel.thickness = 2;
        panel.background = 'rgba(0, 0, 0, 0.8)';
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        panel.leftInPixels = 460;
        panel.topInPixels = 20;
        const stackPanel = new StackPanel();
        stackPanel.isVertical = true;
        stackPanel.spacing = 8;
        panel.addControl(stackPanel);
        // Title
        const title = new TextBlock();
        title.text = 'Materials';
        title.color = 'white';
        title.fontSize = 18;
        title.fontWeight = 'bold';
        title.heightInPixels = 30;
        stackPanel.addControl(title);
        // Material categories
        const materials = [
            { name: 'Metal', category: 'metal' },
            { name: 'Wood', category: 'wood' },
            { name: 'Glass', category: 'glass' },
            { name: 'Fabric', category: 'fabric' },
            { name: 'Stone', category: 'stone' },
            { name: 'Plastic', category: 'plastic' }
        ];
        materials.forEach(material => {
            const button = Button.CreateSimpleButton(`mat_${material.category}`, material.name);
            button.widthInPixels = 160;
            button.heightInPixels = 35;
            button.color = 'white';
            button.cornerRadius = 5;
            button.background = 'rgba(100, 200, 100, 0.8)';
            button.onPointerUpObservable.add(() => {
                if (this.callbacks.onMaterialChange) {
                    this.callbacks.onMaterialChange(material.category);
                }
            });
            stackPanel.addControl(button);
        });
        this.advancedTexture.addControl(panel);
        this.panels.set('materials', panel);
    }
    createObjectsPanel() {
        const panel = new Rectangle('objectsPanel');
        panel.widthInPixels = 200;
        panel.heightInPixels = 280;
        panel.cornerRadius = 10;
        panel.color = 'white';
        panel.thickness = 2;
        panel.background = 'rgba(0, 0, 0, 0.8)';
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        panel.leftInPixels = 680;
        panel.topInPixels = 20;
        const stackPanel = new StackPanel();
        stackPanel.isVertical = true;
        stackPanel.spacing = 8;
        panel.addControl(stackPanel);
        // Title
        const title = new TextBlock();
        title.text = 'Objects';
        title.color = 'white';
        title.fontSize = 18;
        title.fontWeight = 'bold';
        title.heightInPixels = 30;
        stackPanel.addControl(title);
        // Object categories with checkboxes
        const categories = [
            'Furniture',
            'Lighting',
            'Decoration',
            'Structure',
            'Landscape'
        ];
        categories.forEach(category => {
            const container = new Rectangle();
            container.widthInPixels = 160;
            container.heightInPixels = 30;
            container.thickness = 0;
            const checkbox = new Checkbox();
            checkbox.widthInPixels = 20;
            checkbox.heightInPixels = 20;
            checkbox.isChecked = true;
            checkbox.color = 'white';
            checkbox.background = 'rgba(100, 100, 100, 0.8)';
            checkbox.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            checkbox.leftInPixels = 10;
            const label = new TextBlock();
            label.text = category;
            label.color = 'white';
            label.fontSize = 14;
            label.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            label.leftInPixels = 40;
            checkbox.onIsCheckedChangedObservable.add((value) => {
                if (this.callbacks.onObjectToggle) {
                    this.callbacks.onObjectToggle(category.toLowerCase(), value);
                }
            });
            container.addControl(checkbox);
            container.addControl(label);
            stackPanel.addControl(container);
        });
        this.advancedTexture.addControl(panel);
        this.panels.set('objects', panel);
    }
    createEffectsPanel() {
        const panel = new Rectangle('effectsPanel');
        panel.widthInPixels = 200;
        panel.heightInPixels = 320;
        panel.cornerRadius = 10;
        panel.color = 'white';
        panel.thickness = 2;
        panel.background = 'rgba(0, 0, 0, 0.8)';
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        panel.leftInPixels = 700;
        panel.topInPixels = 20;
        const stackPanel = new StackPanel();
        stackPanel.isVertical = true;
        stackPanel.spacing = 8;
        panel.addControl(stackPanel);
        // Title
        const title = new TextBlock();
        title.text = 'Effects';
        title.color = 'white';
        title.fontSize = 18;
        title.fontWeight = 'bold';
        title.heightInPixels = 30;
        stackPanel.addControl(title);
        // Effects toggles
        const effects = [
            { name: 'Fog', key: 'fog' },
            { name: 'Bloom', key: 'bloom' },
            { name: 'SSAO', key: 'ssao' },
            { name: 'Shadows', key: 'shadows' }
        ];
        effects.forEach(effect => {
            const container = new Rectangle();
            container.widthInPixels = 160;
            container.heightInPixels = 30;
            container.thickness = 0;
            const checkbox = new Checkbox();
            checkbox.widthInPixels = 20;
            checkbox.heightInPixels = 20;
            checkbox.isChecked = true;
            checkbox.color = 'white';
            checkbox.background = 'rgba(100, 100, 100, 0.8)';
            checkbox.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            checkbox.leftInPixels = 10;
            const label = new TextBlock();
            label.text = effect.name;
            label.color = 'white';
            label.fontSize = 14;
            label.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            label.leftInPixels = 40;
            checkbox.onIsCheckedChangedObservable.add((value) => {
                if (this.callbacks.onEffectToggle) {
                    this.callbacks.onEffectToggle(effect.key, value);
                }
            });
            container.addControl(checkbox);
            container.addControl(label);
            stackPanel.addControl(container);
        });
        // Sliders for effect intensity
        const bloomSlider = new Slider();
        bloomSlider.minimum = 0;
        bloomSlider.maximum = 2;
        bloomSlider.value = 0.3;
        bloomSlider.widthInPixels = 160;
        bloomSlider.heightInPixels = 20;
        bloomSlider.color = 'white';
        bloomSlider.background = 'rgba(100, 100, 100, 0.8)';
        const bloomLabel = new TextBlock();
        bloomLabel.text = 'Bloom Strength';
        bloomLabel.color = 'white';
        bloomLabel.fontSize = 12;
        bloomLabel.heightInPixels = 20;
        stackPanel.addControl(bloomLabel);
        stackPanel.addControl(bloomSlider);
        // Exposure slider
        const exposureSlider = new Slider();
        exposureSlider.minimum = 0.1;
        exposureSlider.maximum = 3;
        exposureSlider.value = 1;
        exposureSlider.widthInPixels = 160;
        exposureSlider.heightInPixels = 20;
        exposureSlider.color = 'white';
        exposureSlider.background = 'rgba(100, 100, 100, 0.8)';
        const exposureLabel = new TextBlock();
        exposureLabel.text = 'Exposure';
        exposureLabel.color = 'white';
        exposureLabel.fontSize = 12;
        exposureLabel.heightInPixels = 20;
        stackPanel.addControl(exposureLabel);
        stackPanel.addControl(exposureSlider);
        this.advancedTexture.addControl(panel);
        this.panels.set('effects', panel);
    }
    createAdminPanel() {
        const panel = new Rectangle('adminPanel');
        panel.widthInPixels = 200;
        panel.heightInPixels = 200;
        panel.cornerRadius = 10;
        panel.color = 'white';
        panel.thickness = 2;
        panel.background = 'rgba(0, 0, 0, 0.8)';
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        panel.leftInPixels = 920;
        panel.topInPixels = 20;
        const stackPanel = new StackPanel();
        stackPanel.isVertical = true;
        stackPanel.spacing = 10;
        panel.addControl(stackPanel);
        // Title
        const title = new TextBlock();
        title.text = 'Admin';
        title.color = 'white';
        title.fontSize = 18;
        title.fontWeight = 'bold';
        title.heightInPixels = 30;
        stackPanel.addControl(title);
        // Upload button
        const uploadButton = Button.CreateSimpleButton('uploadModel', 'Upload Model');
        uploadButton.widthInPixels = 160;
        uploadButton.heightInPixels = 40;
        uploadButton.color = 'white';
        uploadButton.cornerRadius = 5;
        uploadButton.background = 'rgba(200, 0, 100, 0.8)';
        uploadButton.onPointerUpObservable.add(() => {
            if (this.callbacks.onUploadModel) {
                this.callbacks.onUploadModel();
            }
        });
        stackPanel.addControl(uploadButton);
        // Manage models button
        const manageButton = Button.CreateSimpleButton('manageModels', 'Manage Models');
        manageButton.widthInPixels = 160;
        manageButton.heightInPixels = 40;
        manageButton.color = 'white';
        manageButton.cornerRadius = 5;
        manageButton.background = 'rgba(100, 0, 200, 0.8)';
        stackPanel.addControl(manageButton);
        this.advancedTexture.addControl(panel);
        this.panels.set('admin', panel);
    }
    showPanel(panelName) {
        const panel = this.panels.get(panelName);
        if (panel) {
            panel.isVisible = true;
        }
    }
    hidePanel(panelName) {
        const panel = this.panels.get(panelName);
        if (panel) {
            panel.isVisible = false;
        }
    }
    togglePanel(panelName) {
        const panel = this.panels.get(panelName);
        if (panel) {
            panel.isVisible = !panel.isVisible;
        }
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.recreatePanels();
    }
    recreatePanels() {
        // Clear existing panels
        this.panels.forEach(panel => {
            this.advancedTexture.removeControl(panel);
        });
        this.panels.clear();
        // Recreate panels based on new config
        this.createPanels();
    }
    dispose() {
        this.panels.forEach(panel => {
            this.advancedTexture.removeControl(panel);
        });
        this.panels.clear();
        this.advancedTexture.dispose();
    }
}
