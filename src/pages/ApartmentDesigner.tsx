import { useState } from "react";
import Navigation from "@/components/Navigation";
import { ApartmentScene } from "@/components/apartment-designer/ApartmentScene";
import { DesignControls } from "@/components/apartment-designer/DesignControls";

const ApartmentDesigner = () => {
  const [floorPlan, setFloorPlan] = useState('2-bedroom');
  const [wallColor, setWallColor] = useState('#ffffff');
  const [floorColor, setFloorColor] = useState('#deb887');
  const [selectedFurniture, setSelectedFurniture] = useState<string[]>(['sofa', 'table']);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Designa Din Lägenhet</h1>
          <p className="text-muted-foreground text-lg">
            Skapa din drömlägenhet i 3D - välj planlösning, färger och möbler
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
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Dra för att rotera • Scrolla för att zooma
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
