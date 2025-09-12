import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Target, 
  Users, 
  Globe, 
  Heart, 
  Zap,
  CheckCircle,
  ArrowRight,
  Mail,
  Linkedin
} from "lucide-react";
import teamData from "@/data/team.json";

export const AboutUs = () => {
  const features = [
    {
      icon: Shield,
      title: "Real-time Monitoring",
      description: "Continuous tracking of disasters and health emergencies across India using multiple data sources"
    },
    {
      icon: Target,
      title: "India-Focused Solutions",
      description: "Specifically designed for Indian geography, climate patterns, and emergency response infrastructure"
    },
    {
      icon: Users,
      title: "Community Coordination",
      description: "Connect relief organizations, volunteers, and affected communities for efficient aid distribution"
    },
    {
      icon: Globe,
      title: "Multi-Channel Communication",
      description: "SMS, satellite, and mesh networking for reliable communication during infrastructure failures"
    }
  ];

  const goals = [
    "Reduce emergency response time through real-time data integration across India",
    "Improve coordination between Central/State disaster management authorities",
    "Provide early warning systems for monsoon-related disasters and disease outbreaks",
    "Enable offline-capable communication during infrastructure failures",
    "Create comprehensive resource matching for emergency accommodations",
    "Support data-driven decision making for emergency management in Indian context"
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Shield className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            About RAPID
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real-time Adaptive Platform for Integrated Disaster Response - 
            A comprehensive emergency response platform designed specifically for India's 
            unique disaster management and public health challenges.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="mb-12">
          <CardContent className="pt-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                To create a unified emergency response ecosystem specifically for India that connects 
                real-time data, artificial intelligence, and human coordination to provide faster, 
                more effective disaster response and disease outbreak management. We believe that 
                technology can bridge the critical gap between emergency detection and community 
                response in the Indian context.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamData.team.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <div className="bg-primary/10 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                      <Users className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground text-lg mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium text-sm">
                      {member.role}
                    </p>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {member.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground text-sm">Expertise:</h4>
                    <div className="flex flex-wrap gap-1">
                      {member.expertise.map((skill, index) => (
                        <span 
                          key={index}
                          className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">
            Platform Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Goals & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Project Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {goals.map((goal, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{goal}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Vision for India
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Monsoon Preparedness</h4>
                  <p className="text-sm text-muted-foreground">
                    Enhanced early warning systems for floods, cyclones, and landslides 
                    during India's monsoon seasons.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Urban Resilience</h4>
                  <p className="text-sm text-muted-foreground">
                    Smart solutions for India's growing urban centers to handle 
                    infrastructure failures and overcrowding during emergencies.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Rural Connectivity</h4>
                  <p className="text-sm text-muted-foreground">
                    Offline-capable systems to ensure emergency response reaches 
                    India's remote and underserved communities.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact & Collaboration */}
        <Card className="text-center">
          <CardContent className="pt-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Join Our Mission for India
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Whether you're from NDMA, state disaster management authorities, healthcare 
              institutions, NGOs, or tech organizations, we welcome collaborations to make 
              India more resilient to disasters and health emergencies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Users className="h-4 w-4 mr-2" />
                Partner With Us
              </Button>
              <Button variant="outline" size="lg">
                <Mail className="h-4 w-4 mr-2" />
                Contact Team
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};