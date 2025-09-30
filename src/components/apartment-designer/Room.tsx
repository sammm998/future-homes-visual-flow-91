import { useRef } from 'react';
import { Mesh } from 'three';

interface RoomProps {
  floorPlan: string;
  wallColor: string;
  floorColor: string;
}

export const Room = ({ floorPlan, wallColor, floorColor }: RoomProps) => {
  const floorRef = useRef<Mesh>(null);

  // Different room configurations based on floor plan
  const getRoomDimensions = () => {
    switch (floorPlan) {
      case '1-bedroom':
        return { width: 8, depth: 6, wallHeight: 3 };
      case '2-bedroom':
        return { width: 10, depth: 8, wallHeight: 3 };
      case '3-bedroom':
        return { width: 12, depth: 10, wallHeight: 3 };
      default:
        return { width: 8, depth: 6, wallHeight: 3 };
    }
  };

  const { width, depth, wallHeight } = getRoomDimensions();

  return (
    <group>
      {/* Floor */}
      <mesh 
        ref={floorRef} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={floorColor} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, wallHeight / 2, -depth / 2]} receiveShadow>
        <boxGeometry args={[width, wallHeight, 0.2]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-width / 2, wallHeight / 2, 0]} receiveShadow>
        <boxGeometry args={[0.2, wallHeight, depth]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[width / 2, wallHeight / 2, 0]} receiveShadow>
        <boxGeometry args={[0.2, wallHeight, depth]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Window on back wall */}
      <mesh position={[0, wallHeight / 2, -depth / 2 + 0.15]}>
        <boxGeometry args={[2, 1.5, 0.1]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};
