import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { ContentSection } from "@/components/ContentSection";
import ElevenLabsWidget from "@/components/ElevenLabsWidget";
const ContactUs = () => {
  const navigate = useNavigate();
  const { pageTitle, metaDescription, contentSections, isLoading: contentLoading } = useWebsiteContent("contact-us");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    property: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-contact-notification", {
        body: formData,
      });
      if (error) {
        console.error("Error:", error);
        toast.error("Ett fel uppstod när meddelandet skulle skickas. Försök igen.");
      } else {
        console.log("Success:", data);
        navigate("/contact-thank-you");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Ett fel uppstod när meddelandet skulle skickas. Försök igen.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={pageTitle || "Contact Us | Future Homes International"}
        description={
          metaDescription ||
          "Contact Future Homes International for property inquiries. Expert guidance for real estate investment in Turkey, Dubai, Cyprus & Europe."
        }
        keywords="contact future homes, property inquiry, real estate contact, Turkey property contact"
        canonicalUrl="https://futurehomesinternational.com/contact-us"
      />
      <Navigation />

      {/* Dynamic Content Sections */}
      {!contentLoading && contentSections.length > 0}

      {/* Fallback Hero Section */}
      {(contentLoading || contentSections.length === 0) && (
        <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-muted/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Contact Us</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Get in touch with our property experts</p>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Get in Touch</h2>
                <p className="text-lg text-muted-foreground mb-8">We're here to help you find your dream property</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-6 w-6 text-primary" />
                      <CardTitle className="text-lg">Phone</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <a
                      href="tel:+905523032750"
                      className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      +90 552 303 27 50
                    </a>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-6 w-6 text-primary" />
                      <CardTitle className="text-lg">Email</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <a
                      href="mailto:info@futurehomesturkey.com"
                      className="text-muted-foreground hover:text-primary transition-colors cursor-pointer break-all"
                    >
                      info@futurehomesinternational.com
                    </a>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-6 w-6 text-primary" />
                      <CardTitle className="text-lg">Main Office</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Antalya Office</p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-6 w-6 text-primary" />
                      <CardTitle className="text-lg">Working Hours</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  </CardContent>
                </Card>
              </div>

              {/* Office Locations */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">Our Locations</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Antalya Office</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Mersin Office</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Dubai Office</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">France Office</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Send Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you shortly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+90 XXX XXX XX XX"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="property">Property Interest</Label>
                    <Input
                      id="property"
                      placeholder="What type of property are you looking for?"
                      value={formData.property}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your requirements..."
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary-glow text-primary-foreground font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ElevenLabs Conversational AI Widget */}
      <elevenlabs-convai agent-id="agent_01jzfqzb51eha8drdp5z56zavy"></elevenlabs-convai>
    </div>
  );
};
export default ContactUs;
