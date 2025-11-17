import Navigation from "@/components/Navigation";
import { ThankYouContent } from "@/components/ThankYouContent";
import SEOHead from "@/components/SEOHead";

const ContactThankYou = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Thank You for Contacting Us | Future Homes International"
        description="Thank you for reaching out to Future Homes International. We'll get back to you shortly."
        canonicalUrl="https://futurehomesinternational.com/contact-thank-you"
      />
      <Navigation />
      <ThankYouContent
        title="Thank You for Reaching Out!"
        description="We've received your message and appreciate you contacting Future Homes International. Our team will review your inquiry and get back to you as soon as possible."
      />
    </div>
  );
};

export default ContactThankYou;
