import React from 'react';
import Navigation from '@/components/Navigation';
import { EnhancedSEOHead } from '@/components/EnhancedSEOHead';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';
import FAQSchema from '@/components/FAQSchema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, Euro, Wifi, Waves, Car } from 'lucide-react';
import { Link } from 'react-router-dom';

const ApartmentsForSaleInTurkey = () => {
  const faqItems = [
    {
      question: "What types of apartments are available in Turkey?",
      answer: "Turkey offers various apartment types including studio, 1+1, 2+1, 3+1, and penthouse apartments. Most modern developments include amenities like pools, gyms, and 24/7 security."
    },
    {
      question: "What is the average price of apartments in Turkey?",
      answer: "Apartment prices vary by location. In Antalya, expect €85,000-€300,000. Alanya ranges €65,000-€250,000. Istanbul and premium locations can reach €500,000+."
    },
    {
      question: "Are apartments good rental investments in Turkey?",
      answer: "Yes, apartments in tourist areas typically yield 6-8% annually. Beachfront and city center locations have higher demand and rental potential."
    },
    {
      question: "What amenities do Turkish apartment complexes offer?",
      answer: "Modern complexes include swimming pools, fitness centers, sauna, 24/7 security, parking, gardens, children's playgrounds, and sometimes spa facilities."
    }
  ];

  const apartmentTypes = [
    {
      type: "Studio Apartments",
      bedrooms: "Studio",
      size: "35-50 m²",
      priceRange: "€45,000 - €120,000",
      description: "Perfect for investment or holiday use",
      features: ["Open plan living", "Compact design", "High rental yield"]
    },
    {
      type: "1+1 Apartments",
      bedrooms: "1 Bedroom",
      size: "50-70 m²",
      priceRange: "€65,000 - €180,000",
      description: "Ideal for couples or single professionals",
      features: ["Separate bedroom", "Modern kitchen", "Balcony/terrace"]
    },
    {
      type: "2+1 Apartments",
      bedrooms: "2 Bedrooms",
      size: "80-120 m²",
      priceRange: "€95,000 - €350,000",
      description: "Popular choice for families",
      features: ["Family friendly", "Multiple bathrooms", "Spacious living"]
    },
    {
      type: "3+1 Apartments",
      bedrooms: "3 Bedrooms",
      size: "120-160 m²",
      priceRange: "€150,000 - €500,000",
      description: "Luxury family living with space",
      features: ["Multiple bedrooms", "Large terraces", "Premium finishes"]
    }
  ];

  const locations = [
    {
      city: "Antalya",
      apartments: "300+",
      priceRange: "€85,000 - €400,000",
      highlights: ["Beachfront locations", "City center", "Konyaaltı", "Lara Beach"],
      description: "Turkey's tourism capital with year-round rental demand"
    },
    {
      city: "Alanya",
      apartments: "250+",
      priceRange: "€65,000 - €300,000",
      highlights: ["Mahmutlar", "Kestel", "Tosmur", "Castle area"],
      description: "Popular expat destination with great weather"
    },
    {
      city: "Mersin",
      apartments: "150+",
      priceRange: "€45,000 - €200,000",
      highlights: ["Emerging market", "Great value", "New developments"],
      description: "Excellent investment opportunity with growth potential"
    }
  ];

  const amenities = [
    { icon: Waves, name: "Swimming Pool", description: "Outdoor and indoor pools" },
    { icon: Car, name: "Parking", description: "Underground or covered parking" },
    { icon: Wifi, name: "Modern Facilities", description: "Gym, sauna, spa facilities" },
    { icon: Building, name: "24/7 Security", description: "Gated complex with security" }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Apartments for Sale in Turkey",
    "description": "Find luxury apartments for sale in Turkey. Modern 1-4 bedroom apartments in prime locations. Beachfront, city center & investment options available.",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://futurehomesturkey.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Property for Sale in Turkey",
          "item": "https://futurehomesturkey.com/property-for-sale-in-turkey"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Apartments for Sale in Turkey"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEOHead
        title="Apartments for Sale | Modern Living Spaces"
        description="Find luxury apartments for sale. Modern 1-4 bedroom apartments in prime locations. Beachfront, city center & investment options available."
        keywords={['Apartments for sale', 'Luxury apartments', 'Beachfront apartments', 'Modern apartments', 'apartment investment']}
        canonical="https://futurehomesturkey.com/apartments-for-sale"
        structuredData={structuredData}
      />
      
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <BreadcrumbNavigation 
          items={[
            { name: 'Property for Sale in Turkey', url: '/property-for-sale-in-turkey' },
            { name: 'Apartments for Sale in Turkey', url: '/apartments-for-sale-in-turkey' }
          ]}
        />

        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Apartments for Sale in Turkey
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover modern apartments for sale in Turkey's most desirable locations. From beachfront studios to luxury penthouses, find the perfect apartment with premium amenities and excellent investment potential.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/properties?type=apartment">View All Apartments</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Get Property Advice</Link>
            </Button>
          </div>
        </section>

        {/* Apartment Types */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Apartment Types & Prices</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {apartmentTypes.map((apt, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{apt.type}</CardTitle>
                    <Badge variant="secondary">{apt.bedrooms}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{apt.size}</p>
                  <p className="text-lg font-semibold text-primary">{apt.priceRange}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{apt.description}</p>
                  <ul className="space-y-1 text-sm">
                    {apt.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Locations */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Locations for Apartments</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {locations.map((location, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 text-primary mr-2" />
                      {location.city}
                    </CardTitle>
                    <Badge>{location.apartments}</Badge>
                  </div>
                  <p className="text-lg font-semibold text-primary">{location.priceRange}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{location.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium">Popular Areas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {location.highlights.map((area, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button asChild className="w-full mt-4">
                    <Link to={`/${location.city.toLowerCase()}`}>View {location.city} Apartments</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Amenities */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Standard Apartment Complex Amenities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {amenities.map((amenity, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <amenity.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-lg">{amenity.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{amenity.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Investment Information */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Investment Potential</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Euro className="h-6 w-6 text-primary mr-2" />
                    Rental Yields
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Beachfront Apartments:</span>
                      <span className="font-semibold">7-9% annually</span>
                    </div>
                    <div className="flex justify-between">
                      <span>City Center:</span>
                      <span className="font-semibold">6-8% annually</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Holiday Complexes:</span>
                      <span className="font-semibold">8-12% annually</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Off-plan Discount:</span>
                      <span className="font-semibold">10-20% below market</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Why Apartments Are Great Investments</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></span>
                      <span>Lower entry cost compared to villas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></span>
                      <span>Easier to rent and manage</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></span>
                      <span>Shared amenities reduce costs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></span>
                      <span>High demand from tourists and expats</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></span>
                      <span>Professional property management available</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-6">Find Your Perfect Apartment in Turkey</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Browse our extensive collection of apartments for sale in Turkey's most desirable locations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/properties?type=apartment">Browse Apartments</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Get Expert Advice</Link>
            </Button>
          </div>
        </section>
      </main>

      <FAQSchema faqItems={faqItems} />
    </div>
  );
};

export default ApartmentsForSaleInTurkey;