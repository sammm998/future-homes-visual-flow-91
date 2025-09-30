import { useRef } from 'react';
import { Mesh, Group } from 'three';
import { DetailedFurniture } from './DetailedFurniture';

interface Property {
  id: string;
  apartment_types?: any[];
  property_images?: string[];
}

interface Room3DProps {
  floorPlan: string;
  wallColor: string;
  floorColor: string;
  selectedFurniture: string[];
  properties: Property[];
}

export const Room3D = ({ floorPlan, wallColor, floorColor, selectedFurniture }: Room3DProps) => {
  const groupRef = useRef<Group>(null);

  // Room configurations - now connected as one apartment
  const getRoomConfig = () => {
    switch (floorPlan) {
      case '1+1': // 1 bedroom + 1 living room
        return {
          // Main living area
          living: { x: 0, z: 0, width: 5, depth: 6 },
          // Kitchen connected to living
          kitchen: { x: 0, z: 6.5, width: 3, depth: 2 },
          // Bedroom
          bedroom: { x: 5.5, z: 0, width: 4, depth: 5 },
          // Bathroom
          bathroom: { x: 5.5, z: 5.5, width: 2.5, depth: 2.5 },
          // Entrance hall
          entrance: { x: 3, z: 6.5, width: 2, depth: 2 },
          // Balcony
          balcony: { x: 0, z: -2.5, width: 4, depth: 2 },
          totalWidth: 9.5,
          totalDepth: 8.5
        };
      case '2+1': // 2 bedrooms + 1 living room
        return {
          living: { x: 0, z: 0, width: 6, depth: 7 },
          kitchen: { x: 0, z: 7.5, width: 4, depth: 2.5 },
          bedroom: { x: 6.5, z: 0, width: 4.5, depth: 5 },
          bedroom2: { x: 6.5, z: 5.5, width: 4.5, depth: 4.5 },
          bathroom: { x: 4.5, z: 7.5, width: 3, depth: 2.5 },
          entrance: { x: 7.5, z: 7.5, width: 3.5, depth: 2.5 },
          balcony: { x: 0, z: -3, width: 6, depth: 2.5 },
          totalWidth: 11,
          totalDepth: 10
        };
      case '3+1': // 3 bedrooms + 1 living room
        return {
          living: { x: 0, z: 0, width: 7, depth: 7 },
          kitchen: { x: 0, z: 7.5, width: 4.5, depth: 3 },
          bedroom: { x: 7.5, z: 0, width: 5, depth: 4.5 },
          bedroom2: { x: 7.5, z: 5, width: 5, depth: 3 },
          bedroom3: { x: 7.5, z: 8.5, width: 5, depth: 3 },
          bathroom: { x: 4.5, z: 7.5, width: 3, depth: 3 },
          entrance: { x: 7.5, z: 11.5, width: 5, depth: 2 },
          balcony: { x: 0, z: -3.5, width: 7, depth: 3 },
          totalWidth: 12.5,
          totalDepth: 13.5
        };
      default:
        return {
          living: { x: 0, z: 0, width: 5, depth: 6 },
          kitchen: { x: 0, z: 6.5, width: 3, depth: 2 },
          bedroom: { x: 5.5, z: 0, width: 4, depth: 5 },
          bathroom: { x: 5.5, z: 5.5, width: 2.5, depth: 2.5 },
          entrance: { x: 3, z: 6.5, width: 2, depth: 2 },
          balcony: { x: 0, z: -2.5, width: 4, depth: 2 },
          totalWidth: 9.5,
          totalDepth: 8.5
        };
    }
  };

  const config = getRoomConfig();
  const wallHeight = 2.8;
  const wallThickness = 0.12;

  // Helper to create a room with floor
  const createRoom = (name: string, x: number, z: number, width: number, depth: number, color: string) => {
    return (
      <group key={name} position={[x + width/2, 0, z + depth/2]}>
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
          <planeGeometry args={[width, depth]} />
          <meshStandardMaterial color={color} roughness={0.9} metalness={0.05} />
        </mesh>
      </group>
    );
  };

  // Helper to create interior walls (not exterior)
  const createWall = (x: number, y: number, z: number, width: number, height: number, depth: number, hasWindow: boolean = false, hasDoor: boolean = false) => {
    return (
      <group>
        {hasDoor ? (
          <>
            {/* Wall segments around door */}
            <mesh position={[x, y, z]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.3, height, depth]} />
              <meshStandardMaterial color={wallColor} roughness={0.8} />
            </mesh>
            <mesh position={[x + width * 0.35, y + height * 0.6, z]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.4, height * 0.4, depth]} />
              <meshStandardMaterial color={wallColor} roughness={0.8} />
            </mesh>
            <mesh position={[x + width * 0.35, y - height * 0.4, z]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.4, height * 0.2, depth]} />
              <meshStandardMaterial color={wallColor} roughness={0.8} />
            </mesh>
            {/* Door frame */}
            <mesh position={[x + width * 0.35, y - height * 0.1, z + depth]} castShadow>
              <boxGeometry args={[0.9, 2.1, 0.05]} />
              <meshStandardMaterial color="#8b7355" roughness={0.6} />
            </mesh>
          </>
        ) : hasWindow ? (
          <>
            {/* Wall with window opening */}
            <mesh position={[x, y - height * 0.3, z]} castShadow receiveShadow>
              <boxGeometry args={[width, height * 0.4, depth]} />
              <meshStandardMaterial color={wallColor} roughness={0.8} />
            </mesh>
            <mesh position={[x, y + height * 0.35, z]} castShadow receiveShadow>
              <boxGeometry args={[width, height * 0.3, depth]} />
              <meshStandardMaterial color={wallColor} roughness={0.8} />
            </mesh>
            {/* Window glass */}
            <mesh position={[x, y, z]}>
              <boxGeometry args={[width * 0.8, height * 0.5, 0.05]} />
              <meshStandardMaterial 
                color="#a3d5ff" 
                transparent 
                opacity={0.3} 
                roughness={0.1}
                metalness={0.8}
              />
            </mesh>
          </>
        ) : (
          <mesh position={[x, y, z]} castShadow receiveShadow>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color={wallColor} roughness={0.8} />
          </mesh>
        )}
      </group>
    );
  };

  return (
    <group ref={groupRef} position={[-config.totalWidth/2, 0, -config.totalDepth/2]}>
      {/* FLOORS */}
      {createRoom('living', config.living.x, config.living.z, config.living.width, config.living.depth, floorColor)}
      {createRoom('kitchen', config.kitchen.x, config.kitchen.z, config.kitchen.width, config.kitchen.depth, '#e8e8e8')}
      {createRoom('bedroom', config.bedroom.x, config.bedroom.z, config.bedroom.width, config.bedroom.depth, floorColor)}
      {config.bedroom2 && createRoom('bedroom2', config.bedroom2.x, config.bedroom2.z, config.bedroom2.width, config.bedroom2.depth, floorColor)}
      {config.bedroom3 && createRoom('bedroom3', config.bedroom3.x, config.bedroom3.z, config.bedroom3.width, config.bedroom3.depth, floorColor)}
      {createRoom('bathroom', config.bathroom.x, config.bathroom.z, config.bathroom.width, config.bathroom.depth, '#f0f0f0')}
      {createRoom('entrance', config.entrance.x, config.entrance.z, config.entrance.width, config.entrance.depth, '#d4c5b9')}
      {createRoom('balcony', config.balcony.x, config.balcony.z, config.balcony.width, config.balcony.depth, '#b8a890')}

      {/* EXTERIOR WALLS with windows */}
      {/* Front wall (with balcony door) */}
      {createWall(config.living.x + config.living.width/2, wallHeight/2, config.balcony.z + config.balcony.depth - wallThickness/2, config.living.width, wallHeight, wallThickness, true)}
      
      {/* Back wall */}
      {createWall(config.totalWidth/2, wallHeight/2, config.totalDepth - wallThickness/2, config.totalWidth, wallHeight, wallThickness)}
      
      {/* Left wall */}
      {createWall(wallThickness/2, wallHeight/2, config.totalDepth/2, wallThickness, wallHeight, config.totalDepth)}
      
      {/* Right wall with windows */}
      {createWall(config.totalWidth - wallThickness/2, wallHeight/2, config.totalDepth/2, wallThickness, wallHeight, config.totalDepth, true)}

      {/* INTERIOR WALLS */}
      {/* Living room to kitchen */}
      {createWall(config.living.x + config.living.width/2, wallHeight/2, config.living.z + config.living.depth + wallThickness/2, config.living.width, wallHeight, wallThickness, false, true)}
      
      {/* Living room to bedroom */}
      {createWall(config.living.x + config.living.width + wallThickness/2, wallHeight/2, config.living.z + config.living.depth/2, wallThickness, wallHeight, config.living.depth, false, true)}
      
      {/* Bathroom walls */}
      {createWall(config.bathroom.x + config.bathroom.width/2, wallHeight/2, config.bathroom.z + wallThickness/2, config.bathroom.width, wallHeight, wallThickness, false, true)}
      
      {/* Bedroom 2 separation (if exists) */}
      {config.bedroom2 && createWall(
        config.bedroom.x + config.bedroom.width/2, 
        wallHeight/2, 
        config.bedroom.z + config.bedroom.depth + wallThickness/2, 
        config.bedroom.width, 
        wallHeight, 
        wallThickness, 
        false, 
        true
      )}

      {/* FURNITURE IN LIVING ROOM */}
      {selectedFurniture.includes('sofa') && (
        <DetailedFurniture 
          type="sofa" 
          position={[
            config.living.x + config.living.width/2, 
            0, 
            config.living.z + config.living.depth * 0.6
          ]} 
        />
      )}
      {selectedFurniture.includes('table') && (
        <DetailedFurniture 
          type="table" 
          position={[
            config.living.x + config.living.width/2, 
            0, 
            config.living.z + config.living.depth * 0.3
          ]} 
        />
      )}

      {/* FURNITURE IN BEDROOMS */}
      {selectedFurniture.includes('bed') && (
        <DetailedFurniture 
          type="bed" 
          position={[
            config.bedroom.x + config.bedroom.width/2, 
            0, 
            config.bedroom.z + config.bedroom.depth/2
          ]} 
        />
      )}
      {config.bedroom2 && selectedFurniture.includes('bed') && (
        <DetailedFurniture 
          type="bed" 
          position={[
            config.bedroom2.x + config.bedroom2.width/2, 
            0, 
            config.bedroom2.z + config.bedroom2.depth/2
          ]} 
          scale={0.9}
        />
      )}
      {config.bedroom3 && selectedFurniture.includes('bed') && (
        <DetailedFurniture 
          type="bed" 
          position={[
            config.bedroom3.x + config.bedroom3.width/2, 
            0, 
            config.bedroom3.z + config.bedroom3.depth/2
          ]} 
          scale={0.85}
        />
      )}

      {/* KITCHEN FURNITURE */}
      <group position={[config.kitchen.x + config.kitchen.width/2, 0, config.kitchen.z + 0.3]}>
        {/* Kitchen counter */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[config.kitchen.width * 0.8, 0.9, 0.6]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.4} metalness={0.6} />
        </mesh>
      </group>

      {/* BALCONY RAILING */}
      <group position={[config.balcony.x + config.balcony.width/2, 0.5, config.balcony.z + wallThickness/2]}>
        <mesh castShadow>
          <boxGeometry args={[config.balcony.width, 1, 0.05]} />
          <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* POOL ON BALCONY (for larger apartments) */}
      {floorPlan !== '1+1' && (
        <mesh 
          position={[
            config.balcony.x + config.balcony.width/2, 
            0.35, 
            config.balcony.z + config.balcony.depth/2
          ]} 
          castShadow 
          receiveShadow
        >
          <boxGeometry args={[config.balcony.width * 0.7, 0.7, config.balcony.depth * 0.6]} />
          <meshStandardMaterial 
            color="#4da6ff" 
            transparent 
            opacity={0.8} 
            roughness={0.1}
            metalness={0.3}
          />
        </mesh>
      )}
    </group>
  );
};
