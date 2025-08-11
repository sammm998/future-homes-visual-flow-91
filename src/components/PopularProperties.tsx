import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Eye, ArrowRight } from "lucide-react";

const PopularProperties = () => {
  const properties = [
    {
      id: 1401,
      title: "Luxury villas in Antalya, Aksu",
      location: "Antalya, Aksu",
      price: "€600,000",
      image: "/lovable-uploads/4c6b5b9c-7b79-4474-b629-9e61e450f00b.png",
      bedrooms: "3+2",
      bathrooms: "2",
      area: "280",
      badge: "Under Construction",
      badgeColor: "bg-blue-500"
    },
    {
      id: 1400,
      title: "Luxury apartments in a prime location in Antalya, Konyaalti",
      location: "Antalya, Konyaalti",
      price: "Starting Price / €1,200,000",
      image: "/lovable-uploads/7335e4e2-249c-4b29-b83a-0101453f6878.png",
      bedrooms: "2+1 ⇔ 2+1",
      bathrooms: "2 ⇔ 2",
      area: "88 ⇔ 121",
      badge: "Sea view",
      badgeColor: "bg-green-500"
    },
    {
      id: 10053,
      title: "Luxury apartments with modern designs in Dubai, Sports City",
      location: "Dubai",
      price: "Starting Price / €265,000",
      image: "/lovable-uploads/aff7bebd-5943-45d9-84d8-a923abf07e24.png",
      bedrooms: "1+1 ⇔ 3+1",
      bathrooms: "1 ⇔ 3",
      area: "45 ⇔ 123",
      badge: "Investment",
      badgeColor: "bg-purple-500"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Popular Projects
            </h2>
            <p className="text-xl text-muted-foreground">
              Discover our most sought-after properties
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex">
            View all listing
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <Card key={property.id} className="group overflow-hidden hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className={`${property.badgeColor} text-white`}>
                    {property.badge}
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-800 text-white">
                    {property.id}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md font-bold text-lg text-foreground">
                    {property.price}
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {property.title}
                </h3>
                
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin size={16} />
                  <span className="text-sm">{property.location}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Bed size={16} />
                    <span>{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath size={16} />
                    <span>{property.bathrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Square size={16} />
                    <span>{property.area}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 md:hidden">
          <Button variant="outline">
            View all listing
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularProperties;