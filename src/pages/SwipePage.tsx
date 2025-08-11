import Navigation from "@/components/Navigation";
import ElevenLabsWidget from "@/components/ElevenLabsWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { SwipeableCardStack } from "@/components/ui/tinder-like-swipe";
import { useState, useEffect } from "react";
import { Heart, X, MapPin, Bed, Bath, Square, Settings } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import { useCurrency } from "@/contexts/CurrencyContext";
import SEOHead from "@/components/SEOHead";

const SwipePage = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [bedrooms, setBedrooms] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentProperty, setCurrentProperty] = useState<any>(null);
  
  const { properties = [], loading } = useProperties();
  const { formatPrice } = useCurrency();

  // Filter properties based on selected criteria
  const filteredProperties = properties.filter((property) => {
    const matchesLocation = selectedLocation === "all" || 
      property.location?.toLowerCase().includes(selectedLocation.toLowerCase());
    
    // Parse price to number for comparison
    const priceValue = parseFloat(property.price?.replace(/[^\d.]/g, '') || '0');
    const matchesPrice = priceValue >= priceRange[0] && priceValue <= priceRange[1];
    
    const matchesBedrooms = bedrooms === "all" || property.bedrooms === bedrooms;
    
    return matchesLocation && matchesPrice && matchesBedrooms;
  });

  // Convert properties to image array for swipe component
  const propertyImages = filteredProperties.map(property => property.property_image || '');
  
  // Set current property based on the last image in stack
  useEffect(() => {
    if (filteredProperties.length > 0) {
      setCurrentProperty(filteredProperties[filteredProperties.length - 1]);
    }
  }, [filteredProperties]);

  const locations = [
    { value: "all", label: "All Locations" },
    { value: "antalya", label: "Antalya" },
    { value: "mersin", label: "Mersin" },
    { value: "dubai", label: "Dubai" },
    { value: "cyprus", label: "Cyprus" },
    { value: "france", label: "France" }
  ];

  const bedroomOptions = [
    { value: "all", label: "Any Bedrooms" },
    { value: "1", label: "1 Bedroom" },
    { value: "2", label: "2 Bedrooms" },
    { value: "3", label: "3 Bedrooms" },
    { value: "4+", label: "4+ Bedrooms" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Swipe Properties | Find Your Dream Home"
        description="Swipe through properties to find your perfect home. Filter by location, price, and bedrooms."
        keywords="property swipe, tinder for homes, property search, real estate"
        canonicalUrl="https://futurehomesturkey.com/swipe"
      />
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <Badge className="mb-4">Property Swipe</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Find Your Dream Home
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Swipe right to like, left to pass. Find properties that match your taste!
          </p>
          
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="mb-6"
          >
            <Settings className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Property Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Bedrooms</label>
                  <Select value={bedrooms} onValueChange={setBedrooms}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bedrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      {bedroomOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={10000000}
                  min={0}
                  step={50000}
                  className="w-full"
                />
              </div>
              
              <div className="text-sm text-muted-foreground">
                Found {filteredProperties.length} properties matching your criteria
              </div>
            </CardContent>
          </Card>
        )}

        {/* Swipe Interface */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Swipe Cards */}
          <div className="flex-1 max-w-md mx-auto">
            <div className="relative h-96 lg:h-[500px]">
              {filteredProperties.length > 0 ? (
                <SwipeableCardStack
                  images={propertyImages}
                  borderRadius={16}
                  rightIcon="https://uploads-ssl.webflow.com/6226162356726c4835057a73/6232367c3761286ddff6004c_icon-like.svg"
                  leftIcon="https://uploads-ssl.webflow.com/6226162356726c4835057a73/6232367c825de783a6697a3c_icon-dislike.svg"
                />
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">No properties match your filters</p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedLocation("all");
                        setBedrooms("all");
                        setPriceRange([0, 10000000]);
                      }}
                      className="mt-4"
                    >
                      Reset Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <Button variant="outline" size="lg" className="w-16 h-16 rounded-full">
                <X className="w-6 h-6 text-red-500" />
              </Button>
              <Button variant="outline" size="lg" className="w-16 h-16 rounded-full">
                <Heart className="w-6 h-6 text-green-500" />
              </Button>
            </div>
          </div>

          {/* Property Info */}
          {currentProperty && (
            <div className="flex-1 max-w-md">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{currentProperty.title}</CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin size={16} />
                    <span>{currentProperty.location}</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(currentProperty.price)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Bed size={16} className="text-primary" />
                      <span className="text-sm">{currentProperty.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath size={16} className="text-primary" />
                      <span className="text-sm">{currentProperty.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square size={16} className="text-primary" />
                      <span className="text-sm">{currentProperty.sizes_m2}</span>
                    </div>
                  </div>
                  
                  {currentProperty.description && (
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {currentProperty.description}
                      </p>
                    </div>
                  )}
                  
                  <Button className="w-full">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      
      <ElevenLabsWidget />
    </div>
  );
};

export default SwipePage;