﻿import React from 'react';
import { Button } from './ui/button';

// Material Components
import { DragDropMaterialHandler } from './DragDropMaterialHandler';

// Feature Components
import MaterialEditor from './MaterialEditor';
import Minimap from './Minimap';
import MeasureTool from './MeasureTool';
import AICoDesigner from './AICoDesigner';
import MoodScenePanel from './MoodScenePanel';
import SeasonalDecorPanel from './SeasonalDecorPanel';
import ARScalePanel from './ARScalePanel';
import ScenarioPanel from './ScenarioPanel';
import Annotations from './Annotations';
import BIMIntegration from './BIMIntegration';

// Navigation & Controls Components
import MovementControlChecker from './MovementControlChecker';

// Analysis & Simulation Components
import MultiSensoryPreview from './MultiSensoryPreview';
import NoiseSimulation from './NoiseSimulation';
import PropertyInspector from './PropertyInspector';
import SceneBrowser from './SceneBrowser';
import SiteContextGenerator from './SiteContextGenerator';
import SmartAlternatives from './SmartAlternatives';
import SoundPrivacySimulation from './SoundPrivacySimulation';
import SunlightAnalysis from './SunlightAnalysis';
import SustainabilityCompliancePanel from './SustainabilityCompliancePanel';
import WindTunnelSimulation from './WindTunnelSimulation';

// Advanced Features
import PathTracing from './PathTracing';
import { PHashIntegration } from './PHashIntegration';
import { ProgressiveLoader } from './ProgressiveLoader';
import { PresentationManager } from './PresentationManager';
import PresenterMode from './PresenterMode';
import { QuantumSimulationInterface } from './QuantumSimulationInterface';

// Geo-Location Components
import GeoLocationContext from './GeoLocationContext';
import GeoWorkspaceArea from './GeoWorkspaceArea';
import { GeoSyncManager } from './GeoSyncManager';

// Specialized Components
import CameraViews from './CameraViews';
import CirculationFlowSimulation from './CirculationFlowSimulation';
import ComprehensiveSimulation from './ComprehensiveSimulation';
import ConstructionOverlay from './ConstructionOverlay';
import FloodSimulation from './FloodSimulation';
import ShadowImpactAnalysis from './ShadowImpactAnalysis';
import TrafficParkingSimulation from './TrafficParkingSimulation';

interface CustomPanelsContainerProps {
  sceneRef: React.RefObject<any>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cameraRef: React.RefObject<any>;
  engineRef: React.RefObject<any>;
  onMaterialApplied: (mesh: any, material: any) => void;
  workspaces: any[];
  selectedWorkspaceId: string | undefined;
  onWorkspaceSelect: (workspaceId: string) => void;
  simulationManagerRef: any;
  currentModelId: string;
  bimManagerRef: any;
  // Feature state props
  showMaterialEditor: boolean;
  showMinimap: boolean;
  showMeasurementTool: boolean;
  showAutoFurnish: boolean;
  showAICoDesigner: boolean;
  showMoodScene: boolean;
  showSeasonalDecor: boolean;
  showARScale: boolean;
  showScenario: boolean;
  showAnimationTimeline: boolean;
  showBIMIntegration: boolean;
  showCameraViews: boolean;
  showCirculationFlowSimulation: boolean;
  showCollabManager: boolean;
  showComprehensiveSimulation: boolean;
  showConstructionOverlay: boolean;
  showAnnotations: boolean;
  showFloodSimulation: boolean;
  showTrafficParkingSimulation: boolean;
  showShadowImpactAnalysis: boolean;
  showMovementControlChecker: boolean;
  showTeleportManager: boolean;
  showSwimMode: boolean;
  showMultiSensoryPreview: boolean;
  showNoiseSimulation: boolean;
  showPropertyInspector: boolean;
  showSceneBrowser: boolean;
  showSiteContextGenerator: boolean;
  showSmartAlternatives: boolean;
  showSoundPrivacySimulation: boolean;
  showSunlightAnalysis: boolean;
  showSustainabilityCompliancePanel: boolean;
  showPathTracing: boolean;
  showPHashIntegration: boolean;
  showProgressiveLoader: boolean;
  showPresentationManager: boolean;
  showPresenterMode: boolean;
  showQuantumSimulationInterface: boolean;
  showWeather: boolean;
  showWind: boolean;
  showNoise: boolean;
  showAIAdvisor: boolean;
  showVoiceAssistant: boolean;
  showErgonomic: boolean;
  showEnergy: boolean;
  showCost: boolean;
  showBeforeAfter: boolean;
  showComparativeTour: boolean;
  showROICalculator: boolean;
  showMultiUser: boolean;
  showChat: boolean;
  showSharing: boolean;
  showVR: boolean;
  showAR: boolean;
  showSpatialAudio: boolean;
  showHaptic: boolean;
  showXRManager: boolean;
  showGeoLocation: boolean;
  showGeoWorkspaceArea: boolean;
  showGeoSync: boolean;
  showWetMaterialManager: boolean;
  showWindTunnelSimulation: boolean;
  showUnderwaterMode: boolean;
  showWaterShader: boolean;
  showVoiceChat: boolean;
  showVRARMode: boolean;
  // State setters
  setShowMaterialEditor: (show: boolean) => void;
  setShowMinimap: (show: boolean) => void;
  setShowMeasurementTool: (show: boolean) => void;
  setShowAutoFurnish: (show: boolean) => void;
  setShowAICoDesigner: (show: boolean) => void;
  setShowMoodScene: (show: boolean) => void;
  setShowSeasonalDecor: (show: boolean) => void;
  setShowARScale: (show: boolean) => void;
  setShowScenario: (show: boolean) => void;
  setShowAnimationTimeline: (show: boolean) => void;
  setShowBIMIntegration: (show: boolean) => void;
  setShowCameraViews: (show: boolean) => void;
  setShowCirculationFlowSimulation: (show: boolean) => void;
  setShowCollabManager: (show: boolean) => void;
  setShowComprehensiveSimulation: (show: boolean) => void;
  setShowConstructionOverlay: (show: boolean) => void;
  setShowAnnotations: (show: boolean) => void;
  setShowFloodSimulation: (show: boolean) => void;
  setShowTrafficParkingSimulation: (show: boolean) => void;
  setShowShadowImpactAnalysis: (show: boolean) => void;
  setShowMovementControlChecker: (show: boolean) => void;
  setShowTeleportManager: (show: boolean) => void;
  setShowSwimMode: (show: boolean) => void;
  setShowMultiSensoryPreview: (show: boolean) => void;
  setShowNoiseSimulation: (show: boolean) => void;
  setShowPropertyInspector: (show: boolean) => void;
  setShowSceneBrowser: (show: boolean) => void;
  setShowSiteContextGenerator: (show: boolean) => void;
  setShowSmartAlternatives: (show: boolean) => void;
  setShowSoundPrivacySimulation: (show: boolean) => void;
  setShowSunlightAnalysis: (show: boolean) => void;
  setShowSustainabilityCompliancePanel: (show: boolean) => void;
  setShowPathTracing: (show: boolean) => void;
  setShowPHashIntegration: (show: boolean) => void;
  setShowProgressiveLoader: (show: boolean) => void;
  setShowPresentationManager: (show: boolean) => void;
  setShowPresenterMode: (show: boolean) => void;
  setShowQuantumSimulationInterface: (show: boolean) => void;
  setShowWeather: (show: boolean) => void;
  setShowWind: (show: boolean) => void;
  setShowNoise: (show: boolean) => void;
  setShowAIAdvisor: (show: boolean) => void;
  setShowVoiceAssistant: (show: boolean) => void;
  setShowErgonomic: (show: boolean) => void;
  setShowEnergy: (show: boolean) => void;
  setShowCost: (show: boolean) => void;
  setShowBeforeAfter: (show: boolean) => void;
  setShowComparativeTour: (show: boolean) => void;
  setShowROICalculator: (show: boolean) => void;
  setShowMultiUser: (show: boolean) => void;
  setShowChat: (show: boolean) => void;
  setShowSharing: (show: boolean) => void;
  setShowVR: (show: boolean) => void;
  setShowAR: (show: boolean) => void;
  setShowSpatialAudio: (show: boolean) => void;
  setShowHaptic: (show: boolean) => void;
  setShowXRManager: (show: boolean) => void;
  setShowGeoLocation: (show: boolean) => void;
  setShowGeoWorkspaceArea: (show: boolean) => void;
  setShowGeoSync: (show: boolean) => void;
  setShowWetMaterialManager: (show: boolean) => void;
  setShowWindTunnelSimulation: (show: boolean) => void;
  setShowUnderwaterMode: (show: boolean) => void;
  setShowWaterShader: (show: boolean) => void;
  setShowVoiceChat: (show: boolean) => void;
  setShowVRARMode: (show: boolean) => void;
}

const CustomPanelsContainer: React.FC<CustomPanelsContainerProps> = ({
  sceneRef,
  canvasRef,
  cameraRef,
  engineRef,
  onMaterialApplied,
  workspaces,
  selectedWorkspaceId,
  onWorkspaceSelect,
  simulationManagerRef,
  currentModelId,
  bimManagerRef,
  // Feature states
  showMaterialEditor,
  showMinimap,
  showMeasurementTool,
  showAutoFurnish,
  showAICoDesigner,
  showMoodScene,
  showSeasonalDecor,
  showARScale,
  showScenario,
  showAnimationTimeline,
  showBIMIntegration,
  showCameraViews,
  showCirculationFlowSimulation,
  showCollabManager,
  showComprehensiveSimulation,
  showConstructionOverlay,
  showAnnotations,
  showFloodSimulation,
  showTrafficParkingSimulation,
  showShadowImpactAnalysis,
  showMovementControlChecker,
  showTeleportManager,
  showSwimMode,
  showMultiSensoryPreview,
  showNoiseSimulation,
  showPropertyInspector,
  showSceneBrowser,
  showSiteContextGenerator,
  showSmartAlternatives,
  showSoundPrivacySimulation,
  showSunlightAnalysis,
  showSustainabilityCompliancePanel,
  showPathTracing,
  showPHashIntegration,
  showProgressiveLoader,
  showPresentationManager,
  showPresenterMode,
  showQuantumSimulationInterface,
  showWeather,
  showWind,
  showNoise,
  showAIAdvisor,
  showVoiceAssistant,
  showErgonomic,
  showEnergy,
  showCost,
  showBeforeAfter,
  showComparativeTour,
  showROICalculator,
  showMultiUser,
  showChat,
  showSharing,
  showVR,
  showAR,
  showSpatialAudio,
  showHaptic,
  showXRManager,
  showGeoLocation,
  showGeoWorkspaceArea,
  showGeoSync,
  showWetMaterialManager,
  showWindTunnelSimulation,
  showUnderwaterMode,
  showWaterShader,
  showVoiceChat,
  showVRARMode,
  // State setters
  setShowMaterialEditor,
  setShowMinimap,
  setShowMeasurementTool,
  setShowAutoFurnish,
  setShowAICoDesigner,
  setShowMoodScene,
  setShowSeasonalDecor,
  setShowARScale,
  setShowScenario,
  setShowAnimationTimeline,
  setShowBIMIntegration,
  setShowCameraViews,
  setShowCirculationFlowSimulation,
  setShowCollabManager,
  setShowComprehensiveSimulation,
  setShowConstructionOverlay,
  setShowAnnotations,
  setShowFloodSimulation,
  setShowTrafficParkingSimulation,
  setShowShadowImpactAnalysis,
  setShowMovementControlChecker,
  setShowTeleportManager,
  setShowSwimMode,
  setShowMultiSensoryPreview,
  setShowNoiseSimulation,
  setShowPropertyInspector,
  setShowSceneBrowser,
  setShowSiteContextGenerator,
  setShowSmartAlternatives,
  setShowSoundPrivacySimulation,
  setShowSunlightAnalysis,
  setShowSustainabilityCompliancePanel,
  setShowPathTracing,
  setShowPHashIntegration,
  setShowProgressiveLoader,
  setShowPresentationManager,
  setShowPresenterMode,
  setShowQuantumSimulationInterface,
  setShowWeather,
  setShowWind,
  setShowNoise,
  setShowAIAdvisor,
  setShowVoiceAssistant,
  setShowErgonomic,
  setShowEnergy,
  setShowCost,
  setShowBeforeAfter,
  setShowComparativeTour,
  setShowROICalculator,
  setShowMultiUser,
  setShowChat,
  setShowSharing,
  setShowVR,
  setShowAR,
  setShowSpatialAudio,
  setShowHaptic,
  setShowXRManager,
  setShowGeoLocation,
  setShowGeoWorkspaceArea,
  setShowGeoSync,
  setShowWetMaterialManager,
  setShowWindTunnelSimulation,
  setShowUnderwaterMode,
  setShowWaterShader,
  setShowVoiceChat,
  setShowVRARMode
}) => {
  const sceneManager = sceneRef.current ? { scene: sceneRef.current } : null;

  const AutoFurnish = AICoDesigner;

  return (
    <>
      {/* Core Features */}
      {showMaterialEditor && sceneManager && <MaterialEditor sceneManager={sceneManager} onClose={() => setShowMaterialEditor(false)} onMaterialChange={() => {}} />}
      {showMinimap && sceneRef.current && cameraRef.current && <Minimap scene={sceneRef.current} camera={cameraRef.current} onCameraMove={() => {}} workspaces={workspaces} selectedWorkspaceId={selectedWorkspaceId} onWorkspaceSelect={onWorkspaceSelect} />}
      {showMeasurementTool && sceneRef.current && engineRef.current && (
        <MeasureTool
          scene={sceneRef.current}
          engine={engineRef.current}
          isActive={showMeasurementTool}
          onMeasurementComplete={(measurement) => console.log('Measurement completed:', measurement)}
        />
      )}
      {showAutoFurnish && sceneRef.current && <AutoFurnish scene={sceneRef.current} isActive={showAutoFurnish} onClose={() => setShowAutoFurnish(false)} />}
      {showAICoDesigner && sceneRef.current && <AICoDesigner scene={sceneRef.current} isActive={showAICoDesigner} onClose={() => setShowAICoDesigner(false)} />}
      {showMoodScene && sceneManager && <MoodScenePanel sceneManager={sceneManager} onClose={() => setShowMoodScene(false)} />}
      {showSeasonalDecor && sceneManager && <SeasonalDecorPanel sceneManager={sceneManager} onClose={() => setShowSeasonalDecor(false)} />}
      {showARScale && sceneManager && <ARScalePanel sceneManager={sceneManager} onClose={() => setShowARScale(false)} />}
      {showScenario && sceneManager && <ScenarioPanel sceneManager={sceneManager} onClose={() => setShowScenario(false)} />}
      {showAnnotations && sceneManager && <Annotations scene={sceneManager.scene} isActive={showAnnotations} />}
      {showBIMIntegration && sceneManager && <BIMIntegration scene={sceneManager.scene} isActive={showBIMIntegration} bimManager={bimManagerRef ?? undefined} onClose={() => setShowBIMIntegration(false)} />}
      {sceneRef.current && canvasRef.current && (
        <DragDropMaterialHandler
          scene={sceneRef.current}
          canvas={canvasRef.current}
          onMaterialApplied={onMaterialApplied}
        />
      )}

      {/* Navigation & Controls Features */}
      {showMovementControlChecker && sceneRef.current && (
        <div className="fixed top-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Movement Control Checker</h3>
          <p className="text-slate-300 text-sm">Movement control checker active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowMovementControlChecker(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showTeleportManager && sceneRef.current && cameraRef.current && (
        <div className="fixed top-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Teleport Manager</h3>
          <p className="text-slate-300 text-sm">Teleport navigation active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowTeleportManager(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showSwimMode && sceneRef.current && cameraRef.current && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Swim Mode</h3>
          <p className="text-slate-300 text-sm">Swim mode active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSwimMode(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}

      {/* Analysis & Simulation Features */}
      {showMultiSensoryPreview && sceneRef.current && (
        <div className="fixed top-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Multi-Sensory Preview</h3>
          <p className="text-slate-300 text-sm">Multi-sensory preview active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowMultiSensoryPreview(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showNoiseSimulation && sceneRef.current && engineRef.current && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Noise Simulation</h3>
          <p className="text-slate-300 text-sm">Noise simulation active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowNoiseSimulation(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showPropertyInspector && sceneRef.current && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Property Inspector</h3>
          <p className="text-slate-300 text-sm">Property inspection active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPropertyInspector(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showSceneBrowser && sceneRef.current && (
        <div className="fixed top-4 right-1/4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Scene Browser</h3>
          <p className="text-slate-300 text-sm">Scene browsing active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSceneBrowser(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showSiteContextGenerator && sceneRef.current && (
        <div className="fixed top-4 left-1/4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Site Context Generator</h3>
          <p className="text-slate-300 text-sm">Site context generation active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSiteContextGenerator(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showSmartAlternatives && sceneRef.current && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Smart Alternatives</h3>
          <p className="text-slate-300 text-sm">Smart alternatives active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSmartAlternatives(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showSoundPrivacySimulation && sceneRef.current && engineRef.current && (
        <div className="fixed bottom-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Sound Privacy Simulation</h3>
          <p className="text-slate-300 text-sm">Sound privacy simulation active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSoundPrivacySimulation(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showSunlightAnalysis && sceneRef.current && engineRef.current && (
        <div className="fixed top-1/2 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Sunlight Analysis</h3>
          <p className="text-slate-300 text-sm">Sunlight analysis active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSunlightAnalysis(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showSustainabilityCompliancePanel && sceneRef.current && (
        <div className="fixed top-1/2 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Sustainability Compliance</h3>
          <p className="text-slate-300 text-sm">Sustainability compliance active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSustainabilityCompliancePanel(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showWindTunnelSimulation && sceneRef.current && engineRef.current && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Wind Tunnel Simulation</h3>
          <p className="text-slate-300 text-sm">Wind simulation active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowWindTunnelSimulation(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}

      {/* Advanced Features */}
      {showPathTracing && sceneRef.current && (
        <PathTracing
          scene={sceneRef.current}
          isActive={showPathTracing}
        />
      )}
      {showPHashIntegration && (
        <div className="fixed top-4 right-4 z-50 bg-gray-800 p-4 rounded-lg border border-gray-600 text-white">
          <h3 className="text-lg font-semibold mb-2">PHash Integration</h3>
          <p className="text-sm">Perceptual hashing for scene analysis</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPHashIntegration(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showProgressiveLoader && (
        <div className="fixed top-4 right-4 z-50 bg-gray-800 p-4 rounded-lg border border-gray-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Progressive Loader</h3>
          <p className="text-sm">Progressive asset loading system</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowProgressiveLoader(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showPresentationManager && (
        <div className="fixed top-4 right-4 z-50 bg-gray-800 p-4 rounded-lg border border-gray-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Presentation Manager</h3>
          <p className="text-sm">Presentation and slideshow features</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPresentationManager(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showPresenterMode && (
        <div className="fixed top-4 right-4 z-50 bg-gray-800 p-4 rounded-lg border border-gray-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Presenter Mode</h3>
          <p className="text-sm">Presentation mode for demonstrations</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPresenterMode(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showQuantumSimulationInterface && (
        <div className="fixed top-4 right-4 z-50 bg-gray-800 p-4 rounded-lg border border-gray-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Quantum Simulation</h3>
          <p className="text-sm">Quantum computing simulation interface</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowQuantumSimulationInterface(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}

      {/* Additional Simulation Features */}
      {showWeather && sceneRef.current && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Weather Simulation</h3>
          <p className="text-slate-300 text-sm">Weather effects active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowWeather(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showWind && sceneRef.current && (
        <div className="fixed top-4 right-1/4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Wind Simulation</h3>
          <p className="text-slate-300 text-sm">Wind effects active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowWind(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showNoise && sceneRef.current && (
        <div className="fixed top-4 left-1/4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Noise Simulation</h3>
          <p className="text-slate-300 text-sm">Noise analysis active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowNoise(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}

      {/* AI Features */}
      {showAIAdvisor && sceneRef.current && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">AI Advisor</h3>
          <p className="text-slate-300 text-sm">AI assistance active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAIAdvisor(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showVoiceAssistant && sceneRef.current && (
        <div className="fixed bottom-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Voice Assistant</h3>
          <p className="text-slate-300 text-sm">Voice commands active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowVoiceAssistant(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}

      {/* Analysis Features */}
      {showErgonomic && sceneRef.current && (
        <div className="fixed top-1/2 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Ergonomic Analysis</h3>
          <p className="text-slate-300 text-sm">Ergonomic evaluation active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowErgonomic(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showEnergy && sceneRef.current && (
        <div className="fixed top-1/2 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Energy Analysis</h3>
          <p className="text-slate-300 text-sm">Energy efficiency analysis active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowEnergy(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showCost && sceneRef.current && (
        <div className="fixed bottom-1/2 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Cost Estimation</h3>
          <p className="text-slate-300 text-sm">Cost analysis active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowCost(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showBeforeAfter && sceneRef.current && (
        <div className="fixed bottom-1/2 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Before/After Comparison</h3>
          <p className="text-slate-300 text-sm">Comparison mode active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowBeforeAfter(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showComparativeTour && sceneRef.current && (
        <div className="fixed top-1/4 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Comparative Tour</h3>
          <p className="text-slate-300 text-sm">Side-by-side tour active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowComparativeTour(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showROICalculator && sceneRef.current && (
        <div className="fixed top-1/4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">ROI Calculator</h3>
          <p className="text-slate-300 text-sm">ROI analysis active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowROICalculator(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}

      {/* Collaboration Features */}
      {showMultiUser && sceneRef.current && (
        <div className="fixed top-4 right-1/3 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Multi-User Collaboration</h3>
          <p className="text-slate-300 text-sm">Multi-user session active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowMultiUser(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showChat && sceneRef.current && (
        <div className="fixed bottom-4 right-1/3 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Chat</h3>
          <p className="text-slate-300 text-sm">Real-time chat active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowChat(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showSharing && sceneRef.current && (
        <div className="fixed bottom-4 left-1/3 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Sharing</h3>
          <p className="text-slate-300 text-sm">Share workspace active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSharing(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}

      {/* Immersive Features */}
      {showVR && sceneRef.current && (
        <div className="fixed top-1/3 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">VR Mode</h3>
          <p className="text-slate-300 text-sm">Virtual reality active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowVR(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showAR && sceneRef.current && (
        <div className="fixed top-1/3 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">AR Mode</h3>
          <p className="text-slate-300 text-sm">Augmented reality active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAR(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showSpatialAudio && sceneRef.current && (
        <div className="fixed bottom-1/3 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Spatial Audio</h3>
          <p className="text-slate-300 text-sm">3D audio active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSpatialAudio(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showHaptic && sceneRef.current && (
        <div className="fixed bottom-1/3 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Haptic Feedback</h3>
          <p className="text-slate-300 text-sm">Haptic feedback active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowHaptic(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}

      {/* Geo-Location Features */}
      {showGeoLocation && sceneRef.current && (
        <GeoLocationContext
          scene={sceneRef.current}
          onLocationChange={(location) => console.log('Location changed:', location)}
          onSunPathUpdate={(sunPath) => console.log('Sun path updated:', sunPath)}
        />
      )}
      {showGeoWorkspaceArea && sceneRef.current && (
        <GeoWorkspaceArea
          scene={sceneRef.current}
          geoSyncManager={new GeoSyncManager(sceneRef.current)}
          onWorkspaceCreated={(workspace) => console.log('Workspace created:', workspace)}
          onWorkspaceSelected={(workspace) => console.log('Workspace selected:', workspace)}
        />
      )}
      {showGeoSync && sceneRef.current && (
        <div className="fixed top-4 right-1/3 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Geo Sync</h3>
          <p className="text-slate-300 text-sm">Geo-synchronization active</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowGeoSync(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}

      {/* Specialized Components */}
      {showCameraViews && sceneRef.current && cameraRef.current && (
        <CameraViews
          camera={cameraRef.current}
          scene={sceneRef.current}
          onViewChange={(view) => console.log('Camera view changed:', view)}
        />
      )}
      {showCirculationFlowSimulation && sceneRef.current && engineRef.current && (
        <CirculationFlowSimulation
          scene={sceneRef.current}
          engine={engineRef.current}
          isActive={showCirculationFlowSimulation}
          onSimulationComplete={(results) => console.log('Simulation completed:', results)}
        />
      )}
      {showCollabManager && sceneRef.current && engineRef.current && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Collaboration Manager</h3>
          <p className="text-slate-300 text-sm">Collaboration features initialized</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowCollabManager(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}
      {showComprehensiveSimulation && sceneRef.current && <ComprehensiveSimulation scene={sceneRef.current} isActive={showComprehensiveSimulation} />}
      {showConstructionOverlay && sceneRef.current && (
        <ConstructionOverlay
          scene={sceneRef.current}
          onOverlayApplied={(overlay) => console.log('Overlay applied:', overlay)}
        />
      )}
      {showFloodSimulation && sceneRef.current && (
        <FloodSimulation
          scene={sceneRef.current}
          isActive={showFloodSimulation}
          onClose={() => setShowFloodSimulation(false)}
        />
      )}
      {showShadowImpactAnalysis && sceneRef.current && engineRef.current && (
        <ShadowImpactAnalysis
          scene={sceneRef.current}
          engine={engineRef.current}
          onShadowAnalysisComplete={(results) => console.log('Shadow analysis results:', results)}
        />
      )}
      {showTrafficParkingSimulation && sceneRef.current && engineRef.current && (
        <TrafficParkingSimulation
          simulationManager={simulationManagerRef.current}
          onSimulationComplete={(results) => console.log('Traffic simulation completed:', results)}
        />
      )}
    </>
  );
};

export default CustomPanelsContainer;
