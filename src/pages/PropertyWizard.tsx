import Navigation from "@/components/Navigation";
import SEOHead from "@/components/SEOHead";
import PropertyWizardComponent from "@/components/PropertyWizardComponent";
import { PublicPageHero } from "@/components/PublicEditorial";
import { useTranslation } from "@/hooks/useTranslation";
import heroImage from "@/assets/hero-modern-estate.jpg";

const PropertyWizard = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Property Search Wizard | Find Your Perfect Property Easy"
        description="Use our intelligent property search wizard to find your ideal home. Answer a few questions and get personalized property recommendations matching your needs."
        keywords="property search wizard, property finder, easy property search, personalized property recommendations, property matching"
        canonicalUrl="https://futurehomesinternational.com/property-wizard"
      />
      <Navigation />
      <PublicPageHero
        eyebrow="Easy Find"
        title={t('wizard.find_perfect')}
        description={t('wizard.help_discover')}
        image={heroImage}
        imageAlt={t('wizard.find_perfect')}
        compact
      />
      <PropertyWizardComponent />
    </div>
  );
};

export default PropertyWizard;
