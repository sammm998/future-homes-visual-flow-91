import { Link } from "@/lib/router-compat";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, ExternalLink } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { useTranslation } from "@/hooks/useTranslation";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-secondary text-brand-foreground pt-20 pb-8 border-t border-brand-foreground/10 relative overflow-hidden cinematic-section">
      {/* Decorative element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <img
                src="/future-homes-logo-new.webp"
                alt="Future Homes International"
                width={200}
                height={120}
                className="h-16 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-brand-foreground/70 text-sm leading-relaxed max-w-xs">
              {t('footer.description') || "Leading international real estate agency specializing in premium properties across Turkey, UAE, Cyprus, and Bali. Expert guidance for property investment and luxury living."}
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/futurehomesinternational/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-foreground/20 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent transition-all duration-300">
                <Instagram size={18} />
              </a>
              <a href="https://www.facebook.com/futurehomesturkey/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-foreground/20 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent transition-all duration-300">
                <Facebook size={18} />
              </a>
              <a href="https://www.linkedin.com/company/future-homes-1/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-foreground/20 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent transition-all duration-300">
                <Linkedin size={18} />
              </a>
              <a href="https://www.tiktok.com/@futurehomesglobal" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-foreground/20 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent transition-all duration-300">
                <FaTiktok size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="section-kicker cinematic-rule text-brand-accent mb-6">{t('footer.quick_links') || "Quick Links"}</h4>
            <ul className="space-y-4">
              {['Antalya', 'Istanbul', 'Dubai', 'Cyprus', 'Bali'].map((city) => (
                <li key={city}>
                  <Link to={`/${city.toLowerCase()}`} className="text-brand-foreground/60 hover:text-brand-accent transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-brand-accent/30 group-hover:bg-brand-accent transition-colors"></span>
                    {t(`nav.${city.toLowerCase()}`) || city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="section-kicker cinematic-rule text-brand-accent mb-6">{t('footer.resources') || "Resources"}</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/about-us" className="text-brand-foreground/60 hover:text-brand-accent transition-colors text-sm">{t('nav.about')}</Link>
              </li>
              <li>
                <Link to="/articles" className="text-brand-foreground/60 hover:text-brand-accent transition-colors text-sm">{t('nav.articles')}</Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-brand-foreground/60 hover:text-brand-accent transition-colors text-sm">{t('nav.testimonials')}</Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-brand-foreground/60 hover:text-brand-accent transition-colors text-sm">{t('nav.contact')}</Link>
              </li>
              <li>
                <Link to="/property-wizard" className="text-brand-foreground/60 hover:text-brand-accent transition-colors text-sm font-semibold text-brand-accent">{t('home.start_journey')}</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="section-kicker cinematic-rule text-brand-accent mb-6">{t('footer.contact') || "Contact Us"}</h4>
            <div className="space-y-4">
              <a href="mailto:info@futurehomesinternational.com" className="flex items-start gap-3 group">
                <Mail size={18} className="text-brand-accent mt-0.5" />
                <span className="text-brand-foreground/70 text-sm group-hover:text-brand-accent transition-colors break-all">info@futurehomesinternational.com</span>
              </a>
              <a href="tel:+905523032750" className="flex items-start gap-3 group">
                <Phone size={18} className="text-brand-accent mt-0.5" />
                <span className="text-brand-foreground/70 text-sm group-hover:text-brand-accent transition-colors">+90 552 303 27 50</span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-accent mt-0.5" />
                <span className="text-brand-foreground/70 text-sm leading-relaxed">
                  Liman Mah. Atatürk Bulvarı, No: 204/C, Konyaaltı/Antalya, Turkey
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="cinematic-surface bg-brand-foreground/5 px-5 py-5 rounded-md flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-brand-foreground/50 text-[10px] sm:text-xs uppercase tracking-widest font-medium">
            © {currentYear} Future Homes International. All Rights Reserved.
          </p>
          <div className="flex gap-6 text-[10px] sm:text-xs uppercase tracking-widest font-medium text-brand-foreground/50">
            <Link to="/privacy-policy" className="hover:text-brand-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms-conditions" className="hover:text-brand-accent transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
