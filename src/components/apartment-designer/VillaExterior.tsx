export const VillaExterior = ({ facadeColor, roofColor }: { facadeColor: string; roofColor: string }) => {
  return (
    <group>
      {/* Main Building */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 3, 6]} />
        <meshStandardMaterial color={facadeColor} roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 3.5, 0]} castShadow rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[6, 2, 4]} />
        <meshStandardMaterial color={roofColor} roughness={0.8} />
      </mesh>
      
      {/* Windows - Front */}
      {[[-2, 1.5, 3.01], [2, 1.5, 3.01]].map((pos, i) => (
        <group key={`front-${i}`}>
          <mesh position={pos as any} castShadow>
            <boxGeometry args={[1.2, 1.5, 0.1]} />
            <meshStandardMaterial 
              color="#a3d5ff" 
              transparent 
              opacity={0.4} 
              metalness={0.8} 
              roughness={0.1}
            />
          </mesh>
          {/* Window frame */}
          <mesh position={[pos[0], pos[1], pos[2] + 0.05]} castShadow>
            <boxGeometry args={[1.3, 1.6, 0.05]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
        </group>
      ))}
      
      {/* Windows - Back */}
      {[[-2, 1.5, -3.01], [2, 1.5, -3.01]].map((pos, i) => (
        <group key={`back-${i}`}>
          <mesh position={pos as any} castShadow>
            <boxGeometry args={[1.2, 1.5, 0.1]} />
            <meshStandardMaterial 
              color="#a3d5ff" 
              transparent 
              opacity={0.4} 
              metalness={0.8} 
              roughness={0.1}
            />
          </mesh>
        </group>
      ))}
      
      {/* Front Door */}
      <mesh position={[0, 1, 3.01]} castShadow>
        <boxGeometry args={[1, 2.2, 0.1]} />
        <meshStandardMaterial color="#8b7355" roughness={0.6} metalness={0.2} />
      </mesh>
      
      {/* Door handle */}
      <mesh position={[0.4, 1, 3.1]} castShadow>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Garden */}
      <mesh position={[0, 0.01, 8]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color="#7cb342" roughness={0.9} />
      </mesh>
      
      {/* Path */}
      <mesh position={[0, 0.02, 5.5]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 5]} />
        <meshStandardMaterial color="#9e9e9e" roughness={0.8} />
      </mesh>
    </group>
  );
};
