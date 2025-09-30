import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Environment } from '@react-three/drei';
import { Room3D } from './Room3D';

interface Property {
  id: string;
  apartment_types?: any[];
  property_images?: string[];
}

interface ApartmentSceneProps {
  floorPlan: string;
  selectedFurniture: string[];
  wallColor: string;
  floorColor: string;
  properties: Property[];
}

export const ApartmentScene = ({ 
  floorPlan, 
  selectedFurniture,
  wallColor,
  floorColor,
  properties
}: ApartmentSceneProps) => {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-border bg-gradient-to-b from-slate-800 to-slate-900">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[15, 12, 15]} fov={50} />
        <OrbitControls 
          enableDamping
          dampingFactor={0.05}
          minDistance={8}
          maxDistance={35}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
          target={[0, 0, 0]}
        />
        
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[15, 20, 10]} 
          intensity={1.2} 
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <pointLight position={[-5, 8, -5]} intensity={0.5} color="#ffd4a3" />
        <pointLight position={[5, 8, 5]} intensity={0.3} color="#a3c7ff" />
        
        {/* Environment for reflections */}
        <Environment preset="apartment" />

        {/* Grid - positioned lower */}
        <Grid 
          args={[30, 30]} 
          cellSize={1} 
          cellColor="#374151" 
          sectionColor="#4b5563"
          fadeDistance={40}
          fadeStrength={1}
          position={[0, -0.01, 0]}
        />

        {/* 3D Apartment Room */}
        <Room3D 
          floorPlan={floorPlan} 
          wallColor={wallColor}
          floorColor={floorColor}
          selectedFurniture={selectedFurniture}
          properties={properties}
        />
      </Canvas>
    </div>
  );
};
