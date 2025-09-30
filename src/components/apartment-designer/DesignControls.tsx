import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sofa, Bed, Armchair, Table } from "lucide-react";

interface DesignControlsProps {
  designMode: 'apartment' | 'villa' | 'complex';
  floorPlan: string;
  setFloorPlan: (plan: string) => void;
  wallColor: string;
  setWallColor: (color: string) => void;
  floorColor: string;
  setFloorColor: (color: string) => void;
  selectedFurniture: string[];
  setSelectedFurniture: (furniture: string[]) => void;
  facadeColor: string;
  setFacadeColor: (color: string) => void;
  roofColor: string;
  setRoofColor: (color: string) => void;
}

export const DesignControls = ({
  designMode,
  floorPlan,
  setFloorPlan,
  wallColor,
  setWallColor,
  floorColor,
  setFloorColor,
  selectedFurniture,
  setSelectedFurniture,
  facadeColor,
  setFacadeColor,
  roofColor,
  setRoofColor,
}: DesignControlsProps) => {
  const furnitureOptions = [
    { type: 'sofa', icon: Sofa, label: 'Sofa' },
    { type: 'bed', icon: Bed, label: 'Bed' },
    { type: 'table', icon: Table, label: 'Table' },
    { type: 'chair', icon: Armchair, label: 'Chair' },
  ];

  const wallColors = [
    { name: 'White', value: '#ffffff' },
    { name: 'Beige', value: '#f5f5dc' },
    { name: 'Gray', value: '#d3d3d3' },
    { name: 'Blue', value: '#e6f3ff' },
  ];

  const floorColors = [
    { name: 'Light Wood', value: '#c49a6c' },
    { name: 'Dark Wood', value: '#8b4513' },
    { name: 'Gray', value: '#808080' },
    { name: 'White Marble', value: '#f5f5f5' },
  ];

  const exteriorColors = [
    { name: 'Cream', value: '#e8e4dc' },
    { name: 'Light Gray', value: '#d0d0d0' },
    { name: 'Beige', value: '#c9b8a0' },
    { name: 'White', value: '#ffffff' },
  ];

  const roofColors = [
    { name: 'Dark Gray', value: '#4a4a4a' },
    { name: 'Brown', value: '#8b4513' },
    { name: 'Red Tile', value: '#a0522d' },
    { name: 'Black', value: '#2c2c2c' },
  ];

  const toggleFurniture = (type: string) => {
    if (selectedFurniture.includes(type)) {
      setSelectedFurniture(selectedFurniture.filter(f => f !== type));
    } else {
      setSelectedFurniture([...selectedFurniture, type]);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-card rounded-lg border border-border">
      {/* Apartment Interior Controls */}
      {designMode === 'apartment' && (
        <>
          <div>
            <Label className="text-lg font-semibold mb-3 block">Floor Plan</Label>
            <div className="grid grid-cols-3 gap-2">
              {['1+1', '2+1', '3+1'].map((plan) => (
                <Button
                  key={plan}
                  variant={floorPlan === plan ? 'default' : 'outline'}
                  onClick={() => setFloorPlan(plan)}
                  className="w-full"
                >
                  {plan}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {floorPlan === '1+1' && '1 bedroom + living room'}
              {floorPlan === '2+1' && '2 bedrooms + living room'}
              {floorPlan === '3+1' && '3 bedrooms + living room'}
            </p>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-3 block">Wall Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {wallColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setWallColor(color.value)}
                  className={`h-12 rounded-md border-2 transition-all ${
                    wallColor === color.value ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-3 block">Floor Material</Label>
            <div className="grid grid-cols-4 gap-2">
              {floorColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setFloorColor(color.value)}
                  className={`h-12 rounded-md border-2 transition-all ${
                    floorColor === color.value ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-3 block">Furniture</Label>
            <div className="grid grid-cols-2 gap-2">
              {furnitureOptions.map(({ type, icon: Icon, label }) => (
                <Button
                  key={type}
                  variant={selectedFurniture.includes(type) ? 'default' : 'outline'}
                  onClick={() => toggleFurniture(type)}
                  className="w-full"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Villa & Complex Exterior Controls */}
      {(designMode === 'villa' || designMode === 'complex') && (
        <>
          <div>
            <Label className="text-lg font-semibold mb-3 block">Facade Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {exteriorColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setFacadeColor(color.value)}
                  className={`h-12 rounded-md border-2 transition-all ${
                    facadeColor === color.value ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-3 block">Roof Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {roofColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setRoofColor(color.value)}
                  className={`h-12 rounded-md border-2 transition-all ${
                    roofColor === color.value ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
