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
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-32">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading property details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || dbError) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-32">
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <Home className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-foreground mb-2">Property Not Found</h1>
                <p className="text-muted-foreground mb-6">
                  {error || dbError || `Sorry, we couldn't find the property you're looking for.`}
                </p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate(-1)} 
                  variant="outline" 
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
                
                <Button 
                  onClick={() => navigate('/')} 
                  className="w-full"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>
              
              <div className="mt-8 p-4 bg-muted rounded-lg">
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
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-32">
          <div className="text-center py-20">
            <Home className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Property Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/')} className="inline-flex items-center">
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Image Modal */}
      {showImageModal && property.images && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10"
            >
              <X className="h-8 w-8" />
            </button>
            
            <div className="relative">
              <img
                src={property.images[currentImageIndex] || property.image || "/placeholder.svg"}
                alt={`Property view ${currentImageIndex + 1}`}
                className="max-h-[85vh] max-w-full object-contain"
              />
              
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
            
            <div className="text-white text-center mt-4">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pt-32 pb-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-muted/50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Properties
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  REF: {property.refNo || property.id}
                </Badge>
                {property.status && (
                  <Badge variant="outline" className="text-xs">
                    {property.status}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {property.title}
              </h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{property.location}</span>
              </div>
              <div className="text-3xl font-bold text-primary">
                {formatPrice(property.price)}
              </div>
            </div>

            {/* Property Images */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={property.images?.[currentImageIndex] || property.image || "/placeholder.svg"}
                    alt="Property"
                    className="w-full h-96 object-cover rounded-t-lg cursor-pointer"
                    onClick={() => setShowImageModal(true)}
                  />
                  
                  {property.images && property.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={() => setShowImageModal(true)}
                        className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full hover:bg-opacity-70 transition-all text-sm flex items-center gap-1"
                      >
                        <Images className="h-4 w-4" />
                        {currentImageIndex + 1}/{property.images.length}
                      </button>
                    </>
                  )}
                </div>
                
                {property.images && property.images.length > 1 && (
                  <div className="p-4 grid grid-cols-6 gap-2">
                    {property.images.slice(0, 6).map((img: string, index: number) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className={`w-full h-16 object-cover rounded cursor-pointer transition-all ${
                          index === currentImageIndex 
                            ? 'ring-2 ring-primary' 
                            : 'hover:opacity-80'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Property Details</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {property.bedrooms && (
                    <div className="flex items-center space-x-2">
                      <Bed className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Bedrooms</p>
                        <p className="font-medium">{property.bedrooms}</p>
                      </div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center space-x-2">
                      <Bath className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Bathrooms</p>
                        <p className="font-medium">{property.bathrooms}</p>
                      </div>
                    </div>
                  )}
                  {property.area && (
                    <div className="flex items-center space-x-2">
                      <Square className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Area</p>
                        <p className="font-medium">{property.area}m²</p>
                      </div>
                    </div>
                  )}
                  {property.propertyType && (
                    <div className="flex items-center space-x-2">
                      <Home className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="font-medium">{property.propertyType}</p>
                      </div>
                    </div>
                  )}
                </div>

                {property.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {property.description}
                    </p>
                  </div>
                )}

                {/* Location Details */}
                {(property.distanceToAirport || property.distanceToBeach) && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Location & Accessibility</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {property.distanceToAirport && (
                        <div className="flex items-center space-x-2">
                          <Plane className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Airport</p>
                            <p className="font-medium">{property.distanceToAirport}</p>
                          </div>
                        </div>
                      )}
                      {property.distanceToBeach && (
                        <div className="flex items-center space-x-2">
                          <Waves className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Beach</p>
                            <p className="font-medium">{property.distanceToBeach}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Features & Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {property.features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-muted/50 rounded">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing Information */}
            {property.pricing && property.pricing.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Available Options</h2>
                  <div className="space-y-4">
                    {property.pricing.map((option: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{option.type}</h3>
                          <p className="text-sm text-muted-foreground">{option.size}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-primary">
                            {formatPrice(option.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Project Timeline */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Project Timeline</h2>
                <Timeline data={getTimelineData()} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property Type:</span>
                    <span className="font-medium">{property.propertyType}</span>
                  </div>
                  {property.buildingComplete && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Completion:</span>
                      <span className="font-medium">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        {new Date(property.buildingComplete).getFullYear()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reference:</span>
                    <span className="font-medium">{property.refNo || property.id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Agent Contact */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Agent</h3>
                
                {agent && (
                  <div className="flex items-start space-x-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={agent.image} alt={agent.name} />
                      <AvatarFallback>{agent.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{agent.name}</h4>
                      <p className="text-sm text-muted-foreground">{agent.title}</p>
                      <div className="flex items-center mt-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="ml-1 text-xs text-muted-foreground">5.0</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  {property.contactPhone && (
                    <a
                      href={`tel:${property.contactPhone}`}
                      className="flex items-center w-full p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Phone className="h-4 w-4 mr-3 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{property.contactPhone}</p>
                      </div>
                    </a>
                  )}
                  
                  {property.contactEmail && (
                    <a
                      href={`mailto:${property.contactEmail}?subject=Inquiry about ${property.title}`}
                      className="flex items-center w-full p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Mail className="h-4 w-4 mr-3 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{property.contactEmail}</p>
                      </div>
                    </a>
                  )}
                  
                  <Button className="w-full" size="lg">
                    <Phone className="h-4 w-4 mr-2" />
                    Schedule Viewing
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Investment Highlights */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Investment Highlights</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-sm">Prime Location</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">High ROI Potential</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="text-sm">Quality Construction</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Home className="h-4 w-4 text-primary" />
                    <span className="text-sm">Ready for Investment</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Properties Link */}
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Interested in Similar Properties?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Browse more properties in {property.location.split(',')[0]}
                </p>
                <Button variant="outline" className="w-full" asChild>
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
