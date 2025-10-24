import Navigation from "@/components/Navigation";
import SEOHead from "@/components/SEOHead";
import PropertyWizardComponent from "@/components/PropertyWizardComponent";

const PropertyWizard = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Property Search Wizard | Find Your Perfect Property Easy"
        description="Use our intelligent property search wizard to find your ideal home. Answer a few questions and get personalized property recommendations matching your needs."
        keywords="property search wizard, property finder, easy property search, personalized property recommendations, property matching"
        canonicalUrl="https://futurehomesinternational.com/property-wizard"
      />
      <Navigation />
      <PropertyWizardComponent />
    </div>
  );
};

export default PropertyWizard;
