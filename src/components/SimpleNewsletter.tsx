import { Instagram, Facebook, Linkedin } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';

const SimpleNewsletter = () => {
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
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-md items-stretch">
              <input 
                type="email" 
                placeholder="Your email address"
                className="bg-white/10 border border-white/20 text-white placeholder:text-white/70 flex-1 h-12 px-4 rounded-md"
                required
              />
              <button 
                type="submit"
                className="bg-white text-brand-secondary hover:bg-white/70 border border-white whitespace-nowrap h-12 px-8 flex-shrink-0 rounded-md transition-colors"
              >
                Submit
              </button>
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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm opacity-90">
              <div>Antalya Office</div>
              <div>Mersin Office</div>
              <div>Dubai Office</div>
              <div>France Office</div>
              <div>Cyprus Office</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleNewsletter;