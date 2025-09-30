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

export const Room3D = ({ floorPlan, wallColor, floorColor, selectedFurniture, properties }: Room3DProps) => {
  const groupRef = useRef<Group>(null);

  // Room configurations based on apartment types (1+1, 2+1, 3+1)
  const getRoomConfig = () => {
    switch (floorPlan) {
      case '1+1': // 1 bedroom + 1 living room
        return {
          rooms: [
            { type: 'living', position: [0, 0, 0], width: 6, depth: 5 },
            { type: 'bedroom', position: [6.5, 0, 0], width: 4, depth: 4 },
            { type: 'kitchen', position: [0, 0, -5.5], width: 3, depth: 2.5 },
            { type: 'bathroom', position: [3.5, 0, -5.5], width: 2.5, depth: 2.5 },
          ],
          balcony: { position: [10.5, 0, -1], width: 3, depth: 4 }
        };
      case '2+1': // 2 bedrooms + 1 living room
        return {
          rooms: [
            { type: 'living', position: [0, 0, 0], width: 7, depth: 6 },
            { type: 'bedroom', position: [7.5, 0, 2], width: 4.5, depth: 4 },
            { type: 'bedroom2', position: [7.5, 0, -2.5], width: 4.5, depth: 3.5 },
            { type: 'kitchen', position: [0, 0, -6.5], width: 4, depth: 3 },
            { type: 'bathroom', position: [4.5, 0, -6.5], width: 2.5, depth: 3 },
          ],
          balcony: { position: [12, 0, 0], width: 3.5, depth: 6 }
        };
      case '3+1': // 3 bedrooms + 1 living room
        return {
          rooms: [
            { type: 'living', position: [0, 0, 0], width: 8, depth: 7 },
            { type: 'bedroom', position: [8.5, 0, 3], width: 4.5, depth: 4 },
            { type: 'bedroom2', position: [8.5, 0, -1.5], width: 4.5, depth: 4 },
            { type: 'bedroom3', position: [8.5, 0, -6], width: 4.5, depth: 4 },
            { type: 'kitchen', position: [0, 0, -7.5], width: 5, depth: 3.5 },
            { type: 'bathroom', position: [5.5, 0, -7.5], width: 2.5, depth: 3.5 },
          ],
          balcony: { position: [13, 0, 0], width: 4, depth: 7 }
        };
      default:
        return {
          rooms: [{ type: 'living', position: [0, 0, 0], width: 6, depth: 5 }],
          balcony: { position: [6.5, 0, 0], width: 3, depth: 5 }
        };
    }
  };

  const config = getRoomConfig();
  const wallHeight = 3;
  const wallThickness = 0.15;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Render all rooms */}
      {config.rooms.map((room, idx) => (
        <group key={idx} position={room.position as [number, number, number]}>
          {/* Floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[room.width, room.depth]} />
            <meshStandardMaterial 
              color={room.type.includes('bathroom') ? '#e8e8e8' : floorColor} 
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>

          {/* Room-specific furniture */}
          {room.type === 'living' && selectedFurniture.includes('sofa') && (
            <DetailedFurniture type="sofa" position={[0, 0, room.depth / 3]} />
          )}
          {room.type === 'living' && selectedFurniture.includes('table') && (
            <DetailedFurniture type="table" position={[0, 0, -room.depth / 4]} />
          )}
          {(room.type === 'bedroom' || room.type === 'bedroom2' || room.type === 'bedroom3') && 
           selectedFurniture.includes('bed') && (
            <DetailedFurniture type="bed" position={[0, 0, 0]} />
          )}
          {room.type === 'kitchen' && selectedFurniture.includes('table') && (
            <DetailedFurniture type="table" position={[0, 0, 0]} scale={0.7} />
          )}
        </group>
      ))}

      {/* Build walls between rooms */}
      {config.rooms.map((room, idx) => {
        const [x, y, z] = room.position;
        const halfW = room.width / 2;
        const halfD = room.depth / 2;

        return (
          <group key={`walls-${idx}`}>
            {/* Back wall */}
            <mesh position={[x, wallHeight / 2, z - halfD]} castShadow receiveShadow>
              <boxGeometry args={[room.width, wallHeight, wallThickness]} />
              <meshStandardMaterial color={wallColor} roughness={0.7} />
            </mesh>
            {/* Front wall */}
            <mesh position={[x, wallHeight / 2, z + halfD]} castShadow receiveShadow>
              <boxGeometry args={[room.width, wallHeight, wallThickness]} />
              <meshStandardMaterial color={wallColor} roughness={0.7} />
            </mesh>
            {/* Left wall */}
            <mesh position={[x - halfW, wallHeight / 2, z]} castShadow receiveShadow>
              <boxGeometry args={[wallThickness, wallHeight, room.depth]} />
              <meshStandardMaterial color={wallColor} roughness={0.7} />
            </mesh>
            {/* Right wall */}
            <mesh position={[x + halfW, wallHeight / 2, z]} castShadow receiveShadow>
              <boxGeometry args={[wallThickness, wallHeight, room.depth]} />
              <meshStandardMaterial color={wallColor} roughness={0.7} />
            </mesh>

            {/* Windows for living room and bedrooms */}
            {(room.type === 'living' || room.type.includes('bedroom')) && (
              <mesh position={[x, wallHeight / 2 + 0.5, z - halfD + 0.1]} castShadow>
                <boxGeometry args={[room.width * 0.4, 1.2, 0.05]} />
                <meshStandardMaterial 
                  color="#87ceeb" 
                  transparent 
                  opacity={0.4} 
                  roughness={0.1}
                  metalness={0.5}
                />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Balcony */}
      {config.balcony && (
        <group position={config.balcony.position as [number, number, number]}>
          {/* Balcony floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[config.balcony.width, config.balcony.depth]} />
            <meshStandardMaterial color="#c9a47a" roughness={0.9} />
          </mesh>

          {/* Balcony railings */}
          <mesh position={[0, 0.5, config.balcony.depth / 2]} castShadow>
            <boxGeometry args={[config.balcony.width, 1, 0.05]} />
            <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[config.balcony.width / 2, 0.5, 0]} castShadow>
            <boxGeometry args={[0.05, 1, config.balcony.depth]} />
            <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[-config.balcony.width / 2, 0.5, 0]} castShadow>
            <boxGeometry args={[0.05, 1, config.balcony.depth]} />
            <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Small pool on balcony for larger apartments */}
          {floorPlan !== '1+1' && (
            <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
              <boxGeometry args={[config.balcony.width * 0.6, 0.6, config.balcony.depth * 0.5]} />
              <meshStandardMaterial 
                color="#4da6ff" 
                transparent 
                opacity={0.7} 
                roughness={0.1}
                metalness={0.3}
              />
            </mesh>
          )}
        </group>
      )}
    </group>
  );
};
