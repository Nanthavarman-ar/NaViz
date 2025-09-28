import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Loader2, Star, AlertTriangle } from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  enabled: boolean;
  hotkey?: string;
  description: string;
  performanceImpact?: number;
  dependencies?: string[];
  isEssential?: boolean;
}

interface FeatureButtonProps {
  feature: Feature;
  isActive: boolean;
  isLoading?: boolean;
  showPerformance?: boolean;
  onToggle: (featureId: string, enabled: boolean) => void;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'grid' | 'list' | 'compact';
}

const FeatureButton: React.FC<FeatureButtonProps> = ({
  feature,
  isActive,
  isLoading = false,
  showPerformance = false,
  onToggle,
  size = 'sm',
  variant = 'grid'
}) => {
  const getPerformanceColor = (impact: number) => {
    if (impact <= 2) return 'text-green-500';
    if (impact <= 5) return 'text-yellow-500';
    if (impact <= 8) return 'text-orange-500';
    return 'text-red-500';
  };

  const getPerformanceIcon = (impact: number) => {
    if (impact <= 2) return null;
    if (impact <= 5) return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
    if (impact <= 8) return <AlertTriangle className="w-3 h-3 text-orange-500" />;
    return <AlertTriangle className="w-3 h-3 text-red-500" />;
  };

  const buttonContent = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <Button
        variant={isActive ? "default" : "outline"}
        size={size}
        onClick={() => onToggle(feature.id, !isActive)}
        disabled={isLoading}
        className={`h-auto p-3 flex ${
          variant === 'grid' ? 'flex-col items-center space-y-1' :
          variant === 'list' ? 'flex-row items-center space-x-2 justify-start' :
          'flex-col items-center space-y-1'
        } relative ${
          isActive
            ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500'
            : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
        } ${variant === 'compact' ? 'p-2' : ''}`}
        aria-pressed={isActive}
        aria-label={`${feature.name}: ${feature.description}`}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <feature.icon className={`w-4 h-4 ${variant === 'list' ? '' : ''}`} />
        )}

        <span className={`text-center leading-tight ${
          variant === 'grid' ? 'text-xs' :
          variant === 'list' ? 'text-sm flex-1 text-left' :
          'text-xs'
        }`}>
          {feature.name}
        </span>

        {/* Essential indicator */}
        {feature.isEssential && (
          <Star className="w-3 h-3 text-yellow-500 absolute top-1 right-1" />
        )}

        {/* Performance impact indicator */}
        {showPerformance && feature.performanceImpact && feature.performanceImpact > 0 && (
          <div className="absolute bottom-1 right-1 flex items-center space-x-1">
            {getPerformanceIcon(feature.performanceImpact)}
            <span className={`text-xs font-medium ${getPerformanceColor(feature.performanceImpact)}`}>
              {feature.performanceImpact}
            </span>
          </div>
        )}

        {/* Hotkey badge */}
        {feature.hotkey && variant !== 'compact' && (
          <Badge
            variant="outline"
            className="text-xs px-1 py-0 absolute bottom-1 left-1 bg-gray-900/80"
          >
            {feature.hotkey}
          </Badge>
        )}
      </Button>
    </motion.div>
  );

  if (variant === 'compact') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {buttonContent}
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <div>
              <div className="font-medium">{feature.name}</div>
              <div className="text-sm text-gray-300 mt-1">
                {feature.description}
              </div>
              {feature.hotkey && (
                <div className="text-xs text-gray-400 mt-1">
                  Hotkey: {feature.hotkey}
                </div>
              )}
              {feature.performanceImpact && (
                <div className="text-xs text-gray-400 mt-1">
                  Performance Impact: {feature.performanceImpact}/10
                </div>
              )}
              {feature.dependencies && feature.dependencies.length > 0 && (
                <div className="text-xs text-gray-400 mt-1">
                  Dependencies: {feature.dependencies.join(', ')}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return buttonContent;
};

export default FeatureButton;
