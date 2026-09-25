
import React, { memo, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram, Facebook, Linkedin } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from '@/hooks/useTranslation';

const Newsletter = memo(() => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: t('common.error'), description: "Please enter your email address", variant: "destructive" });
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
        toast({ title: t('common.success'), description: t('newsletter.success') });
        setEmail('');
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      toast({ title: t('common.error'), description: "Failed to subscribe. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section className="bg-brand-secondary text-brand-foreground py-16 md:py-24 cinematic-section border-t border-brand-foreground/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-20">
          <div>
            <span className="section-kicker cinematic-rule text-brand-accent mb-4">Future Homes</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t('newsletter.title')}</h2>
            <p className="text-base md:text-lg mb-6 md:mb-8 opacity-90">{t('newsletter.subtitle')}</p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md items-stretch">
              <Input 
                type="email" 
                placeholder={t('newsletter.placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-brand-foreground/10 border-brand-foreground/20 text-brand-foreground placeholder:text-brand-foreground/65 flex-1 h-12 rounded-md"
                required
              />
              <Button 
                type="submit" variant="outline" disabled={isSubmitting}
                 className="bg-brand-foreground text-brand-secondary hover:bg-brand-accent border-brand-foreground whitespace-nowrap h-12 px-8 flex-shrink-0 rounded-md"
                style={{ minWidth: 'auto', width: 'auto' }}
              >
                {isSubmitting ? t('newsletter.submitting') : t('newsletter.submit')}
              </Button>
            </form>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-8">{t('newsletter.get_in_touch')}</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">{t('newsletter.address')}</h3>
                <p className="opacity-90">{t('newsletter.address_text')}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{t('newsletter.call_us')}</h3>
                <a href="tel:+905523032750" className="inline-flex items-center min-h-11 opacity-90 hover:text-brand-accent transition-colors">+90 552 303 27 50</a>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{t('newsletter.email')}</h3>
                <a href="mailto:info@futurehomesinternational.com" className="inline-flex items-center min-h-11 opacity-90 hover:text-brand-accent transition-colors">info@futurehomesinternational.com</a>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">{t('newsletter.follow_us')}</h3>
                <div className="flex space-x-1">
                  <a href="https://www.instagram.com/futurehomesglobal/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 min-w-11 min-h-11 inline-flex items-center justify-center hover:text-brand-accent transition-colors"><Instagram size={24} aria-hidden="true" /></a>
                  <a href="https://www.facebook.com/futurehomesturkey/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 min-w-11 min-h-11 inline-flex items-center justify-center hover:text-brand-accent transition-colors"><Facebook size={24} aria-hidden="true" /></a>
                  <a href="https://www.tiktok.com/@futurehomes.eng" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="p-2 min-w-11 min-h-11 inline-flex items-center justify-center hover:text-brand-accent transition-colors"><SiTiktok size={24} aria-hidden="true" /></a>
                  <a href="https://www.linkedin.com/company/future-homes-1/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 min-w-11 min-h-11 inline-flex items-center justify-center hover:text-brand-accent transition-colors"><Linkedin size={24} aria-hidden="true" /></a>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-brand-foreground/20 mt-14 pt-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">{t('newsletter.our_locations')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm opacity-90">
              <div>{t('contact.antalya_office')}</div>
              <div>{t('contact.mersin_office')}</div>
              <div>{t('contact.dubai_office')}</div>
              <div>{t('contact.france_office')}</div>
              <div>{t('contact.bali_office')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Newsletter.displayName = "Newsletter";
export default Newsletter;
