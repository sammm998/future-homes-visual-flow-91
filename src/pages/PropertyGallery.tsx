import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Camera, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const PropertyGallery = () => {
  const galleryImages = [
    {
      src: 'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/rl9q4mj1esj.jpg',
      alt: 'Luxury apartment interior',
      category: 'Interior',
    },
    {
      src: 'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/3n142jndva3.jpg',
      alt: 'Modern living room',
      category: 'Living Room',
    },
    {
      src: 'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/bkr7jnjl6tj.jpg',
      alt: 'Apartment bedroom',
      category: 'Bedroom',
    },
    {
      src: 'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/wkf3muk8mf.jpg',
      alt: 'Kitchen and dining area',
      category: 'Kitchen',
    },
    {
      src: 'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/ssml6o436x.jpg',
      alt: 'Balcony with city view',
      category: 'Balcony',
    },
    {
      src: 'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/tttyz3px5ue.jpeg',
      alt: 'Swimming pool area',
      category: 'Amenities',
    },
    {
      src: 'https://kiogiyemoqbnuvclneoe.supabase.co/storage/v1/object/public/property-images/property-images/ani9abmbtg.jpg',
      alt: 'Building exterior',
      category: 'Exterior',
    },
  ];

  return (
    <>
      <SEOHead
        title="Property Gallery - Premium Real Estate Collection | Future Homes"
        description="Explore our stunning collection of premium properties with high-quality images showcasing luxury apartments, modern interiors, and exceptional amenities in prime locations."
        keywords="property gallery, luxury apartments, real estate images, premium properties, modern homes, apartment photos"
        canonicalUrl="/property-gallery"
      />
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                <span className="font-semibold">Property Gallery</span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-foreground">Immersive</span>{' '}
              <span className="text-primary">Property Gallery</span>
            </h1>
            <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Discover stunning visuals from our <strong>premium property collection</strong> across <strong>multiple locations</strong>.
            </p>
            <p className="text-muted-foreground mb-12">
              Each image tells a story of luxury, comfort, and exceptional design.
            </p>
            
            {/* Statistics */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="bg-card rounded-lg p-6 min-w-[140px]">
                <div className="text-2xl font-bold text-primary mb-1">117+</div>
                <div className="text-sm text-muted-foreground">TOTAL IMAGES</div>
              </div>
              <div className="bg-card rounded-lg p-6 min-w-[140px]">
                <div className="text-2xl font-bold text-primary mb-1">6</div>
                <div className="text-sm text-muted-foreground">PROPERTIES</div>
              </div>
              <div className="bg-card rounded-lg p-6 min-w-[140px]">
                <div className="text-2xl font-bold text-primary mb-1">4K</div>
                <div className="text-sm text-muted-foreground">HD QUALITY</div>
              </div>
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {galleryImages.map((image, index) => (
                <div 
                  key={index} 
                  className="group relative overflow-hidden rounded-lg aspect-[4/3] bg-muted hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading={index < 4 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button variant="secondary" size="sm" className="gap-2">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <span className="text-white text-sm font-medium">{image.category}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button asChild className="gap-2">
                <Link to="/contact">
                  <MapPin className="w-4 h-4" />
                  Schedule Property Visit
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PropertyGallery;