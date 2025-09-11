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
// Using the exact uploaded image of Batuhan
const batuhanImage = '/lovable-uploads/42060cff-50c3-47c2-afa8-36a1362a17fd.png';

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
     },
     "Batuhan Kunt": {
       name: "Batuhan Kunt",
       image: batuhanImage,
       title: "Property Specialist",
       experience: "Expert in real estate investment and property management",
       specialties: ["Property Investment", "Customer Relations", "International Sales"]
     },
     "Dubai Properties Team": {
       name: "Dubai Properties Team",
       image: batuhanImage, // Using Batuhan's image as placeholder for team
       title: "Property Specialist",
       experience: "Expert team specializing in international property sales",
        specialties: ["International Sales", "Property Investment", "Customer Relations"]
      }
   };
   return agents[agentName] || {
     name: "Batuhan Kunt",
     image: batuhanImage,
     title: "Property Specialist", 
     experience: "Expert in real estate investment and property management",
     specialties: ["Property Investment", "Customer Relations", "International Sales"]
   };
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
        agent: "Batuhan Kunt",
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
      <div className="min-h-screen bg-background">
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
      <div className="min-h-screen bg-background">
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      
      {/* Image Modal */}
      {showImageModal && property.images && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            
            <img
              src={property.images[currentImageIndex] || property.image || "/placeholder.svg"}
              alt={`Property view ${currentImageIndex + 1}`}
              className="max-h-[80vh] max-w-full object-contain rounded-lg"
            />
            
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            
            <div className="text-white text-center mt-4">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pt-24 pb-16 max-w-7xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Properties
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Header */}
            <div className="space-y-4">
              <Badge variant="outline" className="w-fit">
                REF: {property.refNo || property.id}
              </Badge>
              
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {property.title}
              </h1>
              
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{property.location}</span>
              </div>
              
              <div className="text-3xl font-bold text-primary">
                {formatPriceFromString(property.price, formatPrice)}
              </div>
            </div>

            {/* Property Images */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Gallery</h2>
              <div className="space-y-4">
                {/* Main Image */}
                <div 
                  className="relative aspect-[16/10] overflow-hidden rounded-lg cursor-pointer group"
                  onClick={() => setShowImageModal(true)}
                >
                  <img
                    src={property.images?.[currentImageIndex] || property.image || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <Images className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                
                {/* Thumbnail Images */}
                {property.images && property.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {property.images.slice(0, 4).map((image: string, index: number) => (
                      <div
                        key={index}
                        className={`aspect-square overflow-hidden rounded cursor-pointer border-2 transition-all ${
                          currentImageIndex === index ? 'border-primary' : 'border-transparent hover:border-muted-foreground/50'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img
                          src={image}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Basic Property Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-4 border rounded-lg">
                  <Bed className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                    <p className="font-semibold">{property.bedrooms || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg">
                  <Bath className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                    <p className="font-semibold">{property.bathrooms || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg">
                  <Square className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Area</p>
                    <p className="font-semibold">{property.area || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Description */}
            {property.description && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">About This Property</h2>
                <div className="p-6 border rounded-lg bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-900/10 dark:to-indigo-900/5 border-blue-200/50 dark:border-blue-700/30">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {property.description}
                  </p>
                </div>
              </div>
            )}

            {/* Location Details */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Location & Nearby</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.distanceToAirport && (
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <Plane className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Distance to Airport</p>
                      <p className="font-semibold">{property.distanceToAirport}</p>
                    </div>
                  </div>
                )}
                {property.distanceToBeach && (
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <Waves className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Distance to Beach</p>
                      <p className="font-semibold">{property.distanceToBeach}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Features & Amenities */}
            {property.features && property.features.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Features & Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg bg-gradient-to-r from-green-50/50 to-emerald-50/30 dark:from-green-900/10 dark:to-emerald-900/5 border-green-200/50 dark:border-green-700/30 hover:shadow-md transition-all duration-200">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-foreground font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing Details */}
            {property.pricing && property.pricing.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Available Units & Pricing</h2>
                <div className="space-y-3">
                  {property.pricing.map((unit: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="font-semibold">{unit.type}</h3>
                          <p className="text-sm text-muted-foreground">{unit.size}</p>
                        </div>
                        <div className="text-xl font-bold text-primary mt-2 md:mt-0">
                          {formatPriceFromString(unit.price, formatPrice)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Timeline */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Project Timeline</h2>
              <div className="p-6 border rounded-lg">
                <Timeline data={getTimelineData()} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="p-6 border rounded-lg bg-card/80 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Property Type:</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {property.propertyType}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Completion:</span>
                  <span className="font-semibold">
                    {property.buildingComplete 
                      ? new Date(property.buildingComplete).getFullYear()
                      : '2023'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Reference:</span>
                  <span className="font-semibold">{property.refNo || property.id}</span>
                </div>
              </div>
            </div>

            {/* Contact Agent Card - Now Sticky */}
            <div className="sticky top-8 p-6 border rounded-lg bg-gradient-to-br from-primary/5 via-card to-primary/10 backdrop-blur-sm shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-center">Contact Agent</h3>
              
              {agent ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-white/50 to-primary/5 rounded-xl border border-primary/20">
                    <Avatar className="h-14 w-14 ring-2 ring-primary/30">
                      <AvatarImage src={agent.image} />
                      <AvatarFallback className="bg-primary/20 text-primary font-bold">
                        {agent.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-foreground">{agent.name}</h4>
                      <p className="text-sm text-primary font-medium">{agent.title}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-lg border border-blue-200/50 dark:border-blue-700/30">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">{property.contactPhone}</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 rounded-lg border border-green-200/50 dark:border-green-700/30">
                      <Mail className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">{property.contactEmail}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                    <Button variant="outline" className="w-full border-primary/30 hover:border-primary hover:bg-primary/5 text-primary font-medium transition-all duration-300" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-white/50 to-primary/5 rounded-xl border border-primary/20">
                    <Avatar className="h-14 w-14 ring-2 ring-primary/30">
                      <AvatarFallback className="bg-primary/20 text-primary font-bold">EK</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-foreground">{property.agent}</h4>
                      <p className="text-sm text-primary font-medium">Property Specialist</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-lg border border-blue-200/50 dark:border-blue-700/30">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">{property.contactPhone}</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 rounded-lg border border-green-200/50 dark:border-green-700/30">
                      <Mail className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">{property.contactEmail}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                    <Button variant="outline" className="w-full border-primary/30 hover:border-primary hover:bg-primary/5 text-primary font-medium transition-all duration-300" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Investment Highlights */}
            <div className="p-6 border rounded-lg bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/5 border-amber-200/50 dark:border-amber-700/30">
              <h3 className="text-lg font-semibold mb-4 text-center">Investment Highlights</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-white/70 to-amber-50/30 rounded-lg border border-amber-200/30">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Prime Location</p>
                    <p className="text-xs text-muted-foreground">High growth potential area</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-white/70 to-amber-50/30 rounded-lg border border-amber-200/30">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Quality Construction</p>
                    <p className="text-xs text-muted-foreground">Built to international standards</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-white/70 to-amber-50/30 rounded-lg border border-amber-200/30">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center">
                    <Home className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Modern Amenities</p>
                    <p className="text-xs text-muted-foreground">Full range of facilities</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Properties */}
            <div className="p-6 border rounded-lg text-center bg-gradient-to-br from-purple-50 to-indigo-50/50 dark:from-purple-900/10 dark:to-indigo-900/5 border-purple-200/50 dark:border-purple-700/30">
              <h3 className="text-lg font-semibold mb-2">Similar Properties</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Discover more properties in {property.location}
              </p>
              <Link to="/properties">
                <Button size="sm" className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  View Similar Properties
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;