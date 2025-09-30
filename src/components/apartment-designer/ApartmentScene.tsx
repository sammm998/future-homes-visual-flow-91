import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import { Room } from './Room';
import { Furniture } from './Furniture';

interface ApartmentSceneProps {
  floorPlan: string;
  selectedFurniture: string[];
  wallColor: string;
  floorColor: string;
}

export const ApartmentScene = ({ 
  floorPlan, 
  selectedFurniture,
  wallColor,
  floorColor 
}: ApartmentSceneProps) => {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-border">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[10, 10, 10]} />
        <OrbitControls 
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2 - 0.1}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.3} />

        {/* Grid */}
        <Grid 
          args={[20, 20]} 
          cellSize={1} 
          cellColor="#6b7280" 
          sectionColor="#374151"
          fadeDistance={30}
          fadeStrength={1}
        />

        {/* Room */}
        <Room 
          floorPlan={floorPlan} 
          wallColor={wallColor}
          floorColor={floorColor}
        />

        {/* Furniture */}
        {selectedFurniture.map((item, index) => (
          <Furniture 
            key={index} 
            type={item} 
            position={[index * 2 - 2, 0, 0]} 
          />
        ))}
      </Canvas>
    </div>
  );
};
