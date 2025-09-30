export const ComplexExterior = ({ facadeColor, roofColor }: { facadeColor: string; roofColor: string }) => {
  return (
    <group>
      {/* Main Building */}
      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[12, 8, 8]} />
        <meshStandardMaterial color={facadeColor} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Roof structure */}
      <mesh position={[0, 8.2, 0]} castShadow>
        <boxGeometry args={[12.5, 0.4, 8.5]} />
        <meshStandardMaterial color={roofColor} roughness={0.7} />
      </mesh>
      
      {/* Balconies - 3 floors */}
      {[1, 2, 3].map((floor) => (
        <group key={floor}>
          {/* Balcony floor */}
          <mesh position={[0, floor * 2.5 - 1, 4.2]} castShadow receiveShadow>
            <boxGeometry args={[10, 0.2, 1.5]} />
            <meshStandardMaterial color="#d0d0d0" roughness={0.5} metalness={0.2} />
          </mesh>
          {/* Balcony railing */}
          <mesh position={[0, floor * 2.5 - 0.3, 4.8]} castShadow>
            <boxGeometry args={[10, 1, 0.1]} />
            <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Railing vertical bars */}
          {[...Array(10)].map((_, i) => (
            <mesh 
              key={i} 
              position={[i * 1 - 4.5, floor * 2.5 - 0.3, 4.8]} 
              castShadow
            >
              <boxGeometry args={[0.05, 1, 0.05]} />
              <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* Windows grid - 3 floors, 4 windows per floor */}
      {[...Array(3)].map((_, floor) =>
        [...Array(4)].map((_, col) => (
          <group key={`${floor}-${col}`}>
            <mesh 
              position={[col * 2.5 - 3.75, floor * 2.5 + 1, 4.01]} 
              castShadow
            >
              <boxGeometry args={[1.5, 2, 0.1]} />
              <meshStandardMaterial 
                color="#a3d5ff" 
                transparent 
                opacity={0.4} 
                metalness={0.8} 
                roughness={0.1}
              />
            </mesh>
            {/* Window frame */}
            <mesh 
              position={[col * 2.5 - 3.75, floor * 2.5 + 1, 4.05]} 
              castShadow
            >
              <boxGeometry args={[1.6, 2.1, 0.05]} />
              <meshStandardMaterial color="#ffffff" roughness={0.5} />
            </mesh>
          </group>
        ))
      )}
      
      {/* Entrance Door */}
      <mesh position={[0, 1, 4.01]} castShadow>
        <boxGeometry args={[2, 2.5, 0.1]} />
        <meshStandardMaterial color="#8b7355" roughness={0.6} metalness={0.2} />
      </mesh>
      
      {/* Entrance canopy */}
      <mesh position={[0, 2.7, 4.8]} castShadow>
        <boxGeometry args={[3, 0.1, 1.5]} />
        <meshStandardMaterial color="#d0d0d0" roughness={0.5} metalness={0.2} />
      </mesh>
      
      {/* Ground / Pavement */}
      <mesh position={[0, 0.01, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#9e9e9e" roughness={0.8} />
      </mesh>
      
      {/* Garden areas on sides */}
      <mesh position={[-10, 0.02, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 20]} />
        <meshStandardMaterial color="#7cb342" roughness={0.9} />
      </mesh>
      <mesh position={[10, 0.02, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 20]} />
        <meshStandardMaterial color="#7cb342" roughness={0.9} />
      </mesh>
    </group>
  );
};
