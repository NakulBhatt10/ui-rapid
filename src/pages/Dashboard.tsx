import { AlertTriangle, Users, MapPin, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import disastersData from "@/data/disasters.json";
import accommodationsData from "@/data/accommodations.json";
import { useState } from 'react';
import { useLongPress } from '@/hooks/useLongPress';

const SOSButton = () => {
  const [isActivating, setIsActivating] = useState(false);

  const triggerSOS = async () => {
    setIsActivating(false);
    // Add your SOS logic here
    alert('Emergency SOS activated! Contacting authorities...');
  };

  const longPressProps = useLongPress(triggerSOS, {
    threshold: 2000, // 2 seconds
    onStart: () => setIsActivating(true),
    onCancel: () => setIsActivating(false)
  });

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Button
          {...longPressProps}
          size="lg"
          className="h-40 w-40 md:h-48 md:w-48 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-2xl md:text-3xl shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 transform"
        >
          <div className="flex flex-col items-center gap-2">
            <AlertTriangle className="h-12 w-12 md:h-16 md:w-16" />
            <span className="text-2xl md:text-3xl">SOS</span>
          </div>
        </Button>
        
        {/* Progress ring for long press */}
        {isActivating && (
          <div className="absolute inset-0 rounded-full">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="46"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-white/30"
              />
              <circle
                cx="50"
                cy="50"
                r="46"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray="289"
                strokeDashoffset="145"
                className="text-white animate-pulse"
                style={{
                  animation: 'progress 2s linear forwards'
                }}
              />
            </svg>
          </div>
        )}
      </div>
      <p className="mt-4 text-muted-foreground text-center max-w-xs">
        Press and hold for 2 seconds to activate emergency SOS
      </p>
    </div>
  );
};

export const Dashboard = () => {
  // TODO: Connect real-time alerts API here
  const activeDisasters = disastersData.disasters.filter(d => d.status === "active");
  const criticalDisasters = activeDisasters.filter(d => d.severity === "critical");
  const availableAccommodations = accommodationsData.accommodations.filter(a => a.availability === "available");

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            RAPID Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Real-time Adaptive Platform for Integrated Disaster Response
          </p>
          <p className="text-muted-foreground">
            Monitoring disasters and disease outbreaks across India with AI-powered response coordination
          </p>
        </div>

        {/* SOS Button */}
        <div className="flex justify-center my-12">
          <SOSButton />
        </div>

        {/* Critical Alerts */}
        {criticalDisasters.length > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-alert rounded-lg p-6 shadow-alert">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-destructive-foreground" />
                <h2 className="text-xl font-bold text-destructive-foreground">
                  Critical Alerts
                </h2>
              </div>
              {criticalDisasters.map((disaster) => (
                <div key={disaster.id} className="bg-white/20 rounded-lg p-4 mb-2 last:mb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-destructive-foreground capitalize">
                        {disaster.type} - {disaster.location}
                      </h3>
                      <p className="text-destructive-foreground/90 text-sm">
                        {disaster.description}
                      </p>
                      <p className="text-destructive-foreground/80 text-xs mt-1">
                        Affected Population: {disaster.affectedPopulation.toLocaleString()}
                      </p>
                    </div>
                    <Button variant="secondary" size="sm" asChild>
                      <Link to="/disaster-map">View Map</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Disasters
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{activeDisasters.length}</div>
              <p className="text-xs text-muted-foreground">
                +2 from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                People Affected
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {activeDisasters.reduce((sum, d) => sum + d.affectedPopulation, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all active disasters
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available Shelters
              </CardTitle>
              <MapPin className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{availableAccommodations.length}</div>
              <p className="text-xs text-muted-foreground">
                Ready to accept evacuees
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                System Status
              </CardTitle>
              <Activity className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">Online</div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Disaster Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View real-time disaster locations and affected areas on an interactive map.
              </p>
              <Button asChild className="w-full">
                <Link to="/disaster-map">Open Map</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Find Shelter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Locate available emergency shelters and accommodation facilities.
              </p>
              <Button asChild className="w-full">
                <Link to="/accommodations">Find Accommodation</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Report Symptoms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Report health symptoms to help track disease outbreaks in your area.
              </p>
              <Button asChild className="w-full">
                <Link to="/disease-reports">Report Symptoms</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};