import Navigation from "@/components/Navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Globe, Users, Heart, Shield, FileText, Home, CreditCard, Plane, Languages, CheckCircle, Mail, Star, Award, Target, Building } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { ContentSection } from "@/components/ContentSection";
import { useTranslation } from "@/hooks/useTranslation";

const AboutUs = () => {
  const { t } = useTranslation();
  const { teamMembers, isLoading: teamLoading, error: teamError } = useTeamMembers();
  const { pageTitle, metaDescription, contentSections, heroTitle, heroSubtitle, isLoading: contentLoading } = useWebsiteContent("about-us");

  const services = [
    { icon: <Plane className="w-6 h-6" />, title: t('services.free_visits'), description: t('services.free_visits_desc') },
    { icon: <FileText className="w-6 h-6" />, title: t('services.sales_contract'), description: t('services.sales_contract_desc') },
    { icon: <CreditCard className="w-6 h-6" />, title: t('services.tax_number'), description: t('services.tax_number_desc') },
    { icon: <Building className="w-6 h-6" />, title: t('services.bank_account'), description: t('services.bank_account_desc') },
    { icon: <Globe className="w-6 h-6" />, title: t('services.translations'), description: t('services.translations_desc') },
    { icon: <Home className="w-6 h-6" />, title: t('services.title_deed'), description: t('services.title_deed_desc') },
    { icon: <CheckCircle className="w-6 h-6" />, title: t('services.subscriptions'), description: t('services.subscriptions_desc') },
    { icon: <Award className="w-6 h-6" />, title: t('services.furniture'), description: t('services.furniture_desc') },
    { icon: <Target className="w-6 h-6" />, title: t('services.sell_property'), description: t('services.sell_property_desc') },
  ];
  const languages = ["Norwegian", "Swedish", "English", "Russian", "French", "Arabic", "Farsi", "German", "Urdu"];
  const stats = [
    { number: "1000+", label: t('about.stat_clients') },
    { number: "1000+", label: t('about.stat_properties') },
    { number: "3", label: t('about.stat_countries') },
    { number: "9", label: t('about.stat_languages') },
  ];

  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <SEOHead title={pageTitle || "About Future Homes International | Leading Global Real Estate Experts"} description={metaDescription || "Leading international real estate experts since 2010."} canonicalUrl="https://futurehomesinternational.com/about-us" />
      <Navigation />

      <section className="relative py-20 overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 w-full h-full">
          <iframe className="absolute" src="https://www.youtube.com/embed/xlP2TafgsGI?autoplay=1&mute=1&loop=1&playlist=xlP2TafgsGI&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1" title="About Us Background Video" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen style={{ pointerEvents: "none", width: "calc(100vw + 20vh)", height: "calc(100vh + 20vw)", minWidth: "177.77vh", minHeight: "56.25vw", top: "50%", left: "50%", transform: "translate(-50%, -50%) scale(1.2)", objectFit: "cover" }} />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 px-4 py-2 bg-white/10 text-white border-white/20">{t('about.badge')}</Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {heroTitle || t('about.hero_title')}
            </h1>
            <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-8">
              {heroSubtitle || t('about.hero_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact-us" className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white border border-white/20 font-medium rounded-full hover:bg-white/20 transition-all duration-300 text-sm">
                {t('about.contact_us')}
                <Mail className="ml-2 w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => <div key={index} className="text-center">
                <div className="bg-card border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!contentLoading && contentSections.length > 0 && <section className="py-16">
            {contentSections.map((section, index) => <ContentSection key={index} section={section} />)}
          </section>}

        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t('about.values_title')}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('about.values_subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: t('about.value_ethics'), desc: t('about.value_ethics_desc') },
              { icon: Shield, title: t('about.value_professionalism'), desc: t('about.value_professionalism_desc') },
              { icon: Globe, title: t('about.value_transparency'), desc: t('about.value_transparency_desc') },
            ].map((v, i) => (
              <div key={i} className="group">
                <Card className="h-full border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <v.icon className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{v.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t('about.team_title')}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('about.team_subtitle')}</p>
          </div>

          {teamLoading ? <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div> : teamError ? <div className="text-center text-muted-foreground">
              <p>{t('about.team_loading_error')}</p>
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map(member => <Card key={member.id} className="group border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <CardContent className="p-8 text-center">
                    {member.image_url && <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 group-hover:scale-105 transition-transform duration-300">
                        <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                      </div>}
                    <h3 className="text-2xl font-bold mb-2 notranslate" translate="no">{member.name}</h3>
                    <p className="text-primary font-semibold mb-4">{member.position}</p>
                    {member.bio && <p className="text-muted-foreground text-sm leading-relaxed mb-6">{member.bio}</p>}
                    <div className="flex justify-center gap-4 mb-4">
                      {member.email && <a href={`mailto:${member.email}`} className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300"><Mail className="w-4 h-4" /></a>}
                      {member.phone && <a href={`tel:${member.phone}`} className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300"><Phone className="w-4 h-4" /></a>}
                      {member.linkedin_url && <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300"><Users className="w-4 h-4" /></a>}
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {member.email && <div className="flex items-center justify-center gap-2"><Mail className="w-4 h-4 text-primary" /><a href={`mailto:${member.email}`} className="hover:text-primary transition-colors">{member.email}</a></div>}
                      {member.phone && <div className="flex items-center justify-center gap-2"><Phone className="w-4 h-4 text-primary" /><a href={`tel:${member.phone}`} className="hover:text-primary transition-colors">{member.phone}</a></div>}
                    </div>
                  </CardContent>
                </Card>)}
            </div>}
        </section>

        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t('about.locations_title')}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('about.locations_subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { color: 'blue', title: t('about.antalya_office'), city: 'Antalya, Turkey', sub: t('about.antalya_main'), phone: '+90 552 303 27 50', desc: t('about.antalya_desc') },
              { color: 'red', title: t('about.mersin_office'), city: 'Mersin, Turkey', sub: t('about.mersin_regional'), phone: '+90 552 303 27 50', desc: t('about.mersin_desc') },
              { color: 'green', title: t('about.france_office'), city: 'Strasbourg, France', sub: t('about.france_european'), phone: '+33 6 51 01 01 56', desc: t('about.france_desc') },
              { color: 'amber', title: t('about.dubai_office'), city: 'Dubai, UAE', sub: t('about.dubai_middle_east'), phone: '+971 54 554 2068', desc: t('about.dubai_desc') },
            ].map((office, i) => (
              <Card key={i} className="group border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className={`w-20 h-20 bg-gradient-to-br from-${office.color}-500/20 to-${office.color}-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Building className={`w-10 h-10 text-${office.color}-500`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-center">{office.title}</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className={`w-5 h-5 text-${office.color}-500 mt-0.5 flex-shrink-0`} />
                      <div>
                        <p className="font-semibold text-sm notranslate" translate="no">{office.city}</p>
                        <p className="text-sm text-muted-foreground">{office.sub}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className={`w-5 h-5 text-${office.color}-500 flex-shrink-0`} />
                      <a href={`tel:${office.phone.replace(/\s/g, '')}`} className={`text-sm text-${office.color}-600 hover:text-${office.color}-800 transition-colors cursor-pointer notranslate`} translate="no">{office.phone}</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className={`w-5 h-5 text-${office.color}-500 flex-shrink-0`} />
                      <a href="mailto:info@futurehomesinternational.com" className={`text-sm text-${office.color}-600 hover:text-${office.color}-800 transition-colors cursor-pointer break-all notranslate`} translate="no">info@futurehomesinternational.com</a>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground text-center">{office.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="py-20">
          <Card className="border-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Languages className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t('about.languages_title')}</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">{t('about.languages_subtitle')}</p>
              <div className="flex flex-wrap justify-center gap-3">
                {languages.map((language, index) => <Badge key={index} variant="secondary" className="px-4 py-2 text-sm bg-background/50 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-colors duration-300">{language}</Badge>)}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t('about.support_title')}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('about.support_subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => <Card key={index} className="group h-full border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <div className="text-primary">{service.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground mb-2 leading-tight">{service.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </section>
      </div>
    </div>;
};
export default AboutUs;
