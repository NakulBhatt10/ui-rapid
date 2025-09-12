import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Layers, Users, Navigation, Thermometer } from 'lucide-react';

interface HeatmapToggleProps {
  showHeatmap: boolean;
  showPopulationDensity: boolean;
  showEvacuationRoutes: boolean;
  onToggleHeatmap: () => void;
  onTogglePopulationDensity: () => void;
  onToggleEvacuationRoutes: () => void;
}

export const HeatmapToggle: React.FC<HeatmapToggleProps> = ({
  showHeatmap,
  showPopulationDensity,
  showEvacuationRoutes,
  onToggleHeatmap,
  onTogglePopulationDensity,
  onToggleEvacuationRoutes,
}) => {
  const activeLayersCount = [showHeatmap, showPopulationDensity, showEvacuationRoutes].filter(Boolean).length;

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Map Layers</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            {activeLayersCount} active
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Thermometer className="h-4 w-4 text-destructive" />
              <div>
                <p className="text-sm font-medium text-foreground">Disaster Heatmap</p>
                <p className="text-xs text-muted-foreground">Intensity of reported cases</p>
              </div>
            </div>
            <Switch
              checked={showHeatmap}
              onCheckedChange={onToggleHeatmap}
              aria-label="Toggle disaster heatmap"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-foreground">Population Density</p>
                <p className="text-xs text-muted-foreground">Urban population distribution</p>
              </div>
            </div>
            <Switch
              checked={showPopulationDensity}
              onCheckedChange={onTogglePopulationDensity}
              aria-label="Toggle population density"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Navigation className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-foreground">Evacuation Routes</p>
                <p className="text-xs text-muted-foreground">Emergency exit pathways</p>
              </div>
            </div>
            <Switch
              checked={showEvacuationRoutes}
              onCheckedChange={onToggleEvacuationRoutes}
              aria-label="Toggle evacuation routes"
            />
          </div>
        </div>

        {activeLayersCount > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Legend</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onToggleHeatmap();
                  onTogglePopulationDensity();
                  onToggleEvacuationRoutes();
                }}
                className="h-auto py-1 px-2 text-xs"
              >
                Clear All
              </Button>
            </div>
            <div className="mt-2 space-y-2">
              {showHeatmap && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-2 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded"></div>
                  <span className="text-xs text-muted-foreground">Low → High Intensity</span>
                </div>
              )}
              {showPopulationDensity && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded"></div>
                  <span className="text-xs text-muted-foreground">Sparse → Dense Population</span>
                </div>
              )}
              {showEvacuationRoutes && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-2 border-2 border-dashed border-orange-500 rounded"></div>
                  <span className="text-xs text-muted-foreground">Evacuation Routes</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};