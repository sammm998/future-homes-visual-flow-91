import { useState } from "react";
import Navigation from "@/components/Navigation";
import { ApartmentScene } from "@/components/apartment-designer/ApartmentScene";
import { DesignControls } from "@/components/apartment-designer/DesignControls";
import { useProperties } from "@/hooks/useProperties";

const ApartmentDesigner = () => {
  const [floorPlan, setFloorPlan] = useState('1+1');
  const [wallColor, setWallColor] = useState('#ffffff');
  const [floorColor, setFloorColor] = useState('#deb887');
  const [selectedFurniture, setSelectedFurniture] = useState<string[]>(['sofa', 'bed']);
  const { properties } = useProperties();

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
