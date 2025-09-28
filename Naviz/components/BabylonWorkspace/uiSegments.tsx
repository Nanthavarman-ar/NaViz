import React from 'react';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Maximize } from 'lucide-react';

// Lazy load components
const LeftPanel = React.lazy(() => import('../LeftPanel'));
const ControlPanel = React.lazy(() => import('../../src/components/UI/ControlPanel/ControlPanel'));
const TopBar = React.lazy(() => import('../TopBar'));
const BottomPanel = React.lazy(() => import('../BottomPanel'));
const FloatingToolbar = React.lazy(() => import('../FloatingToolbar'));
const EnhancedWorkspaceLayout = React.lazy(() => import('../EnhancedWorkspaceLayout'));
const EnhancedToolbar = React.lazy(() => import('../EnhancedToolbar'));

// Props interfaces
interface LeftPanelSegmentProps {
  featureCategories: Record<string, any[]>;
  categoryPanelVisible: Record<string, boolean>;
  searchTerm: string;
  activeFeatures: Set<string>;
  currentLayoutMode: 'standard' | 'compact' | 'immersive';
  onCategoryToggle: (category: string) => void;
  onSearchChange: (term: string) => void;
  onFeatureToggle: (featureId: string | number, enabled: boolean) => void;
  onClose: () => void;
  aiManagerRef?: React.RefObject<any>;
  bimManagerRef?: React.RefObject<any>;
}

interface TopBarSegmentProps {
  isGenerating: boolean;
  generationProgress: number;
  onToggleRealTime: () => void;
  realTimeEnabled: boolean;
  fps: number;
  activeFeatures: Set<string>;
  cameraMode: 'orbit' | 'fly' | 'walk' | undefined;
  onCameraModeChange: (mode: 'orbit' | 'fly' | 'walk' | undefined) => void;
  onToggleGrid: () => void;
  gridVisible: boolean;
  onToggleWireframe: () => void;
  wireframeEnabled: boolean;
  onToggleStats: () => void;
  statsVisible: boolean;
}

interface BottomPanelSegmentProps {
  activeFeatures: string[];
  performanceMode: 'low' | 'medium' | 'high';
  selectedMesh: any;
  onFeatureToggle: (featureId: string) => void;
  onPerformanceModeChange: (mode: 'low' | 'medium' | 'high') => void;
  featureStats: { total: number; active: number; byCategory: Record<string, number>; byStatus: Record<string, number> };
  warnings: string[];
  suggestions: string[];
  onSequenceCreate: (sequence: any) => void;
  onSequencePlay: (sequenceId: string) => void;
}

interface FloatingToolbarSegmentProps {
  onMoveToggle: () => void;
  onRotateToggle: () => void;
  onScaleToggle: () => void;
  onCameraToggle: () => void;
  onPerspectiveToggle: () => void;
  isMoveActive: boolean;
  isRotateActive: boolean;
  isScaleActive: boolean;
  isCameraActive: boolean;
  isPerspectiveActive: boolean;
}

// Components
export const LeftPanelSegment: React.FC<LeftPanelSegmentProps> = ({
  featureCategories,
  categoryPanelVisible,
  searchTerm,
  activeFeatures,
  currentLayoutMode,
  onCategoryToggle,
  onSearchChange,
  onFeatureToggle,
  onClose,
  aiManagerRef,
  bimManagerRef
}) => (
  <Suspense fallback={<div className="p-4">Loading Left Panel...</div>}>
    <LeftPanel
      featureCategories={featureCategories}
      categoryPanelVisible={categoryPanelVisible}
      searchTerm={searchTerm}
      activeFeatures={activeFeatures}
      currentLayoutMode={currentLayoutMode}
      onCategoryToggle={onCategoryToggle}
      onSearchChange={onSearchChange}
      onFeatureToggle={onFeatureToggle}
      onClose={onClose}
      aiManagerRef={aiManagerRef}
      bimManagerRef={bimManagerRef}
    />
  </Suspense>
);

export const TopBarSegment: React.FC<TopBarSegmentProps> = ({
  isGenerating,
  generationProgress,
  onToggleRealTime,
  realTimeEnabled,
  fps,
  activeFeatures,
  cameraMode,
  onCameraModeChange,
  onToggleGrid,
  gridVisible,
  onToggleWireframe,
  wireframeEnabled,
  onToggleStats,
  statsVisible
}) => (
  <Suspense fallback={<div className="p-2">Loading Top Bar...</div>}>
    <TopBar
      isGenerating={isGenerating}
      generationProgress={generationProgress}
      onToggleRealTime={onToggleRealTime}
      realTimeEnabled={realTimeEnabled}
      fps={fps.toString()}
      activeFeatures={activeFeatures.size.toString()}
      cameraMode={cameraMode}
      onCameraModeChange={onCameraModeChange}
      onToggleGrid={onToggleGrid}
      gridVisible={gridVisible}
      onToggleWireframe={onToggleWireframe}
      wireframeEnabled={wireframeEnabled}
      onToggleStats={onToggleStats}
      statsVisible={statsVisible}
    />
  </Suspense>
);

