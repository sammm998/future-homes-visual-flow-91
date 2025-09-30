import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sofa, Bed, Armchair, Table } from "lucide-react";

interface DesignControlsProps {
  floorPlan: string;
  setFloorPlan: (plan: string) => void;
  wallColor: string;
  setWallColor: (color: string) => void;
  floorColor: string;
  setFloorColor: (color: string) => void;
  selectedFurniture: string[];
  setSelectedFurniture: (furniture: string[]) => void;
}

export const DesignControls = ({
  floorPlan,
  setFloorPlan,
  wallColor,
  setWallColor,
  floorColor,
  setFloorColor,
  selectedFurniture,
  setSelectedFurniture,
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
    { name: 'Light Wood', value: '#deb887' },
    { name: 'Dark Wood', value: '#8b4513' },
    { name: 'Gray', value: '#808080' },
    { name: 'White', value: '#f5f5f5' },
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
        <Label className="text-lg font-semibold mb-3 block">Floor Color</Label>
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
    </div>
  );
};
