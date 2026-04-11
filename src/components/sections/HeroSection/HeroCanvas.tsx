// A importação agora é da versão 2 (mais leve e performática)
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';
import { cn } from '../../../lib/cn';

export interface HeroCanvasProps {
  className?: string;
}

export const HeroCanvas = ({ className }: HeroCanvasProps) => {
  return (
    <div className={cn('absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#ff6a1a]', className)}>
      <ShaderGradientCanvas
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
        pixelDensity={1}
        fov={45}
      >
        <ShaderGradient
          control="props"
          animate="on"
          type="waterPlane"
          
          grain="off"         // Tira o granulado
          uSpeed={0.15}       // Velocidade ideal para 60fps na web (0.4 era pro GIF)
          
          // Cores Originais do Designer
          color1="#ff6a1a"
          color2="#c73c00"
          color3="#fd4912"
          
          // Configurações da Onda
          uAmplitude={1}
          uDensity={1.3}
          uFrequency={5.5}
          uStrength={4}
          
          // Rotação e Posição
          positionX={-1.4}
          positionY={0}
          positionZ={0}
          rotationX={0}
          rotationY={10}
          rotationZ={50}
          
          // Iluminação e Câmera
          brightness={1.5}
          reflection={0.1}
          lightType="3d"
          envPreset="city"
          cameraZoom={1}
          cAzimuthAngle={180}
          cPolarAngle={90}
          cDistance={3.99}
          
          wireframe={false}
        />
      </ShaderGradientCanvas>
    </div>
  );
};

HeroCanvas.displayName = 'HeroCanvas';
