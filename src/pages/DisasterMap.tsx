import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Filter } from "lucide-react";
import { MapView } from "@/components/MapView";
import { HeatmapToggle } from "@/components/HeatmapToggle";
import disastersData from "@/data/disasters.json";

export const DisasterMap = () => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [showPopulationDensity, setShowPopulationDensity] = useState<boolean>(false);
  const [showEvacuationRoutes, setShowEvacuationRoutes] = useState<boolean>(false);

  // TODO: Integrate NASA API or disaster data API
  const disasters = disastersData.disasters;
  const disasterTypes = disastersData.disasterTypes;

  const filteredDisasters = disasters.filter(disaster => {
    const typeMatch = selectedType === "all" || disaster.type === selectedType;
    const severityMatch = selectedSeverity === "all" || disaster.severity === selectedSeverity;
    return typeMatch && severityMatch;
  });

  // Prepare data for map components
  const mapMarkers = filteredDisasters.map(disaster => ({
    id: disaster.id,
    position: disaster.coordinates as [number, number],
    popup: `${disaster.type.charAt(0).toUpperCase() + disaster.type.slice(1)} - ${disaster.location}`,
    type: disaster.type
  }));

  const heatmapData: [number, number, number][] = filteredDisasters.map(disaster => [
    disaster.coordinates[0],
    disaster.coordinates[1],
    (disaster as any).intensity || 0.5
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "warning";
      case "moderate": return "secondary";
      default: return "muted";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "destructive";
      case "approaching": return "warning";
      case "monitoring": return "secondary";
      case "resolved": return "success";
      default: return "muted";
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Disaster Map
          </h1>
          <p className="text-muted-foreground">
            Real-time visualization of disasters and affected areas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Disaster Type
                  </label>
                  <div className="space-y-2">
                    <Button
                      variant={selectedType === "all" ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedType("all")}
                    >
                      All Types
                    </Button>
                    {disasterTypes.map((type) => (
                      <Button
                        key={type.id}
                        variant={selectedType === type.id ? "default" : "outline"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setSelectedType(type.id)}
                      >
                        {type.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Severity Level
                  </label>
                  <div className="space-y-2">
                    {["all", "critical", "high", "moderate"].map((severity) => (
                      <Button
                        key={severity}
                        variant={selectedSeverity === severity ? "default" : "outline"}
                        size="sm"
                        className="w-full justify-start capitalize"
                        onClick={() => setSelectedSeverity(severity)}
                      >
                        {severity}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <HeatmapToggle
              showHeatmap={showHeatmap}
              showPopulationDensity={showPopulationDensity}
              showEvacuationRoutes={showEvacuationRoutes}
              onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
              onTogglePopulationDensity={() => setShowPopulationDensity(!showPopulationDensity)}
              onToggleEvacuationRoutes={() => setShowEvacuationRoutes(!showEvacuationRoutes)}
            />
          </div>

          {/* Map and Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* Interactive Map */}
            <Card>
              <CardContent className="p-0">
                <MapView
                  center={[20.5937, 78.9629]}
                  zoom={5}
                  markers={mapMarkers}
                  heatmapData={heatmapData}
                  showHeatmap={showHeatmap}
                  showPopulationDensity={showPopulationDensity}
                  showEvacuationRoutes={showEvacuationRoutes}
                  className="h-96 w-full rounded-lg"
                />
              </CardContent>
            </Card>

            {/* Disaster List */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Active Disasters ({filteredDisasters.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredDisasters.map((disaster) => (
                    <div
                      key={disaster.id}
                      className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground capitalize">
                            {disaster.type}
                          </h3>
                          <Badge variant={getSeverityColor(disaster.severity) as any}>
                            {disaster.severity}
                          </Badge>
                          <Badge variant={getStatusColor(disaster.status) as any}>
                            {disaster.status}
                          </Badge>
                        </div>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        📍 {disaster.location}
                      </p>
                      
                      <p className="text-sm text-foreground mb-2">
                        {disaster.description}
                      </p>
                      
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>
                          Affected: {disaster.affectedPopulation.toLocaleString()} people
                        </span>
                        <span>
                          Reported: {new Date(disaster.reportedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {filteredDisasters.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No disasters found matching your filters.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};