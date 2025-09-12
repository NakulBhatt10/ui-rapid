import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  MapPin, 
  Users, 
  Phone, 
  Mail, 
  Bed, 
  Plus,
  Heart,
  School,
  Building
} from "lucide-react";
import { MapView } from "@/components/MapView";
import accommodationsData from "@/data/accommodations.json";

export const Accommodations = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [showOrgForm, setShowOrgForm] = useState(false);

  // TODO: Connect to accommodation database/API
  const accommodations = accommodationsData.accommodations;

  const filteredAccommodations = accommodations.filter(acc =>
    acc.location.toLowerCase().includes(searchLocation.toLowerCase()) ||
    acc.name.toLowerCase().includes(searchLocation.toLowerCase())
  );

  // Prepare map markers
  const accommodationMarkers = filteredAccommodations.slice(0, 20).map(accommodation => ({
    id: accommodation.id,
    position: accommodation.coordinates as [number, number],
    popup: `${accommodation.name} - ${accommodation.location}`,
    type: accommodation.type
  }));

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available": return "success";
      case "limited": return "warning";
      case "full": return "destructive";
      default: return "secondary";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "emergency shelter": return Heart;
      case "school shelter": return School;
      case "medical facility": return Plus;
      default: return Building;
    }
  };

  const handleOrgSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to accommodation database/API
    console.log("Organization form submitted");
    setShowOrgForm(false);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Emergency Accommodations
          </h1>
          <p className="text-muted-foreground">
            Find available shelters and emergency accommodations in your area
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search and Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Accommodations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Location
                  </label>
                  <Input
                    placeholder="Enter city or zip code"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block">
                    Filter by Type
                  </label>
                  <div className="space-y-1">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Emergency Shelters
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Medical Facilities
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      School Shelters
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Religious Facilities
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Provide Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Are you an organization that can provide emergency accommodation?
                </p>
                <Button 
                  onClick={() => setShowOrgForm(!showOrgForm)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Register Your Facility
                </Button>
              </CardContent>
            </Card>

            {/* Organization Form */}
            {showOrgForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Organization Registration</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleOrgSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">
                        Organization Name
                      </label>
                      <Input placeholder="Enter organization name" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-1">
                        Facility Type
                      </label>
                      <Input placeholder="e.g., School, Hospital, Community Center" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-1">
                        Capacity
                      </label>
                      <Input type="number" placeholder="Number of people" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-1">
                        Address
                      </label>
                      <Textarea placeholder="Full address" rows={2} />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-1">
                        Contact Information
                      </label>
                      <Input placeholder="Phone number" className="mb-2" />
                      <Input placeholder="Email address" />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        Submit
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowOrgForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Accommodation Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Accommodation Locations Map */}
            <Card>
              <CardHeader>
                <CardTitle>Accommodation Locations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <MapView
                  center={[20.5937, 78.9629]}
                  zoom={5}
                  markers={accommodationMarkers}
                  className="h-64 w-full rounded-lg"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Available Accommodations ({filteredAccommodations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAccommodations.map((accommodation) => {
                    const IconComponent = getTypeIcon(accommodation.type);
                    const occupancyRate = (accommodation.currentOccupancy / accommodation.capacity) * 100;
                    
                    return (
                      <div
                        key={accommodation.id}
                        className="border border-border rounded-lg p-6 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-6 w-6 text-primary" />
                            <div>
                              <h3 className="font-semibold text-foreground text-lg">
                                {accommodation.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {accommodation.organization}
                              </p>
                            </div>
                          </div>
                          <Badge 
                            variant={getAvailabilityColor(accommodation.availability) as any}
                            className="capitalize"
                          >
                            {accommodation.availability}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{accommodation.address}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {accommodation.currentOccupancy}/{accommodation.capacity} occupied 
                              ({occupancyRate.toFixed(0)}%)
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{accommodation.contactPhone}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{accommodation.contactEmail}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-foreground mb-2">
                            Available Amenities
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {accommodation.amenities.map((amenity) => (
                              <Badge key={amenity} variant="outline">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            Last updated: {new Date(accommodation.lastUpdated).toLocaleString()}
                          </span>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            {accommodation.availability === "available" && (
                              <Button size="sm">
                                {/* TODO: Enable booking/check availability */}
                                Request Space
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {filteredAccommodations.length === 0 && (
                    <div className="text-center py-8">
                      <Bed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No accommodations found in this area.
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Try searching in nearby cities or expand your search criteria.
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