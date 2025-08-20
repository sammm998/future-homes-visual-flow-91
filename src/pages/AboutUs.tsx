import Navigation from "@/components/Navigation";
import ElevenLabsWidget from "@/components/ElevenLabsWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { MapPin, Phone, Globe, Users, Heart, Shield, FileText, Home, CreditCard, Plane, Languages, CheckCircle } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { useTeamMembers } from "@/hooks/useTeamMembers";


const AboutUs = () => {
  const { teamMembers, isLoading: teamLoading, error: teamError } = useTeamMembers();
  
  console.log('Team members state:', { teamMembers, teamLoading, teamError });

  const services = [
    { icon: <Plane className="w-8 h-8" />, title: "FREE PROPERTY VISITS", description: "We organize free property visits for our clients" },
    { icon: <FileText className="w-8 h-8" />, title: "SALES CONTRACT", description: "Professional sales contract preparation" },
    { icon: <CreditCard className="w-8 h-8" />, title: "GET YOUR TAX NUMBER", description: "Assistance with tax number application" },
    { icon: <CreditCard className="w-8 h-8" />, title: "OPEN A BANK ACCOUNT", description: "Help with bank account opening" },
    { icon: <FileText className="w-8 h-8" />, title: "TRANSLATIONS OF DOCUMENTS", description: "Professional document translation services" },
    { icon: <Home className="w-8 h-8" />, title: "RECEIVE YOUR TITLE DEED", description: "Complete title deed transfer process" },
    { icon: <CheckCircle className="w-8 h-8" />, title: "SERVICES SUBSCRIPTIONS", description: "Utility and service connections" },
    { icon: <Home className="w-8 h-8" />, title: "FURNITURE TOUR", description: "Professional furniture selection tours" },
    { icon: <CreditCard className="w-8 h-8" />, title: "SELL YOUR PROPERTY", description: "Property resale assistance" }
  ];

  const languages = [
    "Norwegian", "Swedish", "English", "Russian", 
    "French", "Arabic", "Farsi", "German", "Urdu"
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="About Future Homes | International Real Estate Experts"
        description="Trusted international real estate experts. Investment opportunities in Turkey, Dubai, Cyprus & France with citizenship programs. Expert guidance."
        keywords="Future Homes, real estate company, property investment experts, international real estate, Turkish citizenship"
        canonicalUrl="https://futurehomesturkey.com/about-us"
      />
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4">About Future Homes</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Your Future Real Estate Partner
          </h1>
          <div className="max-w-4xl mx-auto">
            <TextGenerateEffect
              words="Founder of the company Future Homes, I am proud to accompany you in the search for your future home. My name is Ali Karan and I am the founder of the company Future Homes in Turkey, France and Dubai. I am very proud to help you along the way as you search for your future home. We are a European-minded company specialized in the sale of properties in Turkey, France and Dubai. We have central offices in Antalya, Mersin, in France (Strasbourg) and in Dubai. At Future Homes, we work tirelessly to satisfy the customer's wishes and needs. We want to give you the best service and personal follow-up to ensure that you have a safe and good experience."
              className="text-lg text-muted-foreground leading-relaxed mb-8"
              filter={false}
              duration={0.8}
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-primary/5 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground">
              Our values are strongly rooted in good ethics, professionalism and transparency.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ethics</h3>
              <p className="text-muted-foreground">We conduct business with the highest ethical standards</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Professionalism</h3>
              <p className="text-muted-foreground">Professional service in every aspect of our work</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Transparency</h3>
              <p className="text-muted-foreground">Complete transparency in all our dealings</p>
            </div>
          </div>
        </div>

        {/* Locations Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Future Homes Locations</h2>
            <p className="text-lg text-muted-foreground">Where can you find real estate with Future Homes?</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Turkey</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Antalya, Mersin</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>France</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Strasbourg Office</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Dubai</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Dubai Office</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Languages Section */}
        <div className="bg-secondary/20 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <Languages className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-4">OUR TEAM SPEAKS 9 DIFFERENT LANGUAGES</h2>
            <p className="text-lg text-muted-foreground">
              To achieve this, we have a strong team behind us who speak multiple languages fluently.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {languages.map((language, index) => (
              <Badge key={index} variant="secondary" className="text-sm px-4 py-2">
                {language}
              </Badge>
            ))}
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">WE ARE WITH YOU BEFORE AND AFTER SALES</h2>
            <p className="text-lg text-muted-foreground">Comprehensive services throughout your property journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-primary">{service.icon}</div>
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground">
              Our experienced professionals are here to guide you through your property journey
            </p>
          </div>
          
          {teamError && (
            <div className="flex justify-center items-center py-12">
              <div className="text-red-500">Error loading team members: {teamError}</div>
            </div>
          )}
          
          {teamLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-muted-foreground">No team members found</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <Card key={member.id} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-24 h-24 mx-auto mb-4">
                      <img 
                        src={member.image_url || '/placeholder.svg'} 
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (target.src !== '/placeholder.svg') {
                            target.src = '/placeholder.svg';
                          }
                        }}
                      />
                    </div>
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <p className="text-primary font-medium">{member.position}</p>
                    {member.bio && (
                      <p className="text-muted-foreground text-sm mt-2">{member.bio}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {member.phone && (
                        <div className="flex items-center justify-center">
                          <Phone className="w-4 h-4 mr-2" />
                          <span className="text-muted-foreground">{member.phone}</span>
                        </div>
          )}
                      {member.email && (
                        <div className="flex items-center justify-center">
                          <Globe className="w-4 h-4 mr-2" />
                          <a href={`mailto:${member.email}`} className="text-muted-foreground hover:text-primary">
                            {member.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* ElevenLabs Widget */}
      <ElevenLabsWidget />
    </div>
  );
};

export default AboutUs;