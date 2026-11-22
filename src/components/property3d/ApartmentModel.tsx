import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { Component, Suspense, useMemo, type ReactNode } from "react";

class SkipOnError extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  override render() { return this.state.failed ? null : this.props.children; }
}

/** Same-origin media path so WebGL textures avoid CORS. */
function textureUrl(url: string) {
  const i = url.indexOf("/api/public/media/");
  return i >= 0 ? url.slice(i) : url;
}
import * as THREE from "three";

type Room = { name: string; x: number; z: number; w: number; d: number; img?: string };

/** Builds a cutaway floor plan from bedroom count; rooms are dressed with the listing's own photos. */
export function buildRooms(bedrooms: number, images: string[]): Room[] {
  const beds = Math.max(0, Math.min(6, bedrooms));
  const rooms: Room[] = [{ name: "Living", x: 0, z: 0, w: 7, d: 5 }, { name: "Kitchen", x: 0, z: -4, w: 4, d: 3 }];
  rooms.push({ name: "Bath", x: 3.5, z: -4, w: 3, d: 3 });
  for (let i = 0; i < beds; i++) {
    const row = Math.floor(i / 2);
    rooms.push({ name: `Bedroom ${i + 1}`, x: i % 2 === 0 ? -6 : 7, z: -4 + row * 4.5, w: 5, d: 4.5 });
  }
  return rooms.map((r, i) => ({ ...r, img: images[(i + 1) % Math.max(images.length, 1)] }));
}

function PhotoWall({ url, w, position }: { url: string; w: number; position: [number, number, number] }) {
  const tex = useLoader(THREE.TextureLoader, textureUrl(url));
  tex.colorSpace = THREE.SRGBColorSpace;
  const img = tex.image as { width?: number; height?: number } | undefined;
  const ratio = img?.width && img?.height ? img.height / img.width : 0.66;
  const width = w * 0.8;
  return (
    <mesh position={position}>
      <planeGeometry args={[width, Math.min(width * ratio, 2.2)]} />
      <meshStandardMaterial map={tex} />
    </mesh>
  );
}

function RoomMesh({ room }: { room: Room }) {
  const h = 2.8, t = 0.12;
  const wall = "#f4efe6";
  return (
    <group position={[room.x + room.w / 2, 0, room.z + room.d / 2]}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[room.w, room.d]} />
        <meshStandardMaterial color={room.name.startsWith("Bath") ? "#d9dde0" : "#b08a63"} />
      </mesh>
      <mesh castShadow position={[0, h / 2, -room.d / 2]}><boxGeometry args={[room.w, h, t]} /><meshStandardMaterial color={wall} /></mesh>
      <mesh castShadow position={[-room.w / 2, h / 2, 0]}><boxGeometry args={[t, h, room.d]} /><meshStandardMaterial color={wall} /></mesh>
      <mesh castShadow position={[room.w / 2, h * 0.2, 0]}><boxGeometry args={[t, h * 0.4, room.d]} /><meshStandardMaterial color={wall} /></mesh>
      {room.name.startsWith("Bedroom") && (
        <mesh castShadow position={[0, 0.3, -room.d / 2 + 1.2]}><boxGeometry args={[1.8, 0.6, 2.1]} /><meshStandardMaterial color="#e8e2d6" /></mesh>
      )}
      {room.name === "Living" && (
        <mesh castShadow position={[0, 0.4, 0.8]}><boxGeometry args={[2.6, 0.8, 0.9]} /><meshStandardMaterial color="#1f2a44" /></mesh>
      )}
      {room.name === "Kitchen" && (
        <mesh castShadow position={[0, 0.45, -room.d / 2 + 0.4]}><boxGeometry args={[room.w * 0.8, 0.9, 0.6]} /><meshStandardMaterial color="#ffffff" /></mesh>
      )}
      {room.img && (
        <SkipOnError><Suspense fallback={null}>
          <PhotoWall url={room.img} w={room.w} position={[0, 1.5, -room.d / 2 + t]} />
        </Suspense></SkipOnError>
      )}
    </group>
  );
}

export default function ApartmentModel({ bedrooms, images }: { bedrooms: number; images: string[] }) {
  const rooms = useMemo(() => buildRooms(bedrooms, images), [bedrooms, images]);
  return (
    <Canvas shadows camera={{ position: [10, 12, 14], fov: 45 }} dpr={[1, 2]}>
      <color attach="background" args={["#0b1324"]} />
      <ambientLight intensity={0.5} />
      <directionalLight castShadow position={[8, 15, 6]} intensity={1.6} shadow-mapSize={[2048, 2048]} />
      <hemisphereLight args={["#fff8ee", "#3a3226", 0.8]} />
      <group position={[-1, 0, 0]}>{rooms.map((r) => <RoomMesh key={r.name} room={r} />)}</group>
      <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={40} blur={2} />
      <OrbitControls makeDefault enableDamping maxPolarAngle={Math.PI / 2.1} minDistance={3} maxDistance={35} target={[1, 0, 0]} />
    </Canvas>
  );
}
