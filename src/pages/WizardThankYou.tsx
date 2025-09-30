import Navigation from "@/components/Navigation";
import { ThankYouContent } from "@/components/ThankYouContent";
import SEOHead from "@/components/SEOHead";

const WizardThankYou = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Thank You for Using Easy Find | Future Homes Turkey"
        description="Thank you for using our property search wizard. We're preparing personalized recommendations for you."
        canonicalUrl="https://futurehomesturkey.com/wizard-thank-you"
      />
      <Navigation />
      <ThankYouContent
        title="Perfect! We're On It!"
        description="Your preferences have been successfully submitted. Our property experts are now preparing a personalized selection of properties that match your criteria perfectly."
      />
    </div>
  );
};

export default WizardThankYou;
