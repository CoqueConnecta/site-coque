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

// Fragment shader - Domain-warped FBM for organic blob animation
// Colors from Framer design tokens: #f58634 (orange) + #411409 (dark blobs)
const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  // Value noise hash
  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 74.27);
    return fract(p.x * p.y);
  }

  // Smooth value noise
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

  // Fractal Brownian Motion
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.87758, 0.47943, -0.47943, 0.87758); // 30deg rotation
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.0 + vec2(100.0);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.045;

    // Domain warping - nested FBM calls for organic shapes (Inigo Quilez technique)
    vec2 q = vec2(
      fbm(uv + vec2(0.0, t)),
      fbm(uv + vec2(5.2, 1.3 + t * 0.8))
    );

    vec2 r = vec2(
      fbm(uv + 4.0 * q + vec2(1.7 + t * 0.25, 9.2)),
      fbm(uv + 4.0 * q + vec2(8.3, 2.8 + t * 0.35))
    );

    float f = fbm(uv + 4.0 * r);

    // Bias blobs toward top-right (matching the Framer prototype visual)
    float rightBias = smoothstep(0.2, 0.9, uv.x);
    float topBias   = smoothstep(0.1, 0.8, uv.y);
    float bias = clamp(rightBias * 0.8 + topBias * 0.6, 0.0, 1.0);

    f = mix(f * 0.35, f, bias);

    // Framer design tokens
    // colorOrange = #f58634
    vec3 colorOrange = vec3(0.961, 0.525, 0.204);
    // colorDark = #411409 (dark brown for blobs)
    vec3 colorDark   = vec3(0.255, 0.078, 0.035);
    // colorHighlight = warmer highlight for edges
    vec3 colorWarm   = vec3(0.980, 0.700, 0.455);

    // Mix: orange base -> dark blobs, with warm highlight at edges
    vec3 color = mix(colorOrange, colorDark, clamp(f * 2.2 - 0.4, 0.0, 1.0));
    color = mix(color, colorWarm, clamp((1.0 - f) * f * 2.8, 0.0, 0.25));

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
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

  return <div ref={containerRef} className={cn('absolute inset-0', className)} />;
};

HeroCanvas.displayName = 'HeroCanvas';
