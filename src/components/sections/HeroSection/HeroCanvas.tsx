import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '../../../lib/cn';

// Vertex shader - simple UV passthrough
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader tuned to match the Framer hero mood:
// bright orange field + soft dark blobs + subtle red glow.
const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  float smin(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * h * k * 0.16666667;
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float circleSDF(vec2 p, vec2 c, float r) {
    return length(p - c) - r;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.12;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = uv;
    p.x *= aspect;

    // Orange base close to Framer tokens
    vec3 cBaseA = vec3(0.961, 0.525, 0.204); // #f58634
    vec3 cBaseB = vec3(0.976, 0.420, 0.090);
    vec3 cDark = vec3(0.255, 0.078, 0.035);  // #411409
    vec3 cRedGlow = vec3(0.980, 0.180, 0.100);

    float vGrad = smoothstep(0.0, 1.0, uv.y);
    vec3 color = mix(cBaseA, cBaseB, vGrad * 0.55);

    // Top-right large dark mass (mostly outside viewport)
    vec2 cTop = vec2(1.02 * aspect + sin(t * 0.7) * 0.01, 1.10 + cos(t * 0.5) * 0.01);
    float dTop = circleSDF(p, cTop, 0.95);
    float mTop = smoothstep(0.28, -0.18, dTop);

    // Mid-right soft organic blob
    vec2 cMid = vec2(0.76 * aspect + sin(t * 0.9) * 0.03, 0.48 + cos(t * 0.8) * 0.02);
    float dMidA = circleSDF(p, cMid, 0.50);
    float dMidB = circleSDF(p, cMid + vec2(-0.12, 0.07), 0.34);
    float dMid = smin(dMidA, dMidB, 0.25);
    float mMid = smoothstep(0.20, -0.12, dMid);

    // Left red glow region
    vec2 cLeft = vec2(0.18 * aspect + cos(t * 0.6) * 0.015, 0.55 + sin(t * 0.5) * 0.02);
    float dLeft = circleSDF(p, cLeft, 0.22);
    float mLeft = smoothstep(0.26, -0.20, dLeft);

    // Warm broad center glow
    vec2 cWarm = vec2(0.52 * aspect, 0.36);
    float dWarm = circleSDF(p, cWarm, 0.62);
    float mWarm = smoothstep(0.48, -0.35, dWarm) * 0.25;

    // Slight breakup to avoid perfect circles
    float breakup = (noise(uv * vec2(5.0, 3.5) + t * 0.35) - 0.5) * 0.12;
    mTop = clamp(mTop + breakup * 0.6, 0.0, 1.0);
    mMid = clamp(mMid + breakup, 0.0, 1.0);

    color = mix(color, cDark, mTop * 0.58);
    color = mix(color, cDark, mMid * 0.62);
    color = mix(color, cRedGlow, mLeft * 0.42);
    color += vec3(0.09, 0.03, 0.0) * mWarm;

    // Subtle vignette for contrast similar to screenshot
    float vignette = smoothstep(0.92, 0.22, distance(uv, vec2(0.5, 0.52)));
    color *= mix(0.90, 1.03, vignette);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export interface HeroCanvasProps {
  className?: string;
}

export const HeroCanvas = ({ className }: HeroCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Renderer - antialias off for performance (shader-based, no geometry edges)
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Orthographic camera for fullscreen quad
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const scene = new THREE.Scene();

    // Fullscreen quad: PlaneGeometry(2,2) fills the [-1,1]x[-1,1] camera space
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uResolution: {
          value: new THREE.Vector2(container.clientWidth, container.clientHeight),
        },
      },
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      material.uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    // Responsive resize
    const handleResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      material.uniforms.uResolution.value.set(container.clientWidth, container.clientHeight);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={cn('absolute inset-0 pointer-events-none', className)} />;
};

HeroCanvas.displayName = 'HeroCanvas';
