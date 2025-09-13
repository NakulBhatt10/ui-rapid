import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Satellite, 
  Bluetooth, 
  Wifi, 
  Radio, 
  MessageSquare,
  Phone,
  AlertTriangle
} from "lucide-react";

export const Communication = () => {
  const communicationMethods = [
    {
      id: "sms",
      name: "SMS Emergency Alerts",
      icon: MessageSquare,
      status: "available",
      description: "Receive critical emergency updates via text message",
      features: ["Location-based alerts", "Multi-language support", "Low bandwidth"],
      setup: "Subscribe by texting EMERGENCY to 911-ALERT"
    },
    {
      id: "satellite",
      name: "Satellite Communication",
      icon: Satellite,
      status: "limited",
      description: "Emergency communication when cellular networks are down",
      features: ["Global coverage", "Weather resistant", "High reliability"],
      setup: "Requires satellite-enabled device or emergency beacon"
    },
    {
      id: "bluetooth-mesh",
      name: "Bluetooth Mesh Network",
      icon: Bluetooth,
      status: "development",
      description: "Device-to-device emergency messaging network",
      features: ["No internet required", "Extends communication range", "Peer-to-peer"],
      setup: "Enable Bluetooth and install mesh communication app"
    },
    {
      id: "emergency-wifi",
      name: "Emergency WiFi Hotspots",
      icon: Wifi,
      status: "available",
      description: "Public WiFi access points activated during emergencies",
      features: ["Free access", "Emergency services priority", "Wide coverage"],
      setup: "Connect to 'EMERGENCY-WIFI' network during disasters"
    },
    {
      id: "ham-radio",
      name: "Amateur Radio Network",
      icon: Radio,
      status: "available", 
      description: "Long-range radio communication for emergency coordination",
      features: ["Long distance", "No infrastructure needed", "Volunteer operated"],
      setup: "Contact local amateur radio emergency service (ARES)"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "success";
      case "limited": return "warning";
      case "development": return "secondary";
      default: return "muted";
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Emergency Communication
          </h1>
          <p className="text-muted-foreground">
            Stay connected during disasters with multiple communication channels
          </p>
        </div>

        <div className="mb-8">
          <Card className="border-warning bg-warning/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="h-6 w-6 text-warning" />
                <h2 className="text-lg font-semibold text-foreground">
                  Communication During Emergencies
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                During disasters, traditional communication networks may be disrupted. 
                Having multiple communication methods increases your chances of staying 
                connected with emergency services and loved ones.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency Contacts Guide
                </Button>
                <Button variant="outline" size="sm">
                  Download Offline Maps
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {communicationMethods.map((method) => {
            const IconComponent = method.icon;
            return (
              <Card key={method.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-6 w-6 text-primary" />
                      <CardTitle className="text-lg">{method.name}</CardTitle>
                    </div>
                    <Badge 
                      variant={getStatusColor(method.status) as any}
                      className="capitalize"
                    >
                      {method.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {method.description}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      Key Features
                    </h4>
                    <div className="space-y-1">
                      {method.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-success rounded-full" />
                          <span className="text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-accent/30 rounded-lg p-3 mb-4">
                    <h4 className="text-sm font-medium text-foreground mb-1">
                      Setup Instructions
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {method.setup}
                    </p>
                  </div>
                  
                  <Button 
                    variant={method.status === "available" ? "default" : "outline"}
                    className="w-full"
                    disabled={method.status === "development"}
                  >
                    {method.status === "available" ? "Setup Now" : 
                     method.status === "limited" ? "Learn More" : 
                     "Coming Soon"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Communication Protocols</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Before Disaster
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Set up multiple communication methods</li>
                  <li>• Share emergency contact information</li>
                  <li>• Download offline communication apps</li>
                  <li>• Test all communication devices</li>
                  <li>• Establish family meeting points</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  During Emergency
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Keep messages brief and clear</li>
                  <li>• Try multiple communication methods</li>
                  <li>• Listen to emergency broadcasts</li>
                  <li>• Conserve device battery power</li>
                  <li>• Follow official emergency channels</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  After Disaster
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Report safety status to authorities</li>
                  <li>• Check in with emergency contacts</li>
                  <li>• Document damage and needs</li>
                  <li>• Continue monitoring official updates</li>
                  <li>• Assist others in communication efforts</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 bg-muted/50 rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-3">
            Integration Roadmap
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-2">Phase 1 - SMS Integration</p>
              <p>• TODO: Add SMS API integration</p>
              <p>• Connect to emergency alert systems</p>
              <p>• Implement location-based messaging</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2">Phase 2 - Advanced Features</p>
              <p>• Satellite communication protocols</p>
              <p>• Bluetooth mesh network implementation</p>
              <p>• Offline messaging capabilities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};