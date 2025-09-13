import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Activity, 
  MapPin, 
  AlertTriangle, 
  FileText,
  Thermometer,
  Heart,
  Eye
} from "lucide-react";
import { MapView } from "@/components/MapView";
import diseasesData from "@/data/diseases.json";

export const DiseaseReports = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [potentialMatches, setPotentialMatches] = useState<any[]>([]);

  const diseases = diseasesData.diseases;
  const symptoms = diseasesData.symptoms;

  const diseaseMarkers = diseases.slice(0, 10).map(disease => ({
    id: disease.id,
    position: disease.coordinates as [number, number],
    popup: `${disease.name} - ${disease.location}`,
    type: 'disease'
  }));

  const diseaseHeatmapData: [number, number, number][] = diseases.map(disease => [
    disease.coordinates[0],
    disease.coordinates[1],
    disease.severity === 'high' ? 0.8 : disease.severity === 'medium' ? 0.5 : 0.3
  ]);
  
  const diseaseReports = [
    {
      id: "dr001",
      disease: "Dengue Fever",
      location: "Mumbai, Maharashtra",
      caseCount: 45,
      severity: "high",
      status: "active",
      source: "Mumbai Municipal Corporation"
    },
    {
      id: "dr002", 
      disease: "Malaria",
      location: "Delhi NCR",
      caseCount: 23,
      severity: "moderate",
      status: "monitoring",
      source: "Delhi Health Department"
    },
    {
      id: "dr003",
      disease: "Cholera",
      location: "Kolkata, West Bengal", 
      caseCount: 12,
      severity: "high",
      status: "active",
      source: "West Bengal Health Dept"
    }
  ];

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleSubmitSymptoms = () => {
    const dummyMatches = [
      {
        disease: "Influenza",
        matchPercentage: 85,
        severity: "moderate",
        description: "Common viral infection affecting respiratory system"
      },
      {
        disease: "Food Poisoning",
        matchPercentage: 72,
        severity: "mild",
        description: "Bacterial infection from contaminated food"
      }
    ];
    setPotentialMatches(dummyMatches);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "moderate": return "warning";
      case "mild": return "secondary";
      default: return "muted";
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Disease Reporting & Tracking
          </h1>
          <p className="text-muted-foreground">
            Report symptoms and track disease outbreaks in your area
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Symptom Reporting Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Report Your Symptoms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-3">
                    Current Location
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter your city or zip code"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline">
                      <MapPin className="h-4 w-4 mr-2" />
                      Detect
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Location will help health authorities track outbreaks
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-3">
                    Select Your Symptoms
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {symptoms.map((symptom) => (
                      <div key={symptom.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={symptom.id}
                          checked={selectedSymptoms.includes(symptom.id)}
                          onCheckedChange={() => handleSymptomToggle(symptom.id)}
                        />
                        <label 
                          htmlFor={symptom.id}
                          className="text-sm text-foreground cursor-pointer"
                        >
                          {symptom.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    {selectedSymptoms.length} symptoms selected
                  </p>
                  <Button 
                    onClick={handleSubmitSymptoms}
                    disabled={selectedSymptoms.length === 0 || !location}
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Analyze Symptoms
                  </Button>
                </div>
              </CardContent>
            </Card>

            {potentialMatches.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5" />
                    Potential Disease Matches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {potentialMatches.map((match, index) => (
                      <div key={index} className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-foreground">
                            {match.disease}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge variant={getSeverityColor(match.severity) as any}>
                              {match.severity}
                            </Badge>
                            <span className="text-sm font-medium text-primary">
                              {match.matchPercentage}% match
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {match.description}
                        </p>
                      </div>
                    ))}
                    
                    <div className="bg-accent/50 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Important Medical Disclaimer
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            This analysis is for informational purposes only. Please consult 
                            a healthcare professional for proper diagnosis and treatment.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Disease Map & Reports */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Disease Cases Map
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <MapView
                  center={[20.5937, 78.9629]}
                  zoom={5}
                  markers={diseaseMarkers}
                  heatmapData={diseaseHeatmapData}
                  showHeatmap={true}
                  className="h-48 w-full rounded-lg"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {diseaseReports.map((report) => (
                    <div key={report.id} className="border border-border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-foreground text-sm">
                          {report.disease}
                        </h4>
                        <Badge 
                          variant={getSeverityColor(report.severity) as any}
                          className="text-xs"
                        >
                          {report.severity}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          📍 {report.location}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Cases: {report.caseCount} • Status: {report.status}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Source: {report.source}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Health Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p>Wash hands frequently with soap and water</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p>Maintain social distance if outbreak is active</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p>Seek immediate medical attention for severe symptoms</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p>Report symptoms early to help prevent spread</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};