import React, { useState, useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface AnimationKeyframe {
  time: number;
  position?: BABYLON.Vector3;
  rotation?: BABYLON.Vector3;
  scale?: BABYLON.Vector3;
  color?: BABYLON.Color3;
}

interface AnimationSequence {
  id: string;
  name: string;
  keyframes: AnimationKeyframe[];
  duration: number;
  loop: boolean;
}

interface TourKeyframe {
  time: number;
  position: BABYLON.Vector3;
}

interface TourSequence {
  id: string;
  name: string;
  keyframes: TourKeyframe[];
  duration: number;
  loop: boolean;
}

interface AnimationTimelineProps {
  animationManager: any; // AnimationManager instance
  selectedObject: BABYLON.AbstractMesh | null;
  onSequenceCreate: (sequence: AnimationSequence) => void;
  onSequencePlay: (sequenceId: string) => void;
}

export const AnimationTimeline: React.FC<AnimationTimelineProps> = ({
  animationManager,
  selectedObject,
  onSequenceCreate,
  onSequencePlay
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(120);
  const [sequences, setSequences] = useState<AnimationSequence[]>([]);
  const [selectedSequence, setSelectedSequence] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [keyframes, setKeyframes] = useState<AnimationKeyframe[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [weight, setWeight] = useState(1.0);

  // Tour mode states
  const [isTourMode, setIsTourMode] = useState(false);
  const [tourKeyframes, setTourKeyframes] = useState<TourKeyframe[]>([]);
  const [selectedTourSequence, setSelectedTourSequence] = useState<string>('');
  const [tourSequences, setTourSequences] = useState<TourSequence[]>([]);
  const [tourSpeed, setTourSpeed] = useState(1.0);

  // Add tour keyframe
  const addTourKeyframe = (position: BABYLON.Vector3) => {
    setTourKeyframes(prev => [...prev, { time: currentTime, position: position.clone() }].sort((a, b) => a.time - b.time));
  };

  // Remove tour keyframe
  const removeTourKeyframe = (idx: number) => {
    setTourKeyframes(prev => prev.filter((_, i) => i !== idx));
  };

  // Create tour sequence
  const createTourSequence = () => {
    if (tourKeyframes.length === 0) return;
    const sequence: TourSequence = {
      id: `tour_${Date.now()}`,
      name: `Tour ${tourSequences.length + 1}`,
      keyframes: tourKeyframes,
      duration: totalDuration,
      loop: false
    };
    setTourSequences(prev => [...prev, sequence]);
    setSelectedTourSequence(sequence.id);
    setTourKeyframes([]);
  };

  // Smooth camera interpolation for tour playback
  const playTourSequence = async (sequenceId: string) => {
    const sequence = tourSequences.find(s => s.id === sequenceId);
    if (!sequence || !selectedObject) return;
    setIsPlaying(true);
    for (let i = 0; i < sequence.keyframes.length - 1; i++) {
      const start = sequence.keyframes[i].position;
      const end = sequence.keyframes[i + 1].position;
      const duration = (sequence.keyframes[i + 1].time - sequence.keyframes[i].time) / tourSpeed;
      let t = 0;
      while (t < 1) {
        const interp = BABYLON.Vector3.Lerp(start, end, t);
        selectedObject.position.copyFrom(interp);
        t += 0.02;
        await new Promise(res => setTimeout(res, duration * 20));
      }
      selectedObject.position.copyFrom(end);
    }
    setIsPlaying(false);
  };

  // Export tour sequence to JSON
  const exportTourSequence = (sequenceId: string) => {
    const sequence = tourSequences.find(s => s.id === sequenceId);
    if (!sequence) return;
    const dataStr = JSON.stringify(sequence, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sequence.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import tour sequence from JSON
  const importTourSequence = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data && data.keyframes) {
          setTourSequences(prev => [...prev, data]);
        }
      } catch {}
    };
    reader.readAsText(file);
  };

  const animationTypes = [
    { value: 'bounce', label: 'Bounce' },
    { value: 'fade', label: 'Fade' },
    { value: 'scale', label: 'Scale' },
    { value: 'color', label: 'Color Transition' },
    { value: 'wave', label: 'Wave' },
    { value: 'spring', label: 'Spring' },
    { value: 'rotation', label: 'Rotation' }
  ];

  const addKeyframe = () => {
    if (!selectedObject) return;

    const newKeyframe: AnimationKeyframe = {
      time: currentTime,
      position: selectedObject.position.clone(),
      rotation: selectedObject.rotation.clone(),
      scale: selectedObject.scaling.clone()
    };

    setKeyframes(prev => [...prev, newKeyframe].sort((a, b) => a.time - b.time));
  };

  const createSequence = () => {
    if (keyframes.length === 0 || !animationManager) return;

    const sequence: AnimationSequence = {
      id: `seq_${Date.now()}`,
      name: `Sequence ${sequences.length + 1}`,
      keyframes: keyframes,
      duration: totalDuration,
      loop: false
    };

    setSequences(prev => [...prev, sequence]);
    setSelectedSequence(sequence.id);
    setKeyframes([]);
  };

  const quickAnimation = (type: string) => {
    if (!selectedObject || !animationManager) return;

    let presetName: string | undefined;

    switch (type) {
      case 'bounce':
        presetName = 'bounce';
        break;
      case 'fade':
        presetName = 'fade';
        break;
      case 'scale':
        presetName = 'scale';
        break;
      case 'color':
        presetName = 'colorcycle';
        break;
      case 'wave':
        presetName = 'wave';
        break;
      case 'spring':
        presetName = 'spring';
        break;
      case 'rotation':
        presetName = 'rotation';
        break;
    }

    if (presetName) {
      const animationGroup = animationManager.createAnimationFromPreset(presetName, selectedObject);
      if (animationGroup) {
        // Register the animation group with the manager
        const groupId = `quick_${presetName}_${Date.now()}`;
        animationManager.registerAnimationGroup({
          id: groupId,
          name: `${presetName} Animation`,
          animations: [], // The animation group already contains the animations
          targetMeshes: [selectedObject],
          speedRatio: 1.0,
          weight: 1.0,
          isLooping: false
        });
        animationManager.playAnimation(groupId);
      }
    }
  };

  const playSequence = (sequenceId: string) => {
    if (animationManager && sequenceId) {
      animationManager.playAnimation(sequenceId);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Animation Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timeline Controls */}
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            variant={isPlaying ? "destructive" : "default"}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>

          <Button onClick={() => setCurrentTime(0)} variant="outline">
            Reset
          </Button>

          <Button
            onClick={() => {
              setPreviewMode(!previewMode);
              if (animationManager) {
                animationManager.enableRealtimePreview(!previewMode);
              }
            }}
            variant={previewMode ? "default" : "outline"}
            size="sm"
          >
            {previewMode ? 'Preview ON' : 'Preview OFF'}
          </Button>

          <div className="flex-1">
            <Slider
              value={[currentTime]}
              onValueChange={(value) => {
                setCurrentTime(value[0]);
                if (animationManager && previewMode) {
                  // Scrub to time in real-time
                  animationManager.scrubToTime(selectedSequence, value[0]);
                }
              }}
              max={totalDuration}
              step={1}
              className="w-full"
            />
          </div>

          <span className="text-sm font-mono">
            {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}
          </span>
        </div>

        {/* Real-time Parameter Controls */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Speed: {speed.toFixed(1)}x</label>
            <Slider
              value={[speed]}
              onValueChange={(value) => {
                setSpeed(value[0]);
                if (animationManager && selectedSequence) {
                  animationManager.updateAnimationSpeed(selectedSequence, value[0]);
                }
              }}
              min={0.1}
              max={3.0}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Weight: {weight.toFixed(1)}</label>
            <Slider
              value={[weight]}
              onValueChange={(value) => {
                setWeight(value[0]);
                if (animationManager && selectedSequence) {
                  animationManager.updateAnimationWeight(selectedSequence, value[0]);
                }
              }}
              min={0.0}
              max={1.0}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Duration: {totalDuration}s</label>
            <Slider
              value={[totalDuration]}
              onValueChange={(value) => {
                setTotalDuration(value[0]);
                if (animationManager && selectedSequence) {
                  animationManager.updateAnimationDuration(selectedSequence, value[0]);
                }
              }}
              min={10}
              max={300}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        {/* Quick Animations */}
        <div className="grid grid-cols-4 gap-2">
          {animationTypes.map(type => (
            <Button
              key={type.value}
              onClick={() => quickAnimation(type.value)}
              variant="outline"
              size="sm"
              disabled={!selectedObject}
            >
              {type.label}
            </Button>
          ))}
        </div>

        {/* Keyframe Controls */}
        <div className="flex items-center space-x-2">
          <Button onClick={addKeyframe} disabled={!selectedObject} variant="outline">
            Add Keyframe
          </Button>
          <Button onClick={createSequence} disabled={keyframes.length === 0} variant="default">
            Create Sequence
          </Button>
        </div>

        {/* Keyframes Display */}
        <div className="border rounded p-2 min-h-[100px]">
          <h4 className="text-sm font-semibold mb-2">Keyframes:</h4>
          <div className="flex flex-wrap gap-1">
            {keyframes.map((kf, index) => (
              <div key={index} className="bg-blue-100 px-2 py-1 rounded text-xs">
                {kf.time}s
              </div>
            ))}
          </div>
        </div>

        {/* Sequences */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Sequences:</h4>
          {sequences.map(sequence => (
            <div key={sequence.id} className="flex items-center space-x-2">
              <Button
                onClick={() => setSelectedSequence(sequence.id)}
                variant={selectedSequence === sequence.id ? "default" : "outline"}
                size="sm"
                className="flex-1"
              >
                {sequence.name}
              </Button>
              <Button
                onClick={() => playSequence(sequence.id)}
                size="sm"
                variant="outline"
              >
                Play
              </Button>
            </div>
          ))}
        </div>

        {/* Tour Mode Controls */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Tour Composer</CardTitle>
            <Button onClick={() => setIsTourMode(!isTourMode)}>{isTourMode ? 'Exit Tour Mode' : 'Enter Tour Mode'}</Button>
          </CardHeader>
          <CardContent>
            {isTourMode && (
              <div className="space-y-2">
                <div className="flex gap-2 mb-2">
                  <Button size="sm" onClick={() => addTourKeyframe(selectedObject?.position || BABYLON.Vector3.Zero())}>Add Waypoint</Button>
                  <Button size="sm" onClick={createTourSequence} disabled={tourKeyframes.length === 0}>Create Tour Sequence</Button>
                  <Button size="sm" variant="outline" onClick={() => setTourKeyframes([])}>Clear Keyframes</Button>
                </div>
                <div className="flex gap-2 items-center mb-2">
                  <label className="text-xs">Speed:</label>
                  <Slider min={0.5} max={3} step={0.1} value={[tourSpeed]} onValueChange={arr => setTourSpeed(arr[0])} />
                  <span className="text-xs">{tourSpeed}x</span>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium">Keyframes</div>
                  <ul className="text-xs">
                    {tourKeyframes.map((kf, idx) => (
                      <li key={idx} className="flex gap-2 items-center">
                        <span>t={kf.time}s ({kf.position.x.toFixed(1)}, {kf.position.y.toFixed(1)}, {kf.position.z.toFixed(1)})</span>
                        <Button size="sm" variant="outline" onClick={() => removeTourKeyframe(idx)}>Remove</Button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium">Tour Sequences</div>
                  <ul className="text-xs">
                    {tourSequences.map(seq => (
                      <li key={seq.id} className="flex gap-2 items-center">
                        <span>{seq.name}</span>
                        <Button size="sm" variant="default" onClick={() => playTourSequence(seq.id)}>Play</Button>
                        <Button size="sm" variant="outline" onClick={() => exportTourSequence(seq.id)}>Export</Button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2 mt-2">
                    <label htmlFor="import-tour-file" className="sr-only">Import Tour</label>
                    <input id="import-tour-file" type="file" accept=".json" onChange={e => {
                      if (e.target.files && e.target.files[0]) importTourSequence(e.target.files[0]);
                    }} />
                    <span className="text-xs">Import Tour</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
