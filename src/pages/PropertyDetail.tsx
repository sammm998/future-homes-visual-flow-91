import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Timeline } from "@/components/ui/timeline";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone, Mail, ArrowLeft, ChevronLeft, ChevronRight, Bed, Bath, Square, Calendar, Car, Home, Plane, Waves, CheckCircle, Star, Award, Images, X } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useCurrency } from '@/contexts/CurrencyContext';
import { useProperty } from '@/hooks/useProperty';
import { formatPriceFromString } from '@/utils/priceFormatting';
import ervinaImage from '@/assets/ervina-koksel.png';

import { supabase } from '@/integrations/supabase/client';

// Agent data with images
const getAgentData = (agentName: string) => {
  const agents: Record<string, any> = {
     "Ervina Köksel": {
       name: "Ervina Köksel",
       image: ervinaImage,
       title: "Sales Office Supervisor",
       experience: "Experienced property specialist",
       specialties: ["Property Sales", "Customer Service", "Office Management"]
     }
  };
  return agents[agentName] || null;
};

// Get property data - database only approach
const getPropertyData = async (id: string) => {
  console.log('getPropertyData: Looking for property with ID:', id);
  
  // Try database lookup - this is now the only source
  try {
    // Try to find by ref_no first
    let { data: dbProperty, error } = await supabase
      .from('properties')
      .select('*')
      .eq('ref_no', id)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    console.log('getPropertyData: Database lookup by ref_no result:', { dbProperty, error });

    // If not found by ref_no, try by id (for UUID format)
    if (!dbProperty && !error) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(id)) {
        const result = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .eq('is_active', true)
          .maybeSingle();
        
        dbProperty = result.data;
        error = result.error;
        console.log('getPropertyData: Database lookup by UUID result:', { dbProperty, error });
      }
    }

    if (!error && dbProperty) {
      console.log('getPropertyData: Found property in database:', dbProperty.title);
      // Parse the facilities array and convert to clean format
      let facilities: string[] = [];
      if (dbProperty.property_facilities && Array.isArray(dbProperty.property_facilities)) {
        facilities = dbProperty.property_facilities;
      } else if (typeof dbProperty.facilities === 'string') {
        facilities = dbProperty.facilities.split(',').map(f => f.trim());
      }
      
      // Clean up facilities - remove duplicates and empty values
      facilities = [...new Set(facilities.filter(f => f && f.trim()))];

      // Parse property images
      let images: string[] = [];
      if (dbProperty.property_images && Array.isArray(dbProperty.property_images)) {
        images = dbProperty.property_images;
      }
      if (dbProperty.property_image) {
        images = [dbProperty.property_image, ...images];
      }

      // Parse pricing from apartment_types (prioritized) or property_prices_by_room (fallback)
      let pricing: any[] = [];
      
      // First try apartment_types if available
      if (dbProperty.apartment_types) {
        try {
          const apartmentTypes = typeof dbProperty.apartment_types === 'string' 
            ? JSON.parse(dbProperty.apartment_types)
            : dbProperty.apartment_types;
          
          if (Array.isArray(apartmentTypes) && apartmentTypes.length > 0) {
            pricing = apartmentTypes.map((apt: any) => ({
              type: apt.type ? `${apt.type} Apartment` : 'Apartment',
              size: apt.size ? `${apt.size}m²` : '',
              price: apt.price ? `€${apt.price.toLocaleString('en-US')}` : ''
            }));
          }
        } catch (error) {
          console.warn('Failed to parse apartment_types:', error);
        }
      }
      
      // Fallback to property_prices_by_room if no apartment_types
      if (pricing.length === 0 && dbProperty.property_prices_by_room) {
        const priceText = dbProperty.property_prices_by_room;
        const priceMatches = priceText.split(';');
        pricing = priceMatches.map((match: string) => {
          const parts = match.trim().split(' - ');
          if (parts.length >= 3) {
            return {
              type: parts[0].trim(),
              size: parts[1].trim(),
              price: parts[2].trim()
            };
          }
          return null;
        }).filter(Boolean);
      }

      return {
        id: dbProperty.ref_no,
        title: dbProperty.title,
        location: dbProperty.location,
        price: `€${dbProperty.price || dbProperty.starting_price_eur}`,
        bedrooms: dbProperty.bedrooms,
        bathrooms: dbProperty.bathrooms,
        area: dbProperty.sizes_m2,
        propertyType: dbProperty.property_type || "Apartments",
        refNo: dbProperty.ref_no,
        buildingComplete: dbProperty.building_complete_date,
        description: dbProperty.description,
        features: facilities,
        facilities: facilities,
        pricing: pricing,
        images: images,
        distanceToAirport: dbProperty.distance_to_airport_km ? `${dbProperty.distance_to_airport_km} km` : undefined,
        distanceToBeach: dbProperty.distance_to_beach_km ? `${dbProperty.distance_to_beach_km} km` : undefined,
        agent: dbProperty.agent_name || "Ervina Köksel",
        contactPhone: dbProperty.agent_phone_number || "+905523032750",
        contactEmail: "info@futurehomesturkey.com"
      };
    }
  } catch (error) {
    console.error('Database lookup error:', error);
  }

  // Property not found
  console.log('getPropertyData: Property not found in database for ID:', id);
  return null;
};

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  
  // Use the database-focused useProperty hook for UUID-based lookups
  const { property: dbProperty, loading: dbLoading, error: dbError } = useProperty(id || '');
  
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) {
        setError('Property ID is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Check if this looks like a UUID (for newer properties)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        
        if (uuidRegex.test(id) && dbProperty) {
          // Use the database property directly for UUIDs
          setProperty(dbProperty);
          setLoading(false);
          return;
        }
        
        // For ref_no lookups, use our custom function
        const propertyData = await getPropertyData(id);
        
        if (propertyData) {
          setProperty(propertyData);
        } else {
          setError(`Property with ID "${id}" not found. This property may not exist or may have been removed.`);
        }
      } catch (err) {
        console.error('Error loading property:', err);
        setError('Failed to load property details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id, dbProperty, dbLoading]);

  // Show loading state
  if (loading || dbLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Navigation />
        <div className="container mx-auto px-4 pt-32">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-6"></div>
              <p className="text-lg text-muted-foreground">Loading property details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || dbError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Navigation />
        <div className="container mx-auto px-4 pt-32">
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Home className="h-12 w-12 text-muted-foreground" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-4">Property Not Found</h1>
                <p className="text-muted-foreground text-lg mb-8">
                  {error || dbError || `Sorry, we couldn't find the property you're looking for.`}
                </p>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={() => navigate(-1)} 
                  variant="outline" 
                  className="w-full"
                  size="lg"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
                
                <Button 
                  onClick={() => navigate('/')} 
                  className="w-full"
                  size="lg"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>
              
              <div className="mt-8 p-6 bg-muted/50 rounded-2xl">
                <p className="text-sm text-muted-foreground">
                  <strong>Tip:</strong> Try browsing our available properties from the homepage or contact us for assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show property not found if no property data
  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Navigation />
        <div className="container mx-auto px-4 pt-32">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Property Not Found</h1>
            <p className="text-muted-foreground text-lg mb-8">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/')} className="inline-flex items-center" size="lg">
              <Home className="h-4 w-4 mr-2" />
              Back to Properties
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const getTimelineData = () => {
    const timeline = [];
    
    timeline.push({
      title: "Property Listed",
      content: "Property added to our portfolio with detailed specifications and pricing",
      date: "Available Now"
    });

    if (property.buildingComplete) {
      const completionDate = new Date(property.buildingComplete);
      const isCompleted = completionDate <= new Date();
      
      timeline.push({
        title: isCompleted ? "Construction Completed" : "Expected Completion",
        content: isCompleted 
          ? "Building construction has been completed and is ready for occupancy"
          : "Estimated completion date based on current construction progress",
        date: completionDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      });
    }

    timeline.push({
      title: "Ready for Purchase",
      content: "Property is available for immediate purchase with all documentation ready",
      date: "Contact Us"
    });

    return timeline;
  };

  const agent = getAgentData(property.agent);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <Navigation />
      
      {/* Image Modal */}
      {showImageModal && property.images && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-16 right-0 text-white hover:text-primary transition-colors z-10 bg-black/50 p-3 rounded-full backdrop-blur-sm"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={property.images[currentImageIndex] || property.image || "/placeholder.svg"}
                alt={`Property view ${currentImageIndex + 1}`}
                className="max-h-[85vh] max-w-full object-contain"
              />
              
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-all border border-white/20"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-all border border-white/20"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
            
            <div className="text-white text-center mt-6 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3 mx-auto w-fit text-sm">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-8 hover:bg-muted/50 transition-all"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Properties
        </Button>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Property Header */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                  REF: {property.refNo || property.id}
                </Badge>
                {property.status && (
                  <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-muted-foreground/30 hover:border-muted-foreground/50 transition-colors">
                    {property.status}
                  </Badge>
                )}
              </div>
              
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                  {property.title}
                </h1>
                <div className="flex items-center text-muted-foreground text-lg">
                  <MapPin className="h-6 w-6 mr-3 text-primary" />
                  <span className="text-xl">{property.location}</span>
                </div>
                <div className="inline-block">
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                    {formatPriceFromString(property.price, formatPrice)}
                  </div>
                  <div className="text-lg text-muted-foreground">Starting from</div>
                </div>
              </div>
            </div>

            {/* Property Images */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-foreground">Property Gallery</h2>
              <Card className="overflow-hidden shadow-elegant hover:shadow-glow transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="relative group">
                    <img
                      src={property.images?.[currentImageIndex] || property.image || "/placeholder.svg"}
                      alt="Property"
                      className="w-full h-[600px] object-cover cursor-pointer transition-transform duration-700 group-hover:scale-105"
                      onClick={() => setShowImageModal(true)}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {property.images && property.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/20 transition-all border border-white/20 opacity-0 group-hover:opacity-100 shadow-lg"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/20 transition-all border border-white/20 opacity-0 group-hover:opacity-100 shadow-lg"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </button>
                        
                        <button
                          onClick={() => setShowImageModal(true)}
                          className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-sm text-white px-6 py-3 rounded-full hover:bg-black/80 transition-all text-sm flex items-center gap-3 border border-white/20 shadow-lg"
                        >
                          <Images className="h-5 w-5" />
                          View All ({property.images.length})
                        </button>
                        
                        <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm border border-white/20 shadow-lg">
                          {currentImageIndex + 1} / {property.images.length}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
                
                {property.images && property.images.length > 1 && (
                  <div className="p-6 bg-muted/30">
                    <div className="grid grid-cols-6 gap-3">
                      {property.images.slice(0, 6).map((img: string, index: number) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className={`w-full h-20 object-cover rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 ${
                            index === currentImageIndex 
                              ? 'ring-3 ring-primary shadow-lg' 
                              : 'hover:opacity-80 shadow-md'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Property Details */}
            <Card className="overflow-hidden shadow-elegant border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-8 text-foreground">Property Details</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {property.bedrooms && (
                    <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-xl">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Bed className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Bedrooms</p>
                        <p className="text-xl font-bold text-foreground">{property.bedrooms}</p>
                      </div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-xl">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Bath className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Bathrooms</p>
                        <p className="text-xl font-bold text-foreground">{property.bathrooms}</p>
                      </div>
                    </div>
                  )}
                  {property.area && (
                    <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-xl">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Square className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Area</p>
                        <p className="text-xl font-bold text-foreground">{property.area}m²</p>
                      </div>
                    </div>
                  )}
                  {property.propertyType && (
                    <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-xl">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Home className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Type</p>
                        <p className="text-xl font-bold text-foreground">{property.propertyType}</p>
                      </div>
                    </div>
                  )}
                </div>

                {property.description && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-4 text-foreground">Description</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                      {property.description}
                    </p>
                  </div>
                )}

                {/* Location Details */}
                {(property.distanceToAirport || property.distanceToBeach) && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-6 text-foreground">Location & Accessibility</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {property.distanceToAirport && (
                        <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-xl">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Plane className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground font-medium">Airport</p>
                            <p className="text-xl font-bold text-foreground">{property.distanceToAirport}</p>
                          </div>
                        </div>
                      )}
                      {property.distanceToBeach && (
                        <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-xl">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Waves className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground font-medium">Beach</p>
                            <p className="text-xl font-bold text-foreground">{property.distanceToBeach}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-6 text-foreground">Features & Amenities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {property.features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center space-x-3 p-4 bg-muted/50 rounded-xl hover:bg-muted/70 transition-colors">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="text-sm font-medium text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing Information */}
            {property.pricing && property.pricing.length > 0 && (
              <Card className="overflow-hidden shadow-elegant border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold mb-8 text-foreground">Available Options</h2>
                  <div className="space-y-6">
                    {property.pricing.map((option: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-6 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border border-muted/50 hover:border-primary/30 transition-all">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{option.type}</h3>
                          <p className="text-muted-foreground font-medium">{option.size}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                            {formatPriceFromString(option.price, formatPrice)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Project Timeline */}
            <Card className="overflow-hidden shadow-elegant border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-8 text-foreground">Project Timeline</h2>
                <Timeline data={getTimelineData()} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <Card className="overflow-hidden shadow-elegant border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-foreground">Quick Info</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-muted/30">
                    <span className="text-muted-foreground font-medium">Property Type:</span>
                    <span className="font-bold text-foreground">{property.propertyType}</span>
                  </div>
                  {property.buildingComplete && (
                    <div className="flex justify-between items-center py-3 border-b border-muted/30">
                      <span className="text-muted-foreground font-medium">Completion:</span>
                      <span className="font-bold text-foreground flex items-center">
                        <Calendar className="inline h-4 w-4 mr-2 text-primary" />
                        {new Date(property.buildingComplete).getFullYear()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-3">
                    <span className="text-muted-foreground font-medium">Reference:</span>
                    <span className="font-bold text-foreground">{property.refNo || property.id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Agent Contact */}
            <Card className="overflow-hidden shadow-elegant border-0 bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-foreground">Contact Agent</h3>
                
                {agent && (
                  <div className="flex items-start space-x-4 mb-6 p-4 bg-white/50 rounded-xl">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={agent.image} alt={agent.name} />
                      <AvatarFallback className="text-lg font-bold">{agent.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-lg font-bold text-foreground">{agent.name}</h4>
                      <p className="text-sm text-muted-foreground font-medium">{agent.title}</p>
                      <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground font-medium">5.0</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  {property.contactPhone && (
                    <a
                      href={`tel:${property.contactPhone}`}
                      className="flex items-center w-full p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-all border border-transparent hover:border-primary/30"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Phone</p>
                        <p className="font-bold text-foreground">{property.contactPhone}</p>
                      </div>
                    </a>
                  )}
                  
                  {property.contactEmail && (
                    <a
                      href={`mailto:${property.contactEmail}?subject=Inquiry about ${property.title}`}
                      className="flex items-center w-full p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-all border border-transparent hover:border-primary/30"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Email</p>
                        <p className="font-bold text-foreground">{property.contactEmail}</p>
                      </div>
                    </a>
                  )}
                  
                  <Button className="w-full bg-gradient-primary hover:shadow-glow transition-all" size="lg">
                    <Phone className="h-5 w-5 mr-2" />
                    Schedule Viewing
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Investment Highlights */}
            <Card className="overflow-hidden shadow-elegant border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-foreground">Investment Highlights</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-xl">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">Prime Location</span>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-xl">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">High ROI Potential</span>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-xl">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Star className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">Quality Construction</span>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-xl">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Home className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">Ready for Investment</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Properties Link */}
            <Card className="overflow-hidden shadow-elegant border-0 bg-gradient-to-br from-muted/30 to-muted/20 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-foreground">Interested in Similar Properties?</h3>
                <p className="text-muted-foreground mb-6 text-lg">
                  Browse more properties in {property.location.split(',')[0]}
                </p>
                <Button variant="outline" className="w-full border-2 hover:bg-primary/10" size="lg" asChild>
                  <Link to={`/${property.location.toLowerCase().includes('dubai') ? 'dubai' : 
                              property.location.toLowerCase().includes('cyprus') ? 'cyprus' : 
                              property.location.toLowerCase().includes('mersin') ? 'mersin' : 'antalya'}`}>
                    View Similar Properties
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;