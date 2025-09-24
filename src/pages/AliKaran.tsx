import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import SEOHead from "@/components/SEOHead";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Award, Users, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import aliKaranImage from "@/assets/ali-karan-founder.png";
import ElevenLabsWidget from "@/components/ElevenLabsWidget";

export default function AliKaran() {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Meet Ali Karan - Founder & CEO | International Property Expert"
        description="Learn about Ali Karan, founder and CEO of our international property investment company. With 6 years of experience in real estate across Turkey, Dubai, Cyprus, and more."
        keywords="Ali Karan, property investment expert, international real estate, CEO founder, Turkey properties, Dubai real estate"
      />

      <Navigation />

      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
            <Link to="/" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-12 items-center mb-16"
        >
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Meet Ali Karan
              </h1>
              <p className="text-xl text-muted-foreground mb-2">
                Founder & CEO
              </p>
              <p className="text-lg text-primary font-semibold">
                International Property Investment Expert
              </p>
            </div>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              With 6 years of experience in international real estate, Ali Karan has helped over 1000 clients find their perfect property investments across Turkey, Dubai, Cyprus, and beyond.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Award className="w-5 h-5 text-primary" />
                <span>6 Years Experience</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-5 h-5 text-primary" />
                <span>1000+ Happy Clients</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary" />
                <span>4 Countries</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              {!imageError ? (
                <img 
                  src={aliKaranImage}
                  alt="Ali Karan - Founder and CEO"
                  className="w-full h-auto object-cover"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center rounded-2xl">
                  <div className="text-center">
                    <Users className="w-24 h-24 text-primary mx-auto mb-4" />
                    <p className="text-lg font-semibold text-foreground">Ali Karan</p>
                    <p className="text-muted-foreground">Founder & CEO</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid lg:grid-cols-3 gap-8 mb-16"
        >
          <Card className="p-6 col-span-full lg:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-4">About Ali Karan</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Ali Karan began his journey in real estate in 2008, starting with local property investments in Turkey. His vision was simple: help people find not just properties, but homes and investment opportunities that would change their lives.
              </p>
              <p>
                Over the years, Ali expanded his expertise across multiple international markets including Dubai, Cyprus, Bali, and various European destinations. His deep understanding of local markets, legal requirements, and investment potential has made him a trusted advisor for clients worldwide.
              </p>
              <p>
                Today, Ali leads a team of international property experts, combining traditional relationship-building with modern technology to provide unparalleled service to clients seeking their perfect property investment.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Achievements</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Industry Leader</p>
                  <p className="text-sm text-muted-foreground">Top 1% of international property consultants</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Client Success</p>
                  <p className="text-sm text-muted-foreground">1000+ successful property transactions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Global Reach</p>
                  <p className="text-sm text-muted-foreground">Operations in 4 countries</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Expertise Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Areas of Expertise</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Turkey Real Estate",
                description: "Citizenship by investment, luxury properties, coastal developments",
                icon: "🇹🇷"
              },
              {
                title: "Dubai Properties",
                description: "Off-plan investments, luxury apartments, commercial real estate",
                icon: "🇦🇪"
              },
              {
                title: "Cyprus Investments",
                description: "EU citizenship programs, vacation homes, rental properties",
                icon: "🇨🇾"
              },
              {
                title: "European Markets",
                description: "Golden visa programs, luxury estates, investment opportunities",
                icon: "🇪🇺"
              }
            ].map((expertise, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{expertise.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">{expertise.title}</h3>
                <p className="text-sm text-muted-foreground">{expertise.description}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Card className="p-8 bg-gradient-to-r from-primary/5 to-primary-glow/5 border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Start Your Property Journey?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Connect with Ali Karan and discover how international property investment can transform your financial future.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/contact-us">
                  <Phone className="w-4 h-4 mr-2" />
                  Schedule Consultation
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/property-gallery">
                  <MapPin className="w-4 h-4 mr-2" />
                  View Properties
                </Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      <ElevenLabsWidget />
    </div>
  );
}