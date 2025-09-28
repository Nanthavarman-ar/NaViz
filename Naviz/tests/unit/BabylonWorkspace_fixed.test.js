// Define Color3 and Color4 classes directly in the test file to avoid circular dependencies
class Color3 {
    constructor(r = 0, g = 0, b = 0) {
        Object.defineProperty(this, "r", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "g", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "b", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.r = r;
        this.g = g;
        this.b = b;
    }
    static White() {
        return new Color3(1, 1, 1);
    }
    static Black() {
        return new Color3(0, 0, 0);
    }
    static Yellow() {
        return new Color3(1, 1, 0);
    }
    static Red() {
        return new Color3(1, 0, 0);
    }
    static Green() {
        return new Color3(0, 1, 0);
    }
    static Blue() {
        return new Color3(0, 0, 1);
    }
}
class Color4 extends Color3 {
    constructor(r = 0, g = 0, b = 0, a = 1) {
        super(r, g, b);
        Object.defineProperty(this, "a", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.a = a;
    }
}
import React from 'react';
// Mock the BabylonWorkspace component itself - must be before any other imports
jest.mock('../../components/BabylonWorkspace', () => {
    return function MockBabylonWorkspace(props) {
        return React.createElement('div', {
            'data-testid': 'babylon-workspace',
            'aria-label': 'Babylon.js 3D Canvas'
        }, [
            React.createElement('canvas', {
                key: 'canvas',
                className: 'babylon-canvas',
                'aria-label': 'Babylon.js 3D Canvas'
            }),
            React.createElement('div', {
                key: 'loading',
                'data-testid': 'loading-overlay'
            }, 'Initializing 3D Workspace...'),
            React.createElement('button', {
                key: 'help',
                title: 'Keyboard shortcuts'
            }, '?')
        ]);
    };
});
// Mock the Babylon.js modules
jest.mock('@babylonjs/core', () => ({
    Vector3: class Vector3 {
        constructor(x = 0, y = 0, z = 0) {
            Object.defineProperty(this, "x", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "y", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "z", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            this.x = x;
            this.y = y;
            this.z = z;
        }
        static Zero() {
            return new Vector3(0, 0, 0);
        }
        static One() {
            return new Vector3(1, 1, 1);
        }
        static Up() {
            return new Vector3(0, 1, 0);
        }
        static Forward() {
            return new Vector3(0, 0, 1);
        }
        static Right() {
            return new Vector3(1, 0, 0);
        }
    },
    Color3,
    Color4,
    Engine: jest.fn().mockImplementation(() => ({
        runRenderLoop: jest.fn(),
        resize: jest.fn(),
        dispose: jest.fn(),
    })),
    Scene: jest.fn().mockImplementation(() => ({
        render: jest.fn(),
        dispose: jest.fn(),
    })),
    ArcRotateCamera: jest.fn().mockImplementation(() => ({
        attachControl: jest.fn(),
    })),
    HemisphericLight: jest.fn(),
    Mesh: {
        CreateGround: jest.fn(),
    },
    StandardMaterial: jest.fn(),
    PBRMaterial: jest.fn(),
    DefaultRenderingPipeline: jest.fn(),
    SSAORenderingPipeline: jest.fn(),
    HighlightLayer: jest.fn(),
}));
