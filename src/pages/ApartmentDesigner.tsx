import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { ApartmentScene } from "@/components/apartment-designer/ApartmentScene";
import { DesignControls } from "@/components/apartment-designer/DesignControls";
import { useProperties } from "@/hooks/useProperties";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const ApartmentDesigner = () => {
  const [floorPlan, setFloorPlan] = useState('1+1');
  const [wallColor, setWallColor] = useState('#ffffff');
  const [floorColor, setFloorColor] = useState('#deb887');
  const [selectedFurniture, setSelectedFurniture] = useState<string[]>(['sofa', 'bed', 'table']);
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const { properties } = useProperties();

  // Get unique apartment types from properties
  const apartmentTypes = Array.from(
    new Set(
      properties?.flatMap(p => 
        Array.isArray(p.apartment_types) 
          ? p.apartment_types.map((apt: any) => apt.type) 
          : []
      ) || []
    )
  ).filter(Boolean);

  // Update floor plan when a property is selected
  useEffect(() => {
    if (selectedProperty && properties) {
      const property = properties.find(p => p.id === selectedProperty);
      if (property && Array.isArray(property.apartment_types) && property.apartment_types.length > 0) {
        const firstType = property.apartment_types[0].type;
        if (firstType) {
          setFloorPlan(firstType);
        }
      }
    }
  }, [selectedProperty, properties]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Design Your Apartment</h1>
          <p className="text-muted-foreground text-lg">
            Create your dream apartment in 3D - choose floor plan, colors and furniture
          </p>
        </div>

        {/* Property Selector */}
        {properties && properties.length > 0 && (
          <div className="mb-6 max-w-md">
            <Label htmlFor="property-select" className="text-lg font-semibold mb-2 block">
              Select Property
            </Label>
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger id="property-select">
                <SelectValue placeholder="Choose a property to view" />
              </SelectTrigger>
              <SelectContent>
                {properties.slice(0, 20).map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title || property.ref_no || property.location || 'Property'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="aspect-video w-full">
              <ApartmentScene
                floorPlan={floorPlan}
                selectedFurniture={selectedFurniture}
                wallColor={wallColor}
                floorColor={floorColor}
                properties={properties as any || []}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Drag to rotate • Scroll to zoom
            </p>
          </div>

          <div>
            <DesignControls
              floorPlan={floorPlan}
              setFloorPlan={setFloorPlan}
              wallColor={wallColor}
              setWallColor={setWallColor}
              floorColor={floorColor}
              setFloorColor={setFloorColor}
              selectedFurniture={selectedFurniture}
              setSelectedFurniture={setSelectedFurniture}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApartmentDesigner;