export const BottomPanelSegment: React.FC<BottomPanelSegmentProps> = ({
  activeFeatures,
  performanceMode,
  selectedMesh,
  onFeatureToggle,
  onPerformanceModeChange,
  featureStats,
  warnings,
  suggestions,
  onSequenceCreate,
  onSequencePlay
}) => (
  <Suspense fallback={<div className="p-2">Loading Bottom Panel...</div>}>
    <BottomPanel
      activeFeatures={activeFeatures}
      performanceMode={performanceMode}
      selectedMesh={selectedMesh}
      onFeatureToggle={onFeatureToggle}
      onPerformanceModeChange={onPerformanceModeChange}
      featureStats={featureStats}
      warnings={warnings}
      suggestions={suggestions}
      onSequenceCreate={onSequenceCreate}
      onSequencePlay={onSequencePlay}
    />
  </Suspense>
);

export const FloatingToolbarSegment: React.FC<FloatingToolbarSegmentProps> = ({
  onMoveToggle,
  onRotateToggle,
  onScaleToggle,
  onCameraToggle,
  onPerspectiveToggle,
  isMoveActive,
  isRotateActive,
  isScaleActive,
  isCameraActive,
  isPerspectiveActive
}) => (
  <Suspense fallback={<div className="p-2">Loading Toolbar...</div>}>
    <div className="fixed top-24 left-6 z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-3">
      <FloatingToolbar
        onMoveToggle={onMoveToggle}
        onRotateToggle={onRotateToggle}
        onScaleToggle={onScaleToggle}
        onCameraToggle={onCameraToggle}
        onPerspectiveToggle={onPerspectiveToggle}
        isMoveActive={isMoveActive}
        isRotateActive={isRotateActive}
        isScaleActive={isScaleActive}
        isCameraActive={isCameraActive}
        isPerspectiveActive={isPerspectiveActive}
      />
    </div>
  </Suspense>
);

