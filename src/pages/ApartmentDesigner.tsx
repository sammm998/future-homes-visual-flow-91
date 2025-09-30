import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { ApartmentScene } from "@/components/apartment-designer/ApartmentScene";
import { DesignControls } from "@/components/apartment-designer/DesignControls";
import { useProperties } from "@/hooks/useProperties";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ApartmentDesigner = () => {
  const [designMode, setDesignMode] = useState<'apartment' | 'villa' | 'complex'>('apartment');
  const [floorPlan, setFloorPlan] = useState('1+1');
  const [wallColor, setWallColor] = useState('#ffffff');
  const [floorColor, setFloorColor] = useState('#c49a6c');
  const [selectedFurniture, setSelectedFurniture] = useState<string[]>(['sofa', 'bed', 'table']);
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [facadeColor, setFacadeColor] = useState('#e8e4dc');
  const [roofColor, setRoofColor] = useState('#4a4a4a');
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
          <h1 className="text-4xl font-bold mb-2">3D Property Designer</h1>
          <p className="text-muted-foreground text-lg">
            Design apartments, villas and complexes in realistic 3D
          </p>
        </div>

        {/* Design Mode Tabs */}
        <Tabs value={designMode} onValueChange={(v) => setDesignMode(v as any)} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="apartment">Apartment Interior</TabsTrigger>
            <TabsTrigger value="villa">Villa Exterior</TabsTrigger>
            <TabsTrigger value="complex">Complex Exterior</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Property Selector */}
        {designMode === 'apartment' && properties && properties.length > 0 && (
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
                designMode={designMode}
                floorPlan={floorPlan}
                selectedFurniture={selectedFurniture}
                wallColor={wallColor}
                floorColor={floorColor}
                facadeColor={facadeColor}
                roofColor={roofColor}
                properties={properties as any || []}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Drag to rotate • Scroll to zoom
            </p>
          </div>

          <div>
            <DesignControls
              designMode={designMode}
              floorPlan={floorPlan}
              setFloorPlan={setFloorPlan}
              wallColor={wallColor}
              setWallColor={setWallColor}
              floorColor={floorColor}
              setFloorColor={setFloorColor}
              selectedFurniture={selectedFurniture}
              setSelectedFurniture={setSelectedFurniture}
              facadeColor={facadeColor}
              setFacadeColor={setFacadeColor}
              roofColor={roofColor}
              setRoofColor={setRoofColor}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApartmentDesigner;
