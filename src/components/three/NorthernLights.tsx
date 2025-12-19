import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Northern Lights (Aurora Borealis) Effect
 * Creates beautiful, animated aurora in the sky
 */
export function NorthernLights() {
  const auroraRef1 = useRef<THREE.Mesh>(null)
  const auroraRef2 = useRef<THREE.Mesh>(null)
  const auroraRef3 = useRef<THREE.Mesh>(null)

  // Create gradient textures for the aurora layers
  const auroraTextures = useMemo(() => {
    const createAuroraTexture = (color1: THREE.Color, color2: THREE.Color) => {
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 512
      const ctx = canvas.getContext('2d')!
      
      // Create gradient
      const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
      gradient.addColorStop(0, `rgba(${color1.r * 255}, ${color1.g * 255}, ${color1.b * 255}, 0.8)`)
      gradient.addColorStop(0.5, `rgba(${color2.r * 255}, ${color2.g * 255}, ${color2.b * 255}, 0.4)`)
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 512, 512)
      
      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      return texture
    }

    return [
      createAuroraTexture(new THREE.Color('#00ff88'), new THREE.Color('#00ccaa')), // Green-cyan
      createAuroraTexture(new THREE.Color('#4444ff'), new THREE.Color('#8844ff')), // Blue-purple
      createAuroraTexture(new THREE.Color('#ff00aa'), new THREE.Color('#cc0088')), // Pink-magenta
    ]
  }, [])

  // Animate the aurora layers
  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (auroraRef1.current) {
      auroraRef1.current.position.x = Math.sin(time * 0.1) * 15
      auroraRef1.current.position.z = Math.cos(time * 0.15) * 10
      auroraRef1.current.rotation.z = time * 0.05
      auroraRef1.current.material.opacity = 0.3 + Math.sin(time * 0.5) * 0.15
    }

    if (auroraRef2.current) {
      auroraRef2.current.position.x = Math.cos(time * 0.12) * 12
      auroraRef2.current.position.z = Math.sin(time * 0.08) * 15
      auroraRef2.current.rotation.z = -time * 0.03
      auroraRef2.current.material.opacity = 0.25 + Math.cos(time * 0.4) * 0.1
    }

    if (auroraRef3.current) {
      auroraRef3.current.position.x = Math.sin(time * 0.08) * 10
      auroraRef3.current.position.z = Math.cos(time * 0.1) * 12
      auroraRef3.current.rotation.z = time * 0.04
      auroraRef3.current.material.opacity = 0.2 + Math.sin(time * 0.6) * 0.12
    }
  })

  return (
    <group>
      {/* Aurora Layer 1 - Green/Cyan */}
      <mesh ref={auroraRef1} position={[0, 25, -30]} rotation={[-Math.PI / 2.5, 0, 0]}>
        <planeGeometry args={[60, 40]} />
        <meshBasicMaterial
          map={auroraTextures[0]}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Aurora Layer 2 - Blue/Purple */}
      <mesh ref={auroraRef2} position={[0, 22, -28]} rotation={[-Math.PI / 2.3, 0, 0]}>
        <planeGeometry args={[55, 35]} />
        <meshBasicMaterial
          map={auroraTextures[1]}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Aurora Layer 3 - Pink/Magenta (subtle) */}
      <mesh ref={auroraRef3} position={[0, 28, -32]} rotation={[-Math.PI / 2.7, 0, 0]}>
        <planeGeometry args={[50, 30]} />
        <meshBasicMaterial
          map={auroraTextures[2]}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Extra ambient particles for shimmer effect */}
      <AuroraParticles />
    </group>
  )
}

/**
 * Subtle shimmering particles that add depth to the aurora
 */
function AuroraParticles() {
  const particlesRef = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const count = 300
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const auroraColors = [
      new THREE.Color('#00ff88'),
      new THREE.Color('#4444ff'),
      new THREE.Color('#ff00aa'),
      new THREE.Color('#00ccaa'),
      new THREE.Color('#8844ff'),
    ]

    for (let i = 0; i < count; i++) {
      // Spread particles across the sky
      positions[i * 3] = (Math.random() - 0.5) * 80
      positions[i * 3 + 1] = 15 + Math.random() * 25
      positions[i * 3 + 2] = -20 - Math.random() * 30

      // Random aurora color
      const color = auroraColors[Math.floor(Math.random() * auroraColors.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime
      particlesRef.current.rotation.y = time * 0.02
      
      // Gentle wave motion
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length / 3; i++) {
        const x = positions[i * 3]
        const z = positions[i * 3 + 2]
        positions[i * 3 + 1] = 15 + Math.random() * 25 + Math.sin(time + x * 0.1 + z * 0.1) * 2
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.4}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        vertexColors
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

