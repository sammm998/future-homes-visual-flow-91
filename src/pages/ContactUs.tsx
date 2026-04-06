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
import { useTranslation } from "@/hooks/useTranslation";

const ContactUs = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { pageTitle, metaDescription, contentSections, isLoading: contentLoading } = useWebsiteContent("contact-us");
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", property: "", message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-contact-notification", {
        body: { ...formData, source: "contact-form" },
      });
      if (error || data?.success === false) {
        const messageFromApi = (data as any)?.error?.message as string | undefined;
        console.warn("Contact notification failed:", error ?? data);
        toast.error(messageFromApi?.includes("Too many requests")
          ? "Too many requests. Please wait and try again."
          : "An error occurred. Please try again.");
        return;
      }
      navigate("/contact-thank-you");
    } catch (error) {
      console.warn("Error sending message:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={pageTitle || "Contact Future Homes International | Property Investment Inquiry"}
        description={metaDescription || "Contact Future Homes International for expert property guidance."}
        keywords="contact future homes, property inquiry Turkey, real estate consultation"
        canonicalUrl="https://futurehomesinternational.com/contact-us"
      />
      <Navigation />

      {!contentLoading && contentSections.length > 0}

      {(contentLoading || contentSections.length === 0) && (
        <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-muted/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t('contact.title')}</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('contact.subtitle')}</p>
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">{t('contact.get_in_touch')}</h2>
                <p className="text-lg text-muted-foreground mb-8">{t('contact.help_text')}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-6 w-6 text-primary" />
                      <CardTitle className="text-lg">{t('contact.phone')}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <a href="tel:+905523032750" className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">+90 552 303 27 50</a>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-6 w-6 text-primary" />
                      <CardTitle className="text-lg">{t('contact.email')}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <a href="mailto:info@futurehomesinternational.com" className="text-muted-foreground hover:text-primary transition-colors cursor-pointer break-all">info@futurehomesinternational.com</a>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-6 w-6 text-primary" />
                      <CardTitle className="text-lg">{t('contact.main_office')}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{t('contact.antalya_office')}</p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-6 w-6 text-primary" />
                      <CardTitle className="text-lg">{t('contact.working_hours')}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{t('contact.hours_text')}</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">{t('contact.our_locations')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2"><MapPin className="h-4 w-4 text-primary" /><span className="text-muted-foreground">{t('contact.antalya_office')}</span></div>
                  <div className="flex items-center space-x-2"><MapPin className="h-4 w-4 text-primary" /><span className="text-muted-foreground">{t('contact.mersin_office')}</span></div>
                  <div className="flex items-center space-x-2"><MapPin className="h-4 w-4 text-primary" /><span className="text-muted-foreground">{t('contact.dubai_office')}</span></div>
                  <div className="flex items-center space-x-2"><MapPin className="h-4 w-4 text-primary" /><span className="text-muted-foreground">{t('contact.france_office')}</span></div>
                </div>
              </div>
            </div>

            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">{t('contact.send_message')}</CardTitle>
                <CardDescription>{t('contact.form_subtitle')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t('contact.first_name')}</Label>
                      <Input id="firstName" placeholder={t('contact.first_name')} value={formData.firstName} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t('contact.last_name')}</Label>
                      <Input id="lastName" placeholder={t('contact.last_name')} value={formData.lastName} onChange={handleInputChange} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('contact.email')}</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" value={formData.email} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('contact.phone_number')}</Label>
                    <Input id="phone" placeholder="+90 XXX XXX XX XX" value={formData.phone} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="property">{t('contact.property_interest')}</Label>
                    <Input id="property" placeholder={t('contact.property_interest_placeholder')} value={formData.property} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t('contact.message')}</Label>
                    <Textarea id="message" placeholder={t('contact.message_placeholder')} rows={4} value={formData.message} onChange={handleInputChange} required />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary-glow text-primary-foreground font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? t('contact.sending') : t('contact.send_message')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};
export default ContactUs;
