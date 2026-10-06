"use client";

import { Float, Image as DreiImage, Lightformer, Environment, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";

const photos = [
  { url: "/images/hug.jpg", pos: [2.0, 0.55, 0.4], scale: [2.1, 1.25], rot: -0.12 },
  { url: "/images/caregiver-smile.jpg", pos: [3.05, -0.95, -0.6], scale: [1.45, 1.3], rot: 0.14 },
  { url: "/images/forehead.jpg", pos: [1.55, -1.45, 1.1], scale: [1.5, 0.9], rot: 0.08 },
  { url: "/images/pointing.jpg", pos: [3.3, 1.55, -1.4], scale: [1.6, 0.95], rot: -0.06 },
] as const;

function Rig({ mobile }: { mobile: boolean }) {
  const { camera, pointer } = useThree();
  useFrame((state, delta) => {
    const scroll = typeof window === "undefined" ? 0 : Math.min(window.scrollY / window.innerHeight, 1.2);
    const tx = mobile ? 1.9 : -1.1 + pointer.x * 0.6;
    const ty = (mobile ? -3.1 : pointer.y * 0.35) - scroll * 1.6;
    const tz = (mobile ? 15 : 7.4) + scroll * 1.5;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, tx, 3, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, ty, 3, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, tz, 3, delta);
    camera.lookAt(mobile ? 1.9 : 0.5, (mobile ? -3.1 : 0) - scroll * 1.2, 0);
  });
  return null;
}

function Blob() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.12;
    ref.current.rotation.y += delta * 0.18;
    const t = state.clock.elapsedTime;
    ref.current.position.y = 0.2 + Math.sin(t * 0.6) * 0.15;
  });
  return (
    <mesh ref={ref} position={[2.2, 0.2, -2.2]} scale={1.9}>
      <icosahedronGeometry args={[1, 64]} />
      <MeshDistortMaterial
        color="#7b6cf0"
        distort={0.38}
        speed={1.6}
        roughness={0.08}
        metalness={0.35}
        clearcoat={1}
        clearcoatRoughness={0.1}
        envMapIntensity={1.4}
      />
    </mesh>
  );
}

function Torus() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.25;
    ref.current.rotation.z += delta * 0.15;
  });
  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={ref} position={[0.6, 2.0, -1.4]} scale={0.38}>
        <torusGeometry args={[1, 0.36, 48, 128]} />
        <meshPhysicalMaterial color="#0a73b0" roughness={0.15} metalness={0.6} clearcoat={1} envMapIntensity={1.3} />
      </mesh>
    </Float>
  );
}

function Pebble({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) {
  return (
    <Float speed={2.6} rotationIntensity={1.4} floatIntensity={1.6}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshPhysicalMaterial color={color} roughness={0.1} metalness={0.2} clearcoat={1} envMapIntensity={1.2} />
      </mesh>
    </Float>
  );
}

function PhotoCard({
  url,
  pos,
  scale,
  rot,
  i,
}: {
  url: string;
  pos: readonly [number, number, number];
  scale: readonly [number, number];
  rot: number;
  i: number;
}) {
  const group = useRef<THREE.Group>(null);
  const born = useRef<number | null>(null);
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    if (born.current === null) born.current = state.clock.elapsedTime;
    // Staggered cinematic entrance: fly in from depth with a spin.
    const p = Math.min(Math.max((state.clock.elapsedTime - born.current - 0.4 - i * 0.22) / 1.4, 0), 1);
    const e = 1 - Math.pow(1 - p, 4);
    g.position.z = THREE.MathUtils.lerp(pos[2] - 6, pos[2], e);
    g.rotation.y = THREE.MathUtils.lerp(-1.2, 0, e) + state.pointer.x * 0.12;
    g.rotation.x = -state.pointer.y * 0.08;
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, e, 6, delta));
  });
  return (
    <group ref={group} position={[pos[0], pos[1], pos[2]]} rotation={[0, 0, rot]}>
      <Float speed={1.4 + i * 0.2} rotationIntensity={0.25} floatIntensity={0.5}>
        <DreiImage url={url} scale={[scale[0], scale[1]]} radius={0.12} transparent toneMapped={false} />
      </Float>
    </group>
  );
}

export default function HeroScene({ mobile }: { mobile: boolean }) {
  return (
    <Canvas
      dpr={mobile ? 1 : [1, 1.75]}
      camera={{ position: [0, 0, 7], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 5]} intensity={1.6} />
        <pointLight position={[-4, -2, 3]} intensity={30} color="#b351eb" />
        <Blob />
        <Torus />
        <Pebble position={[4.6, -0.2, -0.4]} color="#b351eb" scale={0.28} />
        <Pebble position={[0.4, -1.9, 0.6]} color="#f3e6fc" scale={0.18} />
        <Pebble position={[2.6, 2.4, 0.2]} color="#559ec8" scale={0.22} />
        {photos.map((p, i) => (
          <PhotoCard key={p.url} {...p} i={i} />
        ))}
        <Sparkles count={60} scale={[10, 6, 4]} size={2.4} speed={0.35} color="#b351eb" opacity={0.6} />
        <Environment resolution={256}>
          <Lightformer intensity={2.5} position={[0, 4, -6]} scale={[12, 3, 1]} color="#ffffff" />
          <Lightformer intensity={2} position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[10, 4, 1]} color="#b351eb" />
          <Lightformer intensity={2} position={[6, -1, 2]} rotation-y={-Math.PI / 2} scale={[10, 4, 1]} color="#0a73b0" />
          <Lightformer form="ring" intensity={3} position={[0, 0, 6]} scale={3} color="#ffffff" />
        </Environment>
        <Rig mobile={mobile} />
      </Suspense>
    </Canvas>
  );
}
