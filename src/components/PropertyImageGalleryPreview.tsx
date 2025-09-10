import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Image } from 'lucide-react';
import PropertyImageGallery from './PropertyImageGallery';

const PropertyImageGalleryPreview = () => {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Property Image Gallery
          </h2>
          <p className="text-xl text-muted-foreground mb-6">
            Explore our complete collection of property images from premium locations
          </p>
          <Link to="/gallery">
            <Button className="group">
              <Image className="w-4 h-4 mr-2" />
              View Full Gallery
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        
        {/* Show limited preview */}
        <PropertyImageGallery limit={8} showFilters={false} />
        
        <div className="text-center mt-8">
          <Link to="/gallery">
            <Button variant="outline" size="lg">
              See All Properties & Images
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PropertyImageGalleryPreview;