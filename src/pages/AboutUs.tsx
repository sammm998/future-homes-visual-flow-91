import Navigation from "@/components/Navigation";
import { PublicPageHero, EditorialSectionHeader, EditorialCta } from "@/components/PublicEditorial";
import aboutHero from "@/assets/about-hero.jpg";
import antalyaImage from "@/assets/destinations/antalya-cinematic.webp";
import mersinImage from "@/assets/destinations/mersin-cinematic.webp";
import dubaiImage from "@/assets/destinations/dubai-cinematic.webp";
import baliImage from "@/assets/destinations/bali-cinematic.webp";
import strasbourgImage from "@/assets/destinations/strasbourg-cinematic.webp";
import { MapPin, Phone, Mail, Linkedin, Building2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { ContentSection } from "@/components/ContentSection";
import { useTranslation } from "@/hooks/useTranslation";
import { getOptimizedImageUrl } from "@/utils/imageOptimization";

const AboutUs = () => {
  const { t } = useTranslation();
  const { teamMembers, isLoading: teamLoading, error: teamError } = useTeamMembers();
  const { pageTitle, metaDescription, contentSections, heroTitle, heroSubtitle, isLoading: contentLoading } = useWebsiteContent("about-us");

  const services = [
    { title: t('services.free_visits'), description: t('services.free_visits_desc') },
    { title: t('services.sales_contract'), description: t('services.sales_contract_desc') },
    { title: t('services.tax_number'), description: t('services.tax_number_desc') },
    { title: t('services.bank_account'), description: t('services.bank_account_desc') },
    { title: t('services.translations'), description: t('services.translations_desc') },
    { title: t('services.title_deed'), description: t('services.title_deed_desc') },
    { title: t('services.subscriptions'), description: t('services.subscriptions_desc') },
    { title: t('services.furniture'), description: t('services.furniture_desc') },
    { title: t('services.sell_property'), description: t('services.sell_property_desc') },
  ];
  const languages = ["Norwegian", "Swedish", "English", "Russian", "French", "Arabic", "Farsi", "German", "Urdu"];
  const stats = [
    { number: "1000+", label: t('about.stat_clients') },
    { number: "1000+", label: t('about.stat_properties') },
    { number: "3", label: t('about.stat_countries') },
    { number: "9", label: t('about.stat_languages') },
  ];
  const values = [
    { title: t('about.value_ethics'), desc: t('about.value_ethics_desc') },
    { title: t('about.value_professionalism'), desc: t('about.value_professionalism_desc') },
    { title: t('about.value_transparency'), desc: t('about.value_transparency_desc') },
  ];
  const offices = [
    { image: antalyaImage, city: "Antalya", sub: t('about.antalya_main'), phone: "+90 552 303 27 50", desc: t('about.antalya_desc') },
    { image: mersinImage, city: "Mersin", sub: t('about.mersin_regional'), phone: "+90 552 303 27 50", desc: t('about.mersin_desc') },
    { image: dubaiImage, city: "Dubai", sub: t('about.dubai_middle_east'), phone: "+971 54 554 2068", desc: t('about.dubai_desc') },
    { image: strasbourgImage, city: "Strasbourg", sub: t('about.france_european'), phone: "+33 6 51 01 01 56", desc: t('about.france_desc') },
    { image: baliImage, city: "Bali", sub: t('about.bali_southeast'), phone: "+62 813-6404-2656", desc: t('about.bali_desc') },
  ];

  return <div className="min-h-screen bg-background">
    <SEOHead title={pageTitle || "About Future Homes International | Leading Global Real Estate Experts"} description={metaDescription || "Leading international real estate experts since 2010."} canonicalUrl="https://futurehomesinternational.com/about-us" />
    <Navigation />

    {/* Hero */}
    <PublicPageHero
      eyebrow={t('about.badge')}
      title={t('about.hero_title') || heroTitle}
      description={t('about.hero_subtitle') || heroSubtitle}
      image={aboutHero}
      imageAlt="Future Homes International — global real estate expertise"
      primaryLabel={t('about.contact_us')}
      primaryTo="/contact-us"
    />

    {/* Stats — monolithic navy band */}
    <section className="bg-navy border-b border-gold/20 py-14 text-navy-foreground sm:py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-5 md:grid-cols-4 sm:px-8">
        {stats.map((stat, index) => (
          <div key={index} className="space-y-2 text-center">
            <div className="font-light tracking-tighter text-gold text-4xl sm:text-5xl">{stat.number}</div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-navy-foreground/60">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>

    {/* CMS story sections */}
    {!contentLoading && contentSections.length > 0 && (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {contentSections.map((section, index) => <ContentSection key={index} section={section} />)}
      </section>
    )}

    {/* Core values — editorial numbered columns */}
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <EditorialSectionHeader align="center" eyebrow="Our values" title={t('about.values_title')} description={t('about.values_subtitle')} />
      <div className="grid border border-navy/10 bg-card md:grid-cols-3">
        {values.map((value, i) => (
          <div key={i} className="group border-b border-navy/10 p-10 transition-colors duration-500 last:border-b-0 hover:bg-ivory md:border-b-0 md:border-r md:last:border-r-0 sm:p-12">
            <span className="mb-6 block text-sm text-gold-foreground">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="mb-4 tracking-tight text-xl sm:text-2xl font-semibold">{value.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{value.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Offices — cinematic destination strip */}
    <section className="overflow-hidden bg-navy py-20 text-navy-foreground lg:py-24">
      <div className="mx-auto mb-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold">Global presence</p>
        <h2 className="text-3xl font-light leading-tight sm:text-4xl md:text-5xl">{t('about.locations_title')}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-navy-foreground/70 sm:text-base">{t('about.locations_subtitle')}</p>
      </div>
      <div className="no-scrollbar flex gap-6 overflow-x-auto px-4 pb-6 sm:px-6 lg:px-8">
        {offices.map((office, i) => (
          <div key={i} className="group w-[17rem] flex-none sm:w-[20rem]">
            <div className="relative mb-6 aspect-[3/4] overflow-hidden">
              <img
                src={office.image}
                alt={`${office.city} — Future Homes International office`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent opacity-90" />
              <div className="absolute bottom-6 left-6">
                <div className="mb-2 font-light text-gold text-4xl">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="text-2xl font-light sm:text-3xl">{office.city}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gold/90">{office.sub}</p>
              </div>
            </div>
            <div className="space-y-2 px-1 text-sm text-navy-foreground/60">
              <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 transition-colors hover:text-gold notranslate" translate="no">
                <Phone className="h-3.5 w-3.5 text-gold" />{office.phone}
              </a>
              <a href="mailto:info@futurehomesinternational.com" className="flex items-center gap-2 break-all transition-colors hover:text-gold notranslate" translate="no">
                <Mail className="h-3.5 w-3.5 text-gold" />info@futurehomesinternational.com
              </a>
              <p className="flex items-start gap-2 pt-1 text-xs leading-relaxed text-navy-foreground/45">
                <MapPin className="mt-0.5 h-3.5 w-3.5 flex-none text-gold/70" />{office.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Team — portrait gallery */}
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <EditorialSectionHeader align="center" eyebrow="Our experts" title={t('about.team_title')} description={t('about.team_subtitle')} />
      {teamLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
        </div>
      ) : teamError ? (
        <div className="text-center text-muted-foreground"><p>{t('about.team_loading_error')}</p></div>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
          {teamMembers.map((member, index) => (
            <div key={member.id} className="group">
              {member.image_url && (
                <div className="mb-5 aspect-[3/4] overflow-hidden">
                  <img
                    src={getOptimizedImageUrl(member.image_url, 640)}
                    alt={member.name}
                    width={480}
                    height={640}
                    loading={index < 4 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                  />
                </div>
              )}
              <h3 className="text-lg font-medium notranslate" translate="no">{member.name}</h3>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-gold-foreground notranslate" translate="no">{member.position}</p>
              {member.bio && <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{member.bio}</p>}
              <div className="mt-4 flex gap-3 text-muted-foreground">
                {member.email && <a href={`mailto:${member.email}`} aria-label={`${member.name} email`} className="transition-colors hover:text-gold-foreground"><Mail className="h-4 w-4" /></a>}
                {member.phone && <a href={`tel:${member.phone}`} aria-label={`${member.name} phone`} className="transition-colors hover:text-gold-foreground"><Phone className="h-4 w-4" /></a>}
                {member.linkedin_url && <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} LinkedIn`} className="transition-colors hover:text-gold-foreground"><Linkedin className="h-4 w-4" /></a>}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>

    {/* Services + languages */}
    <section className="border-t border-navy/10 bg-card py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <EditorialSectionHeader eyebrow="What we handle" title={t('about.support_title')} description={t('about.support_subtitle')} />
          <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {services.map((service, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-none bg-gold" />
                <div>
                  <h3 className="text-sm font-semibold notranslate" translate="no">{service.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{service.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-navy p-8 text-navy-foreground sm:p-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">We speak your language</p>
          <h3 className="mb-4 text-2xl font-light sm:text-3xl">{t('about.languages_title')}</h3>
          <p className="mb-8 text-sm leading-relaxed text-navy-foreground/70">{t('about.languages_subtitle')}</p>
          <div className="flex flex-wrap gap-3">
            {languages.map((language, index) => (
              <span key={index} className="border border-navy-foreground/20 px-4 py-2 text-[10px] uppercase tracking-widest text-navy-foreground/85 transition-colors hover:border-gold/60 hover:text-gold">{language}</span>
            ))}
          </div>
          <div className="mt-10 flex items-center gap-3 border-t border-navy-foreground/15 pt-6 text-sm text-navy-foreground/70 notranslate" translate="no">
            <Building2 className="h-4 w-4 text-gold" />
            <a href="mailto:info@futurehomesinternational.com" className="break-all transition-colors hover:text-gold">info@futurehomesinternational.com</a>
          </div>
        </div>
      </div>
    </section>

    {/* Closing conversion band */}
    <EditorialCta
      eyebrow="Future Homes International"
      title={t('contact.get_in_touch')}
      description={t('about.hero_subtitle')}
      primaryLabel={t('about.contact_us')}
      primaryTo="/contact-us"
    />

    <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
  </div>;
};


export default AboutUs;
