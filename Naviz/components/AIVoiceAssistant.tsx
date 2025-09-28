import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  XCircle,
  Brain,
  Zap,
  Loader2
} from 'lucide-react';
import { Scene, Mesh, Vector3, Material, PBRMaterial, StandardMaterial, Color3, HighlightLayer } from '@babylonjs/core';

// Type declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

interface VoiceCommand {
  id: string;
  command: string;
  action: string;
  parameters?: Record<string, any>;
  confidence: number;
  timestamp: Date;
}

interface VoiceSettings {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  sensitivity: number;
}

interface AIVoiceAssistantProps {
  scene: Scene;
  isActive: boolean;
  onClose: () => void;
  onCommandExecute?: (command: VoiceCommand) => void;
  onSceneUpdate?: (action: string, parameters?: any) => void;
}

const AIVoiceAssistant: React.FC<AIVoiceAssistantProps> = ({
  scene,
  isActive,
  onClose,
  onCommandExecute,
  onSceneUpdate
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [settings, setSettings] = useState<VoiceSettings>({
    language: 'en-US',
    continuous: true,
    interimResults: true,
    sensitivity: 0.5
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      if (recognitionRef.current) {
        recognitionRef.current.continuous = settings.continuous;
        recognitionRef.current.interimResults = settings.interimResults;
        recognitionRef.current.lang = settings.language;

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setIsProcessing(false);
        };

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          setTranscript(prev => prev + finalTranscript);
          setInterimTranscript(interimTranscript);

          if (finalTranscript) {
            processVoiceCommand(finalTranscript.trim());
          }
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          setIsProcessing(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          setIsProcessing(false);
          if (settings.continuous && !isMuted) {
            // Restart recognition if continuous mode is enabled
            setTimeout(() => {
              if (recognitionRef.current && !isMuted) {
                recognitionRef.current.start();
              }
            }, 1000);
          }
        };
      }
    }

    // Initialize speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [settings, isMuted]);

  const processVoiceCommand = useCallback(async (command: string) => {
    setIsProcessing(true);

    try {
      // Parse and execute the voice command
      const parsedCommand = await parseVoiceCommand(command);
      if (parsedCommand) {
        setCommands(prev => [parsedCommand, ...prev.slice(0, 9)]); // Keep last 10 commands

        if (onCommandExecute) {
          onCommandExecute(parsedCommand);
        }

        // Execute the command
        await executeVoiceCommand(parsedCommand);

        // Provide audio feedback
        if (!isMuted && synthRef.current) {
          speakResponse(`Command executed: ${parsedCommand.action}`);
        }
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [onCommandExecute, isMuted]);

  const parseVoiceCommand = useCallback(async (command: string): Promise<VoiceCommand | null> => {
    const lowerCommand = command.toLowerCase();

    // Define command patterns and their corresponding actions
    const commandPatterns = [
      {
        patterns: ['select', 'choose', 'pick'],
        action: 'select_mesh',
        parse: (cmd: string) => {
          const meshMatch = cmd.match(/(?:select|choose|pick)\s+(.+)/);
          if (meshMatch) {
            const meshName = meshMatch[1].trim();
            return { meshName };
          }
          return null;
        }
      },
      {
        patterns: ['highlight', 'show', 'focus'],
        action: 'highlight_mesh',
        parse: (cmd: string) => {
          const meshMatch = cmd.match(/(?:highlight|show|focus)\s+(.+)/);
          if (meshMatch) {
            const meshName = meshMatch[1].trim();
            return { meshName };
          }
          return null;
        }
      },
      {
        patterns: ['move', 'translate', 'position'],
        action: 'move_mesh',
        parse: (cmd: string) => {
          const moveMatch = cmd.match(/(?:move|translate|position)\s+(.+)\s+(?:to|by)\s+(.+)/);
          if (moveMatch) {
            const meshName = moveMatch[1].trim();
            const position = moveMatch[2].trim();
            return { meshName, position };
          }
          return null;
        }
      },
      {
        patterns: ['rotate', 'turn', 'spin'],
        action: 'rotate_mesh',
        parse: (cmd: string) => {
          const rotateMatch = cmd.match(/(?:rotate|turn|spin)\s+(.+)\s+(?:by|to)\s+(.+)/);
          if (rotateMatch) {
            const meshName = rotateMatch[1].trim();
            const rotation = rotateMatch[2].trim();
            return { meshName, rotation };
          }
          return null;
        }
      },
      {
        patterns: ['scale', 'resize', 'size'],
        action: 'scale_mesh',
        parse: (cmd: string) => {
          const scaleMatch = cmd.match(/(?:scale|resize|size)\s+(.+)\s+(?:to|by)\s+(.+)/);
          if (scaleMatch) {
            const meshName = scaleMatch[1].trim();
            const scale = scaleMatch[2].trim();
            return { meshName, scale };
          }
          return null;
        }
      },
      {
        patterns: ['create', 'add', 'new'],
        action: 'create_primitive',
        parse: (cmd: string) => {
          const createMatch = cmd.match(/(?:create|add|new)\s+(box|cylinder|sphere|plane|ground)\s*(?:called|named)?\s*(.+)?/);
          if (createMatch) {
            const shape = createMatch[1];
            const name = createMatch[2]?.trim() || `${shape}_${Date.now()}`;
            return { shape, name };
          }
          return null;
        }
      },
      {
        patterns: ['delete', 'remove', 'destroy'],
        action: 'delete_mesh',
        parse: (cmd: string) => {
          const deleteMatch = cmd.match(/(?:delete|remove|destroy)\s+(.+)/);
          if (deleteMatch) {
            const meshName = deleteMatch[1].trim();
            return { meshName };
          }
          return null;
        }
      },
      {
        patterns: ['camera', 'view', 'look'],
        action: 'camera_control',
        parse: (cmd: string) => {
          const cameraMatch = cmd.match(/(?:camera|view|look)\s+(?:to|at)\s+(.+)/);
          if (cameraMatch) {
            const target = cameraMatch[1].trim();
            return { target };
          }
          return null;
        }
      },
      {
        patterns: ['material', 'texture', 'color'],
        action: 'change_material',
        parse: (cmd: string) => {
          const materialMatch = cmd.match(/(?:material|texture|color)\s+(.+)\s+(?:to|set)\s+(.+)/);
          if (materialMatch) {
            const meshName = materialMatch[1].trim();
            const material = materialMatch[2].trim();
            return { meshName, material };
          }
          return null;
        }
      },
      {
        patterns: ['analysis', 'analyze', 'check'],
        action: 'run_analysis',
        parse: (cmd: string) => {
          return {};
        }
      },
      {
        patterns: ['help', 'commands', 'what can you do'],
        action: 'show_help',
        parse: (cmd: string) => {
          return {};
        }
      }
    ];

    // Find matching command pattern
    for (const commandPattern of commandPatterns) {
      for (const pattern of commandPattern.patterns) {
        if (lowerCommand.includes(pattern)) {
          const parameters = commandPattern.parse(command);
          if (parameters) {
            return {
              id: `cmd_${Date.now()}`,
              command: command,
              action: commandPattern.action,
              parameters,
              confidence: 0.9,
              timestamp: new Date()
            };
          }
        }
      }
    }

    // If no pattern matches, try AI interpretation
    return await interpretWithAI(command);
  }, []);

  const interpretWithAI = useCallback(async (command: string): Promise<VoiceCommand | null> => {
    // Simple AI interpretation based on keywords
    const lowerCommand = command.toLowerCase();

    // Basic interpretations
    if (lowerCommand.includes('hello') || lowerCommand.includes('hi')) {
      return {
        id: `cmd_${Date.now()}`,
        command: command,
        action: 'greet',
        parameters: {},
        confidence: 0.8,
        timestamp: new Date()
      };
    }

    if (lowerCommand.includes('status') || lowerCommand.includes('info')) {
      return {
        id: `cmd_${Date.now()}`,
        command: command,
        action: 'show_status',
        parameters: {},
        confidence: 0.7,
        timestamp: new Date()
      };
    }

    // If still no match, return null
    return null;
  }, []);

  const executeVoiceCommand = useCallback(async (command: VoiceCommand) => {
    if (!scene) return;

    switch (command.action) {
      case 'select_mesh':
        if (command.parameters?.meshName) {
          const mesh = scene.getMeshByName(command.parameters.meshName);
          if (mesh && mesh instanceof Mesh) {
            // Create highlight layer if it doesn't exist
            let highlightLayer = scene.getHighlightLayerByName('voice-highlight');
            if (!highlightLayer) {
              highlightLayer = new HighlightLayer('voice-highlight', scene);
            }

            highlightLayer.addMesh(mesh, new Color3(0, 1, 0)); // Green highlight
            setTimeout(() => {
              highlightLayer.removeMesh(mesh);
            }, 5000);

            if (onSceneUpdate) {
              onSceneUpdate('select_mesh', { meshName: command.parameters.meshName });
            }
          }
        }
        break;

      case 'highlight_mesh':
        if (command.parameters?.meshName) {
          const mesh = scene.getMeshByName(command.parameters.meshName);
          if (mesh && mesh instanceof Mesh) {
            let highlightLayer = scene.getHighlightLayerByName('voice-highlight');
            if (!highlightLayer) {
              highlightLayer = new HighlightLayer('voice-highlight', scene);
            }

            highlightLayer.addMesh(mesh, new Color3(1, 1, 0)); // Yellow highlight
            setTimeout(() => {
              highlightLayer.removeMesh(mesh);
            }, 5000);

            if (onSceneUpdate) {
              onSceneUpdate('highlight_mesh', { meshName: command.parameters.meshName });
            }
          }
        }
        break;

      case 'create_primitive':
        if (command.parameters?.shape && command.parameters?.name) {
          await createPrimitive(command.parameters.shape, command.parameters.name);
          if (onSceneUpdate) {
            onSceneUpdate('create_primitive', command.parameters);
          }
        }
        break;

      case 'delete_mesh':
        if (command.parameters?.meshName) {
          const mesh = scene.getMeshByName(command.parameters.meshName);
          if (mesh) {
            mesh.dispose();
            if (onSceneUpdate) {
              onSceneUpdate('delete_mesh', { meshName: command.parameters.meshName });
            }
          }
        }
        break;

      case 'run_analysis':
        if (onSceneUpdate) {
          onSceneUpdate('run_analysis', {});
        }
        break;

      case 'show_help':
        showHelp();
        break;

      case 'greet':
        speakResponse("Hello! I'm your AI voice assistant. How can I help you with your 3D scene today?");
        break;

      case 'show_status':
        const meshCount = scene.meshes.length;
        const cameraPos = scene.activeCamera?.position;
        speakResponse(`Current scene status: ${meshCount} meshes loaded. Camera position: ${cameraPos ? `x:${cameraPos.x.toFixed(1)}, y:${cameraPos.y.toFixed(1)}, z:${cameraPos.z.toFixed(1)}` : 'unknown'}`);
        break;
    }
  }, [scene, onSceneUpdate]);

  const createPrimitive = useCallback(async (shape: string, name: string) => {
    if (!scene) return;

    try {
      let mesh: Mesh;

      switch (shape.toLowerCase()) {
        case 'box':
          mesh = Mesh.CreateBox(name, 1, scene);
          break;
        case 'sphere':
          mesh = Mesh.CreateSphere(name, 16, 1, scene);
          break;
        case 'cylinder':
          mesh = Mesh.CreateCylinder(name, 2, 1, 1, 12, 1, scene);
          break;
        case 'plane':
          mesh = Mesh.CreatePlane(name, 2, scene);
          break;
        case 'ground':
          mesh = Mesh.CreateGround(name, 10, 10, 2, scene);
          break;
        default:
          throw new Error(`Unknown shape: ${shape}`);
      }

      // Position the mesh randomly
      mesh.position = new Vector3(
        (Math.random() - 0.5) * 10,
        Math.random() * 5,
        (Math.random() - 0.5) * 10
      );

      // Add a basic material
      const material = new StandardMaterial(`${name}_material`, scene);
      material.diffuseColor = new Color3(
        Math.random(),
        Math.random(),
        Math.random()
      );
      mesh.material = material;

      speakResponse(`Created ${shape} named ${name}`);
    } catch (error) {
      console.error('Error creating primitive:', error);
      speakResponse(`Sorry, I couldn't create the ${shape}`);
    }
  }, [scene]);

  const showHelp = useCallback(() => {
    const helpText = `
      Available voice commands:
      • Select/highlight [mesh name] - Select or highlight a mesh
      • Create [box/sphere/cylinder/plane/ground] [name] - Create a primitive shape
      • Delete [mesh name] - Remove a mesh
      • Move/rotate/scale [mesh name] - Transform objects
      • Camera to [target] - Control camera view
      • Run analysis - Start structural analysis
      • Status - Show scene information
      • Help - Show this help message
    `;

    speakResponse(helpText);
  }, []);

  const speakResponse = useCallback((text: string) => {
    if (!isMuted && synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      synthRef.current.speak(utterance);
    }
  }, [isMuted]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  if (!isActive) return null;

  return (
    <div className="fixed top-4 left-4 w-96 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50">
      <Card className="bg-slate-900 border-slate-700 text-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              AI Voice Assistant
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={isMuted ? "destructive" : "outline"}
                onClick={toggleMute}
                className="text-xs"
              >
                {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              </Button>
              <Button size="sm" variant="ghost" onClick={onClose}>
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Voice Controls */}
          <div className="flex items-center gap-2">
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className="flex-1"
              size="sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : isListening ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Start Listening
                </>
              )}
            </Button>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-slate-400">
              {isListening ? 'Listening...' : 'Ready'}
            </span>
            {isProcessing && (
              <>
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-yellow-400">Processing...</span>
              </>
            )}
          </div>

          {/* Transcript Display */}
          {(transcript || interimTranscript) && (
            <div className="p-3 bg-slate-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Transcript:</span>
                <Button size="sm" variant="ghost" onClick={clearTranscript} className="text-xs h-6">
                  Clear
                </Button>
              </div>
              <ScrollArea className="h-20">
                <p className="text-sm">
                  {transcript}
                  {interimTranscript && (
                    <span className="text-slate-400 italic">{interimTranscript}</span>
                  )}
                </p>
              </ScrollArea>
            </div>
          )}

          {/* Command History */}
          {commands.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Recent Commands</span>
                <Badge variant="outline" className="text-xs">
                  {commands.length}
                </Badge>
              </div>
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {commands.map((cmd) => (
                    <Alert key={cmd.id} className="p-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {cmd.action}
                            </Badge>
                            <span className="text-xs text-slate-400">
                              {Math.round(cmd.confidence * 100)}%
                            </span>
                          </div>
                          <AlertDescription className="text-xs">
                            "{cmd.command}"
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Quick Commands */}
          <div className="space-y-2">
            <span className="text-sm font-medium">Quick Commands:</span>
            <div className="grid grid-cols-2 gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => processVoiceCommand("create box test_box")}
                className="text-xs"
              >
                Create Box
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => processVoiceCommand("run analysis")}
                className="text-xs"
              >
                Run Analysis
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => processVoiceCommand("status")}
                className="text-xs"
              >
                Show Status
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => processVoiceCommand("help")}
                className="text-xs"
              >
                Help
              </Button>
            </div>
          </div>

          {/* Settings */}
          <div className="pt-2 border-t border-slate-700">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {/* TODO: Open settings modal */}}
              className="text-xs"
            >
              <Settings className="w-3 h-3 mr-1" />
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIVoiceAssistant;
