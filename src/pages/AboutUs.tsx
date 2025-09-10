import Navigation from "@/components/Navigation";
import ElevenLabsWidget from "@/components/ElevenLabsWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Globe, Users, Heart, Shield, FileText, Home, CreditCard, Plane, Languages, CheckCircle, Mail, Star, Award, Target, Building } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { ContentSection } from "@/components/ContentSection";
const AboutUs = () => {
  const {
    teamMembers,
    isLoading: teamLoading,
    error: teamError
  } = useTeamMembers();
  const {
    pageTitle,
    metaDescription,
    contentSections,
    heroTitle,
    heroSubtitle,
    isLoading: contentLoading
  } = useWebsiteContent('about-us');
  const services = [{
    icon: <Plane className="w-6 h-6" />,
    title: "FREE PROPERTY VISITS",
    description: "We organize free property visits for our clients"
  }, {
    icon: <FileText className="w-6 h-6" />,
    title: "SALES CONTRACT",
    description: "Professional sales contract preparation"
  }, {
    icon: <CreditCard className="w-6 h-6" />,
    title: "GET YOUR TAX NUMBER",
    description: "Assistance with tax number application"
  }, {
    icon: <Building className="w-6 h-6" />,
    title: "OPEN A BANK ACCOUNT",
    description: "Help with bank account opening"
  }, {
    icon: <Globe className="w-6 h-6" />,
    title: "TRANSLATIONS OF DOCUMENTS",
    description: "Professional document translation services"
  }, {
    icon: <Home className="w-6 h-6" />,
    title: "RECEIVE YOUR TITLE DEED",
    description: "Complete title deed transfer process"
  }, {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "SERVICES SUBSCRIPTIONS",
    description: "Utility and service connections"
  }, {
    icon: <Award className="w-6 h-6" />,
    title: "FURNITURE TOUR",
    description: "Professional furniture selection tours"
  }, {
    icon: <Target className="w-6 h-6" />,
    title: "SELL YOUR PROPERTY",
    description: "Property resale assistance"
  }];
  const languages = ["Norwegian", "Swedish", "English", "Russian", "French", "Arabic", "Farsi", "German", "Urdu"];
  const stats = [{
    number: "500+",
    label: "Happy Clients"
  }, {
    number: "1000+",
    label: "Properties Sold"
  }, {
    number: "3",
    label: "Countries"
  }, {
    number: "9",
    label: "Languages"
  }];
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <SEOHead title={pageTitle || "About Future Homes | International Real Estate Experts"} description={metaDescription || "Trusted international real estate experts. Investment opportunities in Turkey, Dubai, Cyprus & France with citizenship programs. Expert guidance."} keywords="Future Homes, real estate company, property investment experts, international real estate, Turkish citizenship" canonicalUrl="https://futurehomesturkey.com/about-us" />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden min-h-screen flex items-center">
        {/* YouTube Background Video */}
        <div className="absolute inset-0 w-full h-full">
          <iframe className="absolute" src="https://www.youtube.com/embed/xlP2TafgsGI?autoplay=1&mute=1&loop=1&playlist=xlP2TafgsGI&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1" title="About Us Background Video" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen style={{
          pointerEvents: 'none',
          width: 'calc(100vw + 20vh)',
          height: 'calc(100vh + 20vw)',
          minWidth: '177.77vh',
          minHeight: '56.25vw',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(1.2)',
          objectFit: 'cover'
        }} />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 px-4 py-2 bg-white/10 text-white border-white/20">
              About Future Homes
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {heroTitle || "Your Future Real Estate"}
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent"> Partner</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-8">
              {heroSubtitle || "Founder of the company Future Homes, I am proud to accompany you in the search for your future home. We are a European-minded company specialized in the sale of properties in Turkey, France and Dubai."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white border border-white/20 font-medium rounded-full hover:bg-white/20 transition-all duration-300 text-sm">
                Contact Us
                <Mail className="ml-2 w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => <div key={index} className="text-center">
                <div className="bg-card border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dynamic Content Sections */}
        {!contentLoading && contentSections.length > 0 && <section className="py-16">
            {contentSections.map((section, index) => <ContentSection key={index} section={section} />)}
          </section>}

        {/* Values Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built on a foundation of trust, expertise, and unwavering commitment to excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group">
              <Card className="h-full border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Ethics</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We conduct business with the highest ethical standards, ensuring transparency and integrity in every interaction
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="group">
              <Card className="h-full border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Professionalism</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Professional service in every aspect of our work, from initial consultation to final handover
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="group">
              <Card className="h-full border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Globe className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Transparency</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Complete transparency in all our dealings, keeping you informed every step of the way
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Members Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our dedicated professionals are here to guide you through your property investment journey
            </p>
          </div>
          
          {teamLoading ? <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div> : teamError ? <div className="text-center text-muted-foreground">
              <p>Unable to load team members at this time.</p>
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map(member => <Card key={member.id} className="group border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <CardContent className="p-8 text-center">
                    {member.image_url && <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 group-hover:scale-105 transition-transform duration-300">
                        <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                      </div>}
                    <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                    <p className="text-primary font-semibold mb-4">{member.position}</p>
                    {member.bio && <p className="text-muted-foreground text-sm leading-relaxed mb-6">{member.bio}</p>}
                    <div className="flex justify-center gap-4 mb-4">
                      {member.email && <a href={`mailto:${member.email}`} className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300">
                          <Mail className="w-4 h-4" />
                        </a>}
                      {member.phone && <a href={`tel:${member.phone}`} className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300">
                          <Phone className="w-4 h-4" />
                        </a>}
                      {member.linkedin_url && <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300">
                          <Users className="w-4 h-4" />
                        </a>}
                    </div>
                    
                    {/* Contact Information Text */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {member.email && <div className="flex items-center justify-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          <a href={`mailto:${member.email}`} className="hover:text-primary transition-colors">
                            {member.email}
                          </a>
                        </div>}
                      {member.phone && <div className="flex items-center justify-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <a href={`tel:${member.phone}`} className="hover:text-primary transition-colors">
                            {member.phone}
                          </a>
                        </div>}
                    </div>
                  </CardContent>
                </Card>)}
            </div>}
        </section>

        {/* Locations Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Our Locations</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Visit our offices across three countries to discuss your property investment needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Building className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center">Turkey Office</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Antalya, Turkey</p>
                      <p className="text-sm text-muted-foreground">Main headquarters</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <p className="text-sm">+90 552 303 27 50</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <p className="text-sm">info@futurehomesturkey.com</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground text-center">Our main hub for Turkish real estate opportunities and citizenship programs</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Building className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center">France Office</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Strasbourg, France</p>
                      <p className="text-sm text-muted-foreground">European office</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <p className="text-sm">+33 (0)3 XX XX XX XX</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <p className="text-sm">france@futurehomesturkey.com</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground text-center">European headquarters serving international clients across the continent</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500/20 to-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Building className="w-10 h-10 text-amber-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center">Dubai Office</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Dubai, UAE</p>
                      <p className="text-sm text-muted-foreground">Middle East office</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <p className="text-sm">+971 XX XXX XXXX</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <p className="text-sm">dubai@futurehomesturkey.com</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground text-center">Gateway to Middle Eastern luxury properties and investment opportunities</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Languages Section */}
        <section className="py-20">
          <Card className="border-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Languages className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                9 Languages Spoken
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Breaking down language barriers with our multilingual team
              </p>
              
              <div className="flex flex-wrap justify-center gap-3">
                {languages.map((language, index) => <Badge key={index} variant="secondary" className="px-4 py-2 text-sm bg-background/50 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-colors duration-300">
                    {language}
                  </Badge>)}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Services Section */}
        

        {/* Services Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Complete Support Journey
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From property search to settling in, we're with you every step of the way
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => <Card key={index} className="group h-full border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <div className="text-primary">{service.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground mb-2 leading-tight">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </section>
      </div>
      
      {/* ElevenLabs Widget */}
      <ElevenLabsWidget />
    </div>;
};
export default AboutUs;