// Immersive mode controls component
export const ImmersiveControls: React.FC<{
  activeFeatures: Set<string>;
  featuresByCategory: Record<string, any[]>;
  handleCategoryToggle: (category: string) => void;
  updateState: (updates: any) => void;
}> = ({ activeFeatures, featuresByCategory, handleCategoryToggle, updateState }) => (
  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
    <Card className="bg-background">
      <CardContent className="p-2 flex items-center gap-2">
        <Badge variant="outline">{activeFeatures.size}</Badge>
        <Separator orientation="vertical" className="h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" aria-label="Feature Categories">
              📂
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.keys(featuresByCategory).map(category => (
              <DropdownMenuItem key={category} onClick={() => handleCategoryToggle(category)}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" variant="ghost" onClick={() => updateState({ leftPanelVisible: false })} title="Toggle Left Panel">
          🎛️
        </Button>
        <Button size="sm" variant="ghost" onClick={() => updateState({ rightPanelVisible: false })} title="Toggle Right Panel">
          ⚙️
        </Button>
        <Button size="sm" variant="ghost" onClick={() => updateState({ leftPanelVisible: true, rightPanelVisible: true, bottomPanelVisible: true })} title="Exit Immersive Mode">
          🔙
        </Button>
      </CardContent>
    </Card>
  </div>
);

// Loading overlay component
export const LoadingOverlay: React.FC<{
  isInitialized: boolean;
}> = ({ isInitialized }) => {
  if (isInitialized) return null;

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="bg-black/80 text-white border-gray-600">
        <CardContent className="p-6 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Initializing 3D Workspace....</p>
        </CardContent>
      </Card>
    </div>
  );
};

// Keyboard shortcuts help component
export const KeyboardShortcutsHelp: React.FC = () => (
  <div className="fixed bottom-4 right-4 z-50">
    <Button size="sm" variant="outline" className="rounded-full w-8 h-8 p-0" title="Keyboard Shortcuts">
      ?
    </Button>
    <div className="absolute bottom-12 right-0 bg-gray-900 text-white p-2 rounded shadow-lg text-xs hidden">
      <div><kbd>Ctrl+1/2/3</kbd> Layout modes</div>
      <div><kbd>Ctrl+H/J/K</kbd> Toggle panels</div>
      <div><kbd>W/F/T/N</kbd> Simulation features</div>
      <div><kbd>A/U/C/V</kbd> AI features</div>
      <div><kbd>X/Z</kbd> VR/AR modes</div>
    </div>
  </div>
);

// Hidden file input component
export const HiddenFileInput: React.FC<{
  fileInputRef: React.RefObject<HTMLInputElement>;
}> = ({ fileInputRef }) => (
  <>
    <label htmlFor="file-upload" className="hidden">File Upload</label>
    <input
      id="file-upload"
      ref={fileInputRef}
      type="file"
      multiple
      accept=".gltf,.glb,.obj,.fbx,.stl"
      className="hidden"
      onChange={(e) => {
        // Handle file upload
        console.log('Files selected:', e.target.files);
      }}
    />
  </>
);

// Additional lazy loads for custom panels
const MaterialEditor = React.lazy(() => import('../MaterialEditor'));
const Minimap = React.lazy(() => import('../Minimap'));
const MeasureTool = React.lazy(() => import('../MeasureTool'));
const AutoFurnish = React.lazy(() => import('../AutoFurnish'));
const AICoDesigner = React.lazy(() => import('../AICoDesigner'));
const AnimationTimeline = React.lazy(() => import('../AnimationTimeline').then(module => ({ default: module.AnimationTimeline })));
const DragDropMaterialHandler = React.lazy(() => import('../DragDropMaterialHandler').then(module => ({ default: module.DragDropMaterialHandler })));
const BIMIntegration = React.lazy(() => import('../BIMIntegration'));
const EnergyDashboard = React.lazy(() => import('../EnergyDashboard'));
const GeoLocationContext = React.lazy(() => import('../GeoLocationContext'));
const CameraViews = React.lazy(() => import('../CameraViews'));
const CirculationFlowSimulation = React.lazy(() => import('../CirculationFlowSimulation'));
const ConstructionOverlay = React.lazy(() => import('../ConstructionOverlay'));
const FloodSimulation = React.lazy(() => import('../FloodSimulation'));
const ShadowImpactAnalysis = React.lazy(() => import('../ShadowImpactAnalysis'));
const TrafficParkingSimulation = React.lazy(() => import('../TrafficParkingSimulation'));
const ComprehensiveSimulation = React.lazy(() => import('../ComprehensiveSimulation'));
const CostEstimatorWrapper = React.lazy(() => import('../CostEstimatorWrapper'));

// Props interface for CustomPanelsSegment
interface CustomPanelsSegmentProps {
  featureStates: Record<string, boolean>;
  sceneRef: React.RefObject<any>;
  engineRef: React.RefObject<any>;
  cameraRef: React.RefObject<any>;
  bimManagerRef: React.RefObject<any>;
  simulationManagerRef: React.RefObject<any>;
  aiManagerRef: React.RefObject<any>;
  currentModelId: string;
  workspaces: any[];
  selectedWorkspaceId: string;
  handleWorkspaceSelect: (id: string) => void;
  handleMaterialApplied: (mesh: any, material: any) => void;
  handleAnimationCreate: (sequence: any) => void;
  handleSequencePlay: (sequenceId: string, options?: any) => void;
  handleTourSequenceCreate: (sequence: any) => void;
  handleTourSequencePlay: (sequenceId: string) => void;
  disableFeature: (id: string) => void;
  workspaceState: {
    selectedMesh: any;
  };
}

// Main CustomPanelsSegment that composes all sub-segments
export const CustomPanelsSegment: React.FC<CustomPanelsSegmentProps> = (props) => (
  <>
    <CoreFeaturesSegment {...props} />
    <NavigationControlsSegment {...props} />
    <SimulationAnalysisSegment {...props} />
    <AdvancedFeaturesSegment {...props} />
    <AdditionalSimulationSegment {...props} />
    <AIFeaturesSegment {...props} />
    <AnalysisFeaturesSegment {...props} />
    <CollaborationFeaturesSegment {...props} />
    <ImmersiveFeaturesSegment {...props} />
    <GeoFeaturesSegment {...props} />
    <SpecializedComponentsSegment {...props} />
  </>
);

// Sub-segment components for CustomPanels
const CoreFeaturesSegment: React.FC<Pick<CustomPanelsSegmentProps, 'featureStates' | 'sceneRef' | 'engineRef' | 'cameraRef' | 'bimManagerRef' | 'aiManagerRef' | 'workspaces' | 'selectedWorkspaceId' | 'handleWorkspaceSelect' | 'handleMaterialApplied' | 'handleAnimationCreate' | 'handleSequencePlay' | 'disableFeature'>> = ({
  featureStates, sceneRef, engineRef, cameraRef, bimManagerRef, aiManagerRef, workspaces, selectedWorkspaceId, handleWorkspaceSelect, handleMaterialApplied, handleAnimationCreate, handleSequencePlay, disableFeature
}) => (
  <>
    {featureStates.showMaterialEditor && sceneRef.current && <MaterialEditor sceneManager={{ scene: sceneRef.current }} onClose={() => disableFeature('showMaterialEditor')} onMaterialChange={() => {}} />}
    {featureStates.showMinimap && sceneRef.current && cameraRef.current && <Minimap scene={sceneRef.current} camera={cameraRef.current} workspaces={workspaces} selectedWorkspaceId={selectedWorkspaceId} onWorkspaceSelect={handleWorkspaceSelect} />}
    {featureStates.showMeasurementTool && sceneRef.current && engineRef.current && (
      <MeasureTool
        scene={sceneRef.current}
        engine={engineRef.current}
        isActive={featureStates.showMeasurementTool}
        onMeasurementComplete={(measurement: any) => console.log('Measurement completed:', measurement)}
      />
    )}
    {featureStates.showAutoFurnish && sceneRef.current && <AutoFurnish sceneManager={{ scene: sceneRef.current }} onClose={() => disableFeature('showAutoFurnish')} />}
    {featureStates.showAICoDesigner && sceneRef.current && <AICoDesigner scene={sceneRef.current} isActive={featureStates.showAICoDesigner} onClose={() => disableFeature('showAICoDesigner')} />}
    {featureStates.showScanAnimal && aiManagerRef.current && (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Scan Animal</h3>
        <p className="text-slate-300 text-sm">AI-powered animal scanning active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showScanAnimal')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showMoodScene && sceneRef.current && (
      <div className="fixed top-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Mood Scene</h3>
        <p className="text-slate-300 text-sm">Mood scene active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showMoodScene')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showSeasonalDecor && sceneRef.current && (
      <div className="fixed top-4 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Seasonal Decor</h3>
        <p className="text-slate-300 text-sm">Seasonal decor active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showSeasonalDecor')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showARScale && sceneRef.current && (
      <div className="fixed bottom-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">AR Scale</h3>
        <p className="text-slate-300 text-sm">AR scale active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showARScale')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showScenario && sceneRef.current && (
      <div className="fixed bottom-4 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Scenario</h3>
        <p className="text-slate-300 text-sm">Scenario active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showScenario')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showAnnotations && sceneRef.current && (
      <div className="fixed top-1/2 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Annotations</h3>
        <p className="text-slate-300 text-sm">Annotations active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showAnnotations')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showBIMIntegration && sceneRef.current && bimManagerRef.current && <BIMIntegration scene={sceneRef.current} isActive={featureStates.showBIMIntegration} bimManager={bimManagerRef.current} onClose={() => disableFeature('showBIMIntegration')} />}
    {sceneRef.current && engineRef.current && (
      <DragDropMaterialHandler
        scene={sceneRef.current}
        canvas={engineRef.current.getRenderingCanvas()!}
        onMaterialApplied={handleMaterialApplied}
      />
    )}
    {sceneRef.current && (
      <AnimationTimeline
        animationManager={{}}
        selectedObject={null}
        onSequenceCreate={handleAnimationCreate}
        onSequencePlay={handleSequencePlay}
      />
    )}
  </>
);

const NavigationControlsSegment: React.FC<Pick<CustomPanelsSegmentProps, 'featureStates' | 'sceneRef' | 'cameraRef' | 'disableFeature'>> = ({
  featureStates, sceneRef, cameraRef, disableFeature
}) => (
  <>
    {featureStates.showMovementControlChecker && sceneRef.current && (
      <div className="fixed top-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Movement Control Checker</h3>
        <p className="text-slate-300 text-sm">Movement control checker active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showMovementControlChecker')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showTeleportManager && sceneRef.current && cameraRef.current && (
      <div className="fixed top-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Teleport Manager</h3>
        <p className="text-slate-300 text-sm">Teleport navigation active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showTeleportManager')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showSwimMode && sceneRef.current && cameraRef.current && (
      <div className="fixed top-4 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Swim Mode</h3>
        <p className="text-slate-300 text-sm">Swim mode active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showSwimMode')} className="mt-2">Close</Button>
      </div>
    )}
  </>
);

const SimulationAnalysisSegment: React.FC<Pick<CustomPanelsSegmentProps, 'featureStates' | 'sceneRef' | 'engineRef' | 'disableFeature'>> = ({
  featureStates, sceneRef, engineRef, disableFeature
}) => {
  const [waterLevel, setWaterLevel] = React.useState(0.5);
  const [waveSpeed, setWaveSpeed] = React.useState(1.0);
  const [sphereCount, setSphereCount] = React.useState(10);
  const [lightIntensity, setLightIntensity] = React.useState(1.5);
  const [particleIntensity, setParticleIntensity] = React.useState(1500);

  return (
    <>
      {featureStates.showMultiSensoryPreview && sceneRef.current && (
        <div className="fixed top-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Multi-Sensory Preview</h3>
          <p className="text-slate-300 text-sm">Multi-sensory preview active</p>
          <Button size="sm" variant="outline" onClick={() => disableFeature('showMultiSensoryPreview')} className="mt-2">Close</Button>
        </div>
      )}
      {featureStates.showNoiseSimulation && sceneRef.current && engineRef.current && (
        <Card className="fixed top-4 right-4 z-50 w-80 bg-slate-800 border-slate-600 text-white">
          <CardHeader>
            <CardTitle>Noise Simulation</CardTitle>
            <Button size="sm" variant="outline" onClick={() => disableFeature('showNoiseSimulation')}>Close</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label>Sphere Count</Label>
            <Slider value={[sphereCount]} onValueChange={(v: [number, number]) => setSphereCount(v[0])} max={50} step={1} />
            <Button onClick={() => console.log('Noise updated:', sphereCount)}>Update</Button>
          </CardContent>
        </Card>
      )}
      {featureStates.showPropertyInspector && sceneRef.current && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Property Inspector</h3>
          <p className="text-slate-300 text-sm">Property inspection active</p>
          <Button size="sm" variant="outline" onClick={() => disableFeature('showPropertyInspector')} className="mt-2">Close</Button>
        </div>
      )}
      {featureStates.showSceneBrowser && sceneRef.current && (
        <div className="fixed top-4 right-1/4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Scene Browser</h3>
          <p className="text-slate-300 text-sm">Scene browsing active</p>
          <Button size="sm" variant="outline" onClick={() => disableFeature('showSceneBrowser')} className="mt-2">Close</Button>
        </div>
      )}
      {featureStates.showSiteContextGenerator && sceneRef.current && (
        <div className="fixed top-4 left-1/4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Site Context Generator</h3>
          <p className="text-slate-300 text-sm">Site context generation active</p>
          <Button size="sm" variant="outline" onClick={() => disableFeature('showSiteContextGenerator')} className="mt-2">Close</Button>
        </div>
      )}
      {featureStates.showSmartAlternatives && sceneRef.current && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Smart Alternatives</h3>
          <p className="text-slate-300 text-sm">Smart alternatives active</p>
          <Button size="sm" variant="outline" onClick={() => disableFeature('showSmartAlternatives')} className="mt-2">Close</Button>
        </div>
      )}
      {featureStates.showSoundPrivacySimulation && sceneRef.current && engineRef.current && (
        <div className="fixed bottom-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Sound Privacy Simulation</h3>
          <p className="text-slate-300 text-sm">Sound privacy simulation active</p>
          <Button size="sm" variant="outline" onClick={() => disableFeature('showSoundPrivacySimulation')} className="mt-2">Close</Button>
        </div>
      )}
      {featureStates.showSunlightAnalysis && sceneRef.current && engineRef.current && (
        <Card className="fixed top-1/2 left-4 z-50 w-80 bg-slate-800 border-slate-600 text-white">
          <CardHeader>
            <CardTitle>Sunlight Analysis</CardTitle>
            <Button size="sm" variant="outline" onClick={() => disableFeature('showSunlightAnalysis')}>Close</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label>Light Intensity</Label>
            <Slider value={[lightIntensity]} onValueChange={(v: [number, number]) => setLightIntensity(v[0])} max={3} step={0.1} />
            <Button onClick={() => {
              const light = sceneRef.current.getLightByName('light');
              if (light) light.intensity = lightIntensity;
              console.log('Sunlight updated:', lightIntensity);
            }}>Update</Button>
          </CardContent>
        </Card>
      )}
      {featureStates.showSustainabilityCompliancePanel && sceneRef.current && (
        <div className="fixed top-1/2 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h3 className="text-white mb-2">Sustainability Compliance</h3>
          <p className="text-slate-300 text-sm">Sustainability compliance active</p>
          <Button size="sm" variant="outline" onClick={() => disableFeature('showSustainabilityCompliancePanel')} className="mt-2">Close</Button>
        </div>
      )}
      {featureStates.showWindTunnelSimulation && sceneRef.current && engineRef.current && (
        <Card className="fixed top-4 right-4 z-50 w-80 bg-slate-800 border-slate-600 text-white">
          <CardHeader>
            <CardTitle>Wind Tunnel Simulation</CardTitle>
            <Button size="sm" variant="outline" onClick={() => disableFeature('showWindTunnelSimulation')}>Close</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label>Particle Intensity</Label>
            <Slider value={[particleIntensity]} onValueChange={(v: [number, number]) => setParticleIntensity(v[0])} max={3000} step={100} />
            <Button onClick={() => {
              const ps = sceneRef.current.particleSystems.find((p: any) => p.name === 'windParticles');
              if (ps) ps.emitRate = particleIntensity;
              console.log('Wind updated:', particleIntensity);
            }}>Update</Button>
          </CardContent>
        </Card>
      )}
    </>
  );
};

// Additional sub-segment components for CustomPanels
const AdvancedFeaturesSegment: React.FC<Pick<CustomPanelsSegmentProps, 'featureStates' | 'sceneRef' | 'disableFeature'>> = ({
  featureStates, sceneRef, disableFeature
}) => (
  <>
    {featureStates.showPHashIntegration && sceneRef.current && (
      <div className="fixed top-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">PHash Integration</h3>
        <p className="text-slate-300 text-sm">Perceptual hash integration active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showPHashIntegration')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showProgressiveLoader && sceneRef.current && (
      <div className="fixed top-4 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Progressive Loader</h3>
        <p className="text-slate-300 text-sm">Progressive loading active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showProgressiveLoader')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showPresentationManager && sceneRef.current && (
      <div className="fixed bottom-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Presentation Manager</h3>
        <p className="text-slate-300 text-sm">Presentation management active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showPresentationManager')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showPresenterMode && sceneRef.current && (
      <div className="fixed bottom-4 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Presenter Mode</h3>
        <p className="text-slate-300 text-sm">Presenter mode active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showPresenterMode')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showQuantumSimulationInterface && sceneRef.current && (
      <div className="fixed top-1/2 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Quantum Simulation Interface</h3>
        <p className="text-slate-300 text-sm">Quantum simulation active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showQuantumSimulationInterface')} className="mt-2">Close</Button>
      </div>
    )}
  </>
);

const AdditionalSimulationSegment: React.FC<Pick<CustomPanelsSegmentProps, 'featureStates' | 'sceneRef' | 'engineRef' | 'disableFeature'>> = ({
  featureStates, sceneRef, engineRef, disableFeature
}) => (
  <>
    {featureStates.showWeather && sceneRef.current && (
      <div className="fixed top-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Weather Simulation</h3>
        <p className="text-slate-300 text-sm">Weather simulation active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showWeather')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showWind && sceneRef.current && engineRef.current && (
      <div className="fixed top-4 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Wind Simulation</h3>
        <p className="text-slate-300 text-sm">Wind simulation active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showWind')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showNoise && sceneRef.current && engineRef.current && (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Noise Simulation</h3>
        <p className="text-slate-300 text-sm">Noise simulation active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showNoise')} className="mt-2">Close</Button>
      </div>
    )}
  </>
);

const AIFeaturesSegment: React.FC<Pick<CustomPanelsSegmentProps, 'featureStates' | 'sceneRef' | 'aiManagerRef' | 'disableFeature'>> = ({
  featureStates, sceneRef, aiManagerRef, disableFeature
}) => (
  <>
    {featureStates.showAIAdvisor && sceneRef.current && aiManagerRef.current && (
      <div className="fixed top-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">AI Advisor</h3>
        <p className="text-slate-300 text-sm">AI advisor active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showAIAdvisor')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showVoiceAssistant && sceneRef.current && aiManagerRef.current && (
      <div className="fixed top-4 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Voice Assistant</h3>
        <p className="text-slate-300 text-sm">Voice assistant active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showVoiceAssistant')} className="mt-2">Close</Button>
      </div>
    )}
  </>
);

const AnalysisFeaturesSegment: React.FC<Pick<CustomPanelsSegmentProps, 'featureStates' | 'sceneRef' | 'bimManagerRef' | 'simulationManagerRef' | 'currentModelId' | 'disableFeature' | 'workspaceState'>> = ({
  featureStates, sceneRef, bimManagerRef, simulationManagerRef, currentModelId, disableFeature, workspaceState
}) => (
  <>
    {featureStates.showErgonomic && sceneRef.current && (
      <div className="fixed top-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Ergonomic Analysis</h3>
        <p className="text-slate-300 text-sm">Ergonomic analysis active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showErgonomic')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showEnergy && bimManagerRef.current && simulationManagerRef.current && (
      <EnergyDashboard
        bimManager={bimManagerRef.current}
        simulationManager={simulationManagerRef.current}
        modelId={String(currentModelId)}
      />
    )}
    {featureStates.showCost && sceneRef.current && (
      <Suspense fallback={<div>Loading Cost Estimator...</div>}>
        <CostEstimatorWrapper scene={sceneRef.current} selectedMesh={workspaceState.selectedMesh} />
      </Suspense>
    )}
    {featureStates.showBeforeAfter && sceneRef.current && (
      <div className="fixed bottom-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Before/After Comparison</h3>
        <p className="text-slate-300 text-sm">Before/after comparison active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showBeforeAfter')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showComparativeTour && sceneRef.current && (
      <div className="fixed bottom-4 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Comparative Tour</h3>
        <p className="text-slate-300 text-sm">Comparative tour active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showComparativeTour')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showROICalculator && sceneRef.current && (
      <div className="fixed top-1/2 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">ROI Calculator</h3>
        <p className="text-slate-300 text-sm">ROI calculation active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showROICalculator')} className="mt-2">Close</Button>
      </div>
    )}
  </>
);

const CollaborationFeaturesSegment: React.FC<Pick<CustomPanelsSegmentProps, 'featureStates' | 'sceneRef' | 'disableFeature'>> = ({
  featureStates, sceneRef, disableFeature
}) => (
  <>
    {featureStates.showMultiUser && sceneRef.current && (
      <div className="fixed top-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Multi-User Collaboration</h3>
        <p className="text-slate-300 text-sm">Multi-user collaboration active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showMultiUser')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showChat && sceneRef.current && (
      <div className="fixed top-4 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Chat</h3>
        <p className="text-slate-300 text-sm">Chat active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showChat')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showSharing && sceneRef.current && (
      <div className="fixed bottom-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Sharing</h3>
        <p className="text-slate-300 text-sm">Sharing active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showSharing')} className="mt-2">Close</Button>
      </div>
    )}
  </>
);

const ImmersiveFeaturesSegment: React.FC<Pick<CustomPanelsSegmentProps, 'featureStates' | 'sceneRef' | 'disableFeature'>> = ({
  featureStates, sceneRef, disableFeature
}) => (
  <>
    {featureStates.showVR && sceneRef.current && (
      <div className="fixed top-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">VR Mode</h3>
        <p className="text-slate-300 text-sm">VR mode active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showVR')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showAR && sceneRef.current && (
      <div className="fixed top-4 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">AR Mode</h3>
        <p className="text-slate-300 text-sm">AR mode active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showAR')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showSpatialAudio && sceneRef.current && (
      <div className="fixed bottom-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Spatial Audio</h3>
        <p className="text-slate-300 text-sm">Spatial audio active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showSpatialAudio')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showHaptic && sceneRef.current && (
      <div className="fixed bottom-4 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Haptic Feedback</h3>
        <p className="text-slate-300 text-sm">Haptic feedback active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showHaptic')} className="mt-2">Close</Button>
      </div>
    )}
  </>
);

const GeoFeaturesSegment: React.FC<Pick<CustomPanelsSegmentProps, 'featureStates' | 'sceneRef' | 'disableFeature'>> = ({
  featureStates, sceneRef, disableFeature
}) => (
  <>
    {featureStates.showGeoLocation && sceneRef.current && (
      <Suspense fallback={<div>Loading Geo Location...</div>}>
        <GeoLocationContext scene={sceneRef.current} />
      </Suspense>
    )}
    {featureStates.showGeoWorkspaceArea && sceneRef.current && (
      <div className="fixed top-4 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Geo Workspace Area</h3>
        <p className="text-slate-300 text-sm">Geo workspace area active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showGeoWorkspaceArea')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showGeoSync && sceneRef.current && (
      <div className="fixed bottom-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Geo Sync</h3>
        <p className="text-slate-300 text-sm">Geo sync active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showGeoSync')} className="mt-2">Close</Button>
      </div>
    )}
  </>
);

const SpecializedComponentsSegment: React.FC<Pick<CustomPanelsSegmentProps, 'featureStates' | 'sceneRef' | 'cameraRef' | 'engineRef' | 'simulationManagerRef' | 'disableFeature'>> = ({
  featureStates, sceneRef, cameraRef, engineRef, simulationManagerRef, disableFeature
}) => (
  <>
    {featureStates.showCameraViews && sceneRef.current && cameraRef.current && (
      <Suspense fallback={<div>Loading Camera Views...</div>}>
        <CameraViews scene={sceneRef.current} camera={cameraRef.current} />
      </Suspense>
    )}
    {featureStates.showCirculationFlowSimulation && sceneRef.current && engineRef.current && (
      <Suspense fallback={<div>Loading Circulation Flow...</div>}>
        <CirculationFlowSimulation scene={sceneRef.current} engine={engineRef.current} isActive={featureStates.showCirculationFlowSimulation} />
      </Suspense>
    )}
    {featureStates.showCollabManager && sceneRef.current && (
      <div className="fixed top-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600">
        <h3 className="text-white mb-2">Collaboration Manager</h3>
        <p className="text-slate-300 text-sm">Collaboration manager active</p>
        <Button size="sm" variant="outline" onClick={() => disableFeature('showCollabManager')} className="mt-2">Close</Button>
      </div>
    )}
    {featureStates.showComprehensiveSimulation && sceneRef.current && (
      <Suspense fallback={<div>Loading Comprehensive Simulation...</div>}>
        <ComprehensiveSimulation scene={sceneRef.current} isActive={featureStates.showComprehensiveSimulation} />
      </Suspense>
    )}
    {featureStates.showConstructionOverlay && sceneRef.current && (
      <Suspense fallback={<div>Loading Construction Overlay...</div>}>
        <ConstructionOverlay scene={sceneRef.current} />
      </Suspense>
    )}
    {featureStates.showFloodSimulation && sceneRef.current && (
      <Suspense fallback={<div>Loading Flood Simulation...</div>}>
      <FloodSimulation
        scene={sceneRef.current}
        isActive={featureStates.showFloodSimulation}
        onClose={() => disableFeature('showFloodSimulation')}
      />
      </Suspense>
    )}
    {featureStates.showShadowImpactAnalysis && sceneRef.current && engineRef.current && (
      <Suspense fallback={<div>Loading Shadow Impact...</div>}>
        <ShadowImpactAnalysis scene={sceneRef.current} engine={engineRef.current} />
      </Suspense>
    )}
    {featureStates.showTrafficParkingSimulation && sceneRef.current && simulationManagerRef.current && (
      <Suspense fallback={<div>Loading Traffic Parking...</div>}>
        <TrafficParkingSimulation simulationManager={simulationManagerRef.current} />
      </Suspense>
    )}
  </>
);

// Props interfaces for render functions
interface RenderLeftPanelProps {
  featureCategories: Record<string, any[]>;
  categoryPanelVisible: Record<string, boolean>;
  searchTerm: string;
  activeFeatures: Set<string>;
  layoutMode: 'standard' | 'compact' | 'immersive' | 'split';
  onCategoryToggle: (category: string) => void;
  setSearchTerm: (term: string) => void;
  handleFeatureToggle: (featureId: string | number, enabled: boolean) => void;
  handleCategoryToggle: (category: string) => void;
  updateState: (updates: any) => void;
  aiManagerRef?: React.RefObject<any>;
  bimManagerRef?: React.RefObject<any>;
}

interface RenderTopBarProps {
  fps: number;
  realTimeEnabled: boolean;
  activeFeatures: Set<string>;
  cameraMode: 'orbit' | 'fly' | 'walk' | undefined;
  gridVisible: boolean;
  wireframeEnabled: boolean;
  statsVisible: boolean;
  handleToggleRealTime: () => void;
  handleCameraModeChange: (mode: 'orbit' | 'fly' | 'walk' | undefined) => void;
  handleToggleGrid: () => void;
  handleToggleWireframe: () => void;
  handleToggleStats: () => void;
}

interface RenderRightPanelProps {
  workspaceState: { rightPanelVisible: boolean; selectedMesh: any };
  updateState: (updates: any) => void;
  bimManagerRef: React.RefObject<any>;
  simulationManagerRef: React.RefObject<any>;
  currentModelId: string;
}

interface RenderBottomPanelProps {
  workspaceState: { bottomPanelVisible: boolean };
  activeFeatures: Set<string>;
  performanceMode: 'low' | 'medium' | 'high';
  selectedMesh: any;
  handleFeatureToggle: (featureId: string | number, enabled: boolean) => void;
  setPerformanceMode: (mode: 'low' | 'medium' | 'high') => void;
  handleTourSequenceCreate: (sequence: any) => void;
  handleTourSequencePlay: (sequenceId: string) => void;
}

interface RenderFloatingToolbarProps {
  workspaceState: { showFloatingToolbar: boolean; moveActive: boolean; rotateActive: boolean; scaleActive: boolean; cameraActive: boolean; perspectiveActive: boolean };
  updateState: (updates: any) => void;
}

interface RenderCustomPanelsProps {
  featureStates: Record<string, boolean>;
  sceneRef: React.RefObject<any>;
  engineRef: React.RefObject<any>;
  cameraRef: React.RefObject<any>;
  bimManagerRef: React.RefObject<any>;
  simulationManagerRef: React.RefObject<any>;
  aiManagerRef: React.RefObject<any>;
  currentModelId: string;
  workspaces: any[];
  selectedWorkspaceId: string;
  handleWorkspaceSelect: (id: string) => void;
  handleMaterialApplied: (mesh: any, material: any) => void;
  handleAnimationCreate: (sequence: any) => void;
  handleSequencePlay: (sequenceId: string, options?: any) => void;
  handleTourSequenceCreate: (sequence: any) => void;
  handleTourSequencePlay: (sequenceId: string) => void;
  disableFeature: (id: string) => void;
  workspaceState: { selectedMesh: any };
}

// Render functions
export const renderLeftPanel = (props: RenderLeftPanelProps) => (
  <React.Suspense fallback={<div className="p-4">Loading Left Panel...</div>}>
    <ControlPanel
      featuresByCategory={props.featureCategories}
      activeFeatures={props.activeFeatures}
      onToggle={props.handleFeatureToggle}
      layoutMode={props.layoutMode === 'split' ? 'standard' : props.layoutMode}
    />
  </React.Suspense>
);

export const renderTopBar = (props: RenderTopBarProps) => (
  <React.Suspense fallback={<div className="p-2">Loading Top Bar...</div>}>
    <TopBar
      isGenerating={false}
      generationProgress={0}
      onToggleRealTime={props.handleToggleRealTime}
      realTimeEnabled={props.realTimeEnabled}
      fps={props.fps.toString()}
      activeFeatures={props.activeFeatures.size.toString()}
      cameraMode={props.cameraMode}
      onCameraModeChange={props.handleCameraModeChange}
      onToggleGrid={props.handleToggleGrid}
      gridVisible={props.gridVisible}
      onToggleWireframe={props.handleToggleWireframe}
      wireframeEnabled={props.wireframeEnabled}
      onToggleStats={props.handleToggleStats}
      statsVisible={props.statsVisible}
    />
  </React.Suspense>
);

export const renderRightPanel = (props: RenderRightPanelProps) => {
  if (!props.workspaceState.rightPanelVisible) return null;
  return (
    <div className="w-80 border-l border-gray-700 bg-gray-900 text-white">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Inspector</h2>
        <Button size="sm" variant="ghost" aria-label="Close Right Panel" onClick={() => props.updateState({ rightPanelVisible: false })}>
          <Maximize className="w-4 h-4" />
        </Button>
      </div>
      <Tabs defaultValue="properties" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>
        <TabsContent value="properties" className="p-4">
          <Card>
            <CardHeader>
              <CardTitle>Object Properties</CardTitle>
            </CardHeader>
            <CardContent>
              {props.workspaceState.selectedMesh ? (
                <div className="space-y-2">
                  <div><strong>Name:</strong> {props.workspaceState.selectedMesh.name}</div>
                  <div><strong>Position:</strong> {props.workspaceState.selectedMesh.position.toString()}</div>
                  <div><strong>Rotation:</strong> {props.workspaceState.selectedMesh.rotation.toString()}</div>
                  <div><strong>Scale:</strong> {props.workspaceState.selectedMesh.scaling.toString()}</div>
                </div>
              ) : (
                <p className="text-muted-foreground">No object selected</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="features" className="p-4">
          <div className="text-muted-foreground">
            Feature management is handled through the left panel.
          </div>
        </TabsContent>
        <TabsContent value="energy" className="p-4">
          {props.bimManagerRef.current && props.simulationManagerRef.current && (
            <EnergyDashboard
              bimManager={props.bimManagerRef.current}
              simulationManager={props.simulationManagerRef.current}
              modelId={String(props.currentModelId)}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const renderBottomPanel = (props: RenderBottomPanelProps) => {
  if (!props.workspaceState.bottomPanelVisible) return null;
  return (
    <React.Suspense fallback={<div className="p-2">Loading Bottom Panel...</div>}>
      <BottomPanel
        activeFeatures={Array.from(props.activeFeatures)}
        performanceMode={props.performanceMode}
        selectedMesh={props.selectedMesh}
        onFeatureToggle={(featureId: string) => props.handleFeatureToggle(featureId, true)}
        onPerformanceModeChange={props.setPerformanceMode}
        featureStats={{ total: 0, active: 0, byCategory: {}, byStatus: {} }}
        warnings={[]}
        suggestions={[]}
        onSequenceCreate={props.handleTourSequenceCreate}
        onSequencePlay={props.handleTourSequencePlay}
      />
    </React.Suspense>
  );
};

export const renderFloatingToolbar = (props: RenderFloatingToolbarProps) => {
  if (!props.workspaceState.showFloatingToolbar) return null;
  return (
    <React.Suspense fallback={<div className="p-2">Loading Toolbar...</div>}>
      <div className="fixed top-24 left-6 z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-3">
        <FloatingToolbar
          onMoveToggle={() => props.updateState({ moveActive: !props.workspaceState.moveActive })}
          onRotateToggle={() => props.updateState({ rotateActive: !props.workspaceState.rotateActive })}
          onScaleToggle={() => props.updateState({ scaleActive: !props.workspaceState.scaleActive })}
          onCameraToggle={() => props.updateState({ cameraActive: !props.workspaceState.cameraActive })}
          onPerspectiveToggle={() => props.updateState({ perspectiveActive: !props.workspaceState.perspectiveActive })}
          isMoveActive={props.workspaceState.moveActive}
          isRotateActive={props.workspaceState.rotateActive}
          isScaleActive={props.workspaceState.scaleActive}
          isCameraActive={props.workspaceState.cameraActive}
          isPerspectiveActive={props.workspaceState.perspectiveActive}
        />
      </div>
    </React.Suspense>
  );
};

export const renderCustomPanels = (props: RenderCustomPanelsProps) => (
  <CustomPanelsSegment {...props} />
);
