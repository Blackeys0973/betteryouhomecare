"use client";

import { useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uVel;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    // Paper-like bend while scrolling fast.
    p.z += sin(uv.y * 3.14159) * uVel * 0.35;
    p.z += sin(uv.x * 6.0 + uTime * 0.8) * 0.015;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D uTex;
  uniform vec2 uPlane;
  uniform vec2 uImage;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uTime;
  uniform float uVel;
  uniform float uRadius;
  uniform float uReveal;
  varying vec2 vUv;

  vec2 cover(vec2 uv) {
    float rp = uPlane.x / uPlane.y;
    float ri = uImage.x / uImage.y;
    vec2 s = rp > ri ? vec2(1.0, ri / rp) : vec2(rp / ri, 1.0);
    return (uv - 0.5) * s + 0.5;
  }

  float roundedMask(vec2 uv) {
    vec2 px = uv * uPlane;
    vec2 q = abs(px - uPlane * 0.5) - (uPlane * 0.5 - uRadius);
    float d = length(max(q, 0.0)) - uRadius;
    return 1.0 - smoothstep(-1.5, 0.5, d);
  }

  void main() {
    vec2 uv = vUv;
    // Liquid ripple around the pointer.
    float d = distance(uv * uPlane / uPlane.y, uMouse * uPlane / uPlane.y);
    float ripple = sin(d * 28.0 - uTime * 3.0) * smoothstep(0.45, 0.0, d) * 0.012 * uHover;
    uv += normalize(uv - uMouse + 0.0001) * ripple;
    // Gentle zoom-out as it reveals.
    vec2 cuv = cover((uv - 0.5) / (1.0 + (1.0 - uReveal) * 0.25) + 0.5);
    float shift = 0.0025 * uHover + abs(uVel) * 0.04;
    float r = texture2D(uTex, cuv + vec2(shift, 0.0)).r;
    float g = texture2D(uTex, cuv).g;
    float b = texture2D(uTex, cuv - vec2(shift, 0.0)).b;
    vec3 col = vec3(r, g, b);
    // Subtle grade toward the brand night palette.
    col = mix(col, col * vec3(0.98, 0.97, 1.03), 0.3);
    float vign = smoothstep(1.1, 0.35, distance(vUv, vec2(0.5)));
    col *= mix(0.92, 1.0, vign);
    gl_FragColor = vec4(col, roundedMask(vUv));
  }
`;

function Plane({ src, progress, hover }: { src: string; progress?: MotionValue<number>; hover: React.MutableRefObject<{ x: number; y: number; on: number }> }) {
  const tex = useTexture(src);
  const mesh = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();
  const lastScroll = useRef(0);
  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uPlane: { value: new THREE.Vector2(1, 1) },
      uImage: { value: new THREE.Vector2(tex.image.width, tex.image.height) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uTime: { value: 0 },
      uVel: { value: 0 },
      uRadius: { value: 24 },
      uReveal: { value: 0 },
    }),
    [tex],
  );

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const p = progress ? progress.get() : 1;
    // From a framed card to full-bleed.
    const mobile = size.width < 768;
    const startW = mobile ? 0.86 : 0.42;
    const startH = mobile ? 0.5 : 0.62;
    const w = THREE.MathUtils.lerp(startW, 1, p);
    const h = THREE.MathUtils.lerp(startH, 1, p);
    m.scale.set(viewport.width * w, viewport.height * h, 1);
    uniforms.uPlane.value.set(size.width * w, size.height * h);
    uniforms.uRadius.value = THREE.MathUtils.lerp(mobile ? 18 : 28, 0, p);
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uReveal.value = THREE.MathUtils.damp(uniforms.uReveal.value, 1, 1.4, delta);
    const sc = window.scrollY;
    const v = THREE.MathUtils.clamp((sc - lastScroll.current) / 60, -1, 1);
    lastScroll.current = sc;
    uniforms.uVel.value = THREE.MathUtils.damp(uniforms.uVel.value, v, 6, delta);
    uniforms.uHover.value = THREE.MathUtils.damp(uniforms.uHover.value, hover.current.on, 4, delta);
    uniforms.uMouse.value.x = THREE.MathUtils.damp(uniforms.uMouse.value.x, hover.current.x, 6, delta);
    uniforms.uMouse.value.y = THREE.MathUtils.damp(uniforms.uMouse.value.y, hover.current.y, 6, delta);
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[1, 1, 48, 48]} />
      <shaderMaterial vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} transparent />
    </mesh>
  );
}

export default function LiquidImage({ src, progress, className }: { src: string; progress?: MotionValue<number>; className?: string }) {
  const hover = useRef({ x: 0.5, y: 0.5, on: 0 });
  return (
    <div
      className={className}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        hover.current = { x: (e.clientX - r.left) / r.width, y: 1 - (e.clientY - r.top) / r.height, on: 1 };
      }}
      onPointerLeave={() => (hover.current.on = 0)}
    >
      <Canvas dpr={[1, 1.75]} orthographic={false} camera={{ position: [0, 0, 5], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <Plane src={src} progress={progress} hover={hover} />
        </Suspense>
      </Canvas>
    </div>
  );
}
