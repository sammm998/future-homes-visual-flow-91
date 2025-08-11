
import Navigation from "@/components/Navigation";
import PropertyWizardComponent from "@/components/PropertyWizardComponent";

const PropertyWizard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <PropertyWizardComponent />
    </div>
  );
};

export default PropertyWizard;
