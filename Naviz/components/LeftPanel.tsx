import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Search, X, Filter, Grid3X3, List, Minimize2 } from 'lucide-react';
import FeatureButton from './FeatureButton';
import CategoryToggles from './CategoryToggles';

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

interface CategoryInfo {
  name: string;
  count: number;
  activeCount: number;
  color: string;
  priority: number;
  description?: string;
}

interface LeftPanelProps {
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

const LeftPanel: React.FC<LeftPanelProps> = ({
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
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [showPerformance, setShowPerformance] = useState(false);

  // Derive categories from featureCategories
  const categories = useMemo(() => {
    const categoryMap: Record<string, CategoryInfo> = {};

    Object.entries(featureCategories).forEach(([categoryKey, features]) => {
      const categoryFeatures = features as Feature[];
      const activeCount = categoryFeatures.filter(f => activeFeatures.has(f.id)).length;

      categoryMap[categoryKey] = {
        name: categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1),
        count: categoryFeatures.length,
        activeCount,
        color: getCategoryColor(categoryKey),
        priority: getCategoryPriority(categoryKey),
        description: getCategoryDescription(categoryKey)
      };
    });

    return categoryMap;
  }, [featureCategories, activeFeatures]);

  // Filter features based on search term and visible categories
  const filteredFeatures = useMemo(() => {
    const visibleCategories = Object.keys(categoryPanelVisible).filter(cat => categoryPanelVisible[cat]);
    let features: Feature[] = [];

    visibleCategories.forEach(category => {
      if (featureCategories[category]) {
        features.push(...(featureCategories[category] as Feature[]));
      }
    });

    if (localSearchTerm.trim()) {
      const searchLower = localSearchTerm.toLowerCase();
      features = features.filter(feature =>
        feature.name.toLowerCase().includes(searchLower) ||
        feature.description.toLowerCase().includes(searchLower) ||
        feature.category.toLowerCase().includes(searchLower)
      );
    }

    return features;
  }, [featureCategories, categoryPanelVisible, localSearchTerm]);

  // Get layout variant based on currentLayoutMode
  const getLayoutVariant = () => {
    switch (currentLayoutMode) {
      case 'compact':
        return 'list';
      case 'immersive':
        return 'compact';
      default:
        return 'grid';
    }
  };

  const variant = getLayoutVariant();

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    onSearchChange(value);
  };

  return (
    <motion.div
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -320, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-80 h-full bg-gray-900 border-r border-gray-700 flex flex-col text-white overflow-hidden"
    >
      {/* Header */}
      <CardHeader className="flex-shrink-0 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Features</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowPerformance(!showPerformance)}
              className="text-gray-400 hover:text-white"
              title="Toggle Performance Indicators"
            >
              <Filter className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
              title="Close Panel"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search features..."
            value={localSearchTerm}
            onChange={handleSearchChange}
            className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
        </div>
      </CardHeader>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Category Toggles */}
        <div className="p-4 border-b border-gray-700">
          <CategoryToggles
            categories={categories}
            visibleCategories={categoryPanelVisible}
            onCategoryToggle={onCategoryToggle}
            onToggleAll={(visible) => {
              const updates: Record<string, boolean> = {};
              Object.keys(categories).forEach(cat => {
                updates[cat] = visible;
              });
              // Note: This would need to be handled by parent component
              // For now, we'll toggle all categories
              Object.keys(categories).forEach(cat => onCategoryToggle(cat));
            }}
            onFilterByPriority={(priority) => {
              // Filter categories by priority - this could be implemented later
              console.log('Filter by priority:', priority);
            }}
            layout={currentLayoutMode === 'standard' ? 'expanded' : 'compact'}
          />
        </div>

        {/* Features Grid/List */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">
              Features ({filteredFeatures.length})
            </h3>
            <div className="flex items-center space-x-1">
              <Badge variant="outline" className="text-xs">
                {activeFeatures.size} active
              </Badge>
            </div>
          </div>

          <AnimatePresence>
            {filteredFeatures.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={
                  variant === 'grid'
                    ? 'grid grid-cols-2 gap-3'
                    : variant === 'list'
                    ? 'space-y-2'
                    : 'grid grid-cols-1 gap-2'
                }
              >
                {filteredFeatures.map((feature) => (
                  <FeatureButton
                    key={feature.id}
                    feature={feature}
                    isActive={activeFeatures.has(feature.id)}
                    showPerformance={showPerformance}
                    onToggle={(id, enabled) => onFeatureToggle(id, enabled)}
                    variant={variant}
                    size={variant === 'compact' ? 'sm' : 'default'}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-gray-400"
              >
                <div className="text-4xl mb-2">🔍</div>
                <p>No features found</p>
                <p className="text-sm">Try adjusting your search or category filters</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// Helper functions for category data
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    navigation: 'blue',
    simulation: 'green',
    ai: 'purple',
    analysis: 'orange',
    collaboration: 'pink',
    immersive: 'cyan',
    tools: 'teal',
    default: 'gray'
  };
  return colors[category.toLowerCase()] || colors.default;
};

const getCategoryPriority = (category: string): number => {
  const priorities: Record<string, number> = {
    navigation: 1,
    simulation: 2,
    ai: 3,
    analysis: 2,
    collaboration: 3,
    immersive: 1,
    tools: 2,
    default: 3
  };
  return priorities[category.toLowerCase()] || priorities.default;
};

const getCategoryDescription = (category: string): string => {
  const descriptions: Record<string, string> = {
    navigation: 'Camera and movement controls',
    simulation: 'Physics and environmental simulations',
    ai: 'Artificial intelligence features',
    analysis: 'Data analysis and visualization',
    collaboration: 'Multi-user and sharing tools',
    immersive: 'VR/AR and spatial experiences',
    tools: 'Utility and helper tools'
  };
  return descriptions[category.toLowerCase()] || '';
};

export default LeftPanel;
