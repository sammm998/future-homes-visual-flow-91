
import React, { memo, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram, Facebook, Linkedin } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import { useToast } from "@/hooks/use-toast";



const Newsletter = memo(() => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('https://kiogiyemoqbnuvclneoe.supabase.co/functions/v1/subscribe-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpb2dpeWVtb3FibnV2Y2xuZW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDg4NzIsImV4cCI6MjA2ODI4NDg3Mn0.wZFKwwrvtrps2gCFc15rHN-3eg5T_kEDioBGZV_IctI'}`,
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Thank you for subscribing to our newsletter!",
        });
        setEmail('');
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section className="bg-brand-secondary text-white py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Newsletter Signup */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Subscribe to Newsletter
            </h2>
            <p className="text-base md:text-lg mb-6 md:mb-8 opacity-90">
              Sign up for the latest property updates and exclusive offers
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md items-stretch">
              <Input 
                type="email" 
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70 flex-1 h-12"
                required
              />
              <Button 
                type="submit"
                variant="outline"
                disabled={isSubmitting}
                className="bg-white text-brand-secondary hover:bg-white/70 border-white whitespace-nowrap h-12 px-8 flex-shrink-0"
                style={{ minWidth: 'auto', width: 'auto' }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold mb-8">
              Get in Touch
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Address</h3>
                <p className="opacity-90">Your trusted partner for international property investment</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                <a href="tel:+905523032750" className="opacity-90 hover:text-brand-accent transition-colors">+90 552 303 27 50</a>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <a href="mailto:info@futurehomesturkey.com" className="opacity-90 hover:text-brand-accent transition-colors">info@futurehomesturkey.com</a>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Follow Us on Social Media</h3>
                <div className="flex space-x-4">
                  <a href="https://www.instagram.com/futurehomesglobal/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors">
                    <Instagram size={24} />
                  </a>
                  <a href="https://www.facebook.com/futurehomesturkey/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors">
                    <Facebook size={24} />
                  </a>
                  <a href="https://www.tiktok.com/@futurehomes.eng" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors">
                    <SiTiktok size={24} />
                  </a>
                  <a href="https://www.linkedin.com/company/future-homes-1/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors">
                    <Linkedin size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Our Locations</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm opacity-90">
              <div>Antalya Office</div>
              <div>Mersin Office</div>
              <div>Dubai Office</div>
              <div>France Office</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Newsletter.displayName = "Newsletter";

export default Newsletter;
