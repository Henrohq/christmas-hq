import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COSMIC_STAR_CONFIG } from '@/lib/specialAccess'

interface CosmicStarProps {
  position?: [number, number, number]
  scale?: [number, number, number]
}

/**
 * Cosmic Star - A mystical moving gradient star
 * Reserved for the chosen ones with special access
 */
export function CosmicStar({ 
  position = [0, 7.5, 0], 
  scale = [0.4, 0.4, 0.1] 
}: CosmicStarProps) {
  const starRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  // Create star geometry
  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    const outerRadius = 1
    const innerRadius = 0.4
    const points = 5

    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius
      const angle = (i * Math.PI) / points - Math.PI / 2
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      if (i === 0) {
        shape.moveTo(x, y)
      } else {
        shape.lineTo(x, y)
      }
    }
    shape.closePath()

    return new THREE.ExtrudeGeometry(shape, { depth: 0.3, bevelEnabled: false })
  }, [])

  // Shader material with animated gradient
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(COSMIC_STAR_CONFIG.gradientColors[0]) },
        color2: { value: new THREE.Color(COSMIC_STAR_CONFIG.gradientColors[1]) },
        color3: { value: new THREE.Color(COSMIC_STAR_CONFIG.gradientColors[2]) },
        color4: { value: new THREE.Color(COSMIC_STAR_CONFIG.gradientColors[3]) },
        color5: { value: new THREE.Color(COSMIC_STAR_CONFIG.gradientColors[4]) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform vec3 color4;
        uniform vec3 color5;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          // Create flowing gradient based on position and time
          float gradient = sin(vPosition.x * 3.0 + time) * 0.5 + 0.5;
          gradient += sin(vPosition.y * 3.0 + time * 1.3) * 0.5 + 0.5;
          gradient += sin(length(vPosition.xy) * 2.0 - time * 0.8) * 0.5 + 0.5;
          gradient /= 3.0;
          
          // Mix between colors based on gradient value
          vec3 finalColor;
          if (gradient < 0.25) {
            finalColor = mix(color1, color2, gradient * 4.0);
          } else if (gradient < 0.5) {
            finalColor = mix(color2, color3, (gradient - 0.25) * 4.0);
          } else if (gradient < 0.75) {
            finalColor = mix(color3, color4, (gradient - 0.5) * 4.0);
          } else {
            finalColor = mix(color4, color5, (gradient - 0.75) * 4.0);
          }
          
          // Add emissive glow
          finalColor *= ${COSMIC_STAR_CONFIG.emissiveIntensity};
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    })
  }, [])

  // Animate star rotation and shader
  useFrame((state) => {
    if (starRef.current) {
      starRef.current.rotation.z = state.clock.elapsedTime * 0.5
    }
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime * COSMIC_STAR_CONFIG.speed
    }
  })

  return (
    <group>
      {/* Main star with cosmic gradient */}
      <mesh 
        ref={starRef} 
        position={position} 
        scale={scale}
        geometry={geometry}
      >
        <primitive ref={materialRef} object={shaderMaterial} attach="material" />
      </mesh>

      {/* Pulsing glow effect */}
      <mesh position={position} scale={scale.map(s => s * 1.3) as [number, number, number]}>
        <primitive object={geometry} attach="geometry" />
        <meshBasicMaterial 
          color="#ff00ff" 
          transparent 
          opacity={0.2}
          depthWrite={false}
        />
      </mesh>

      {/* Point light with color cycling */}
      <pointLight 
        position={position} 
        color={COSMIC_STAR_CONFIG.gradientColors[0]} 
        intensity={1.5} 
        distance={6} 
      />
    </group>
  )
}

