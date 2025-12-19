import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CosmicStar } from './CosmicStar'
import { COSMIC_STAR_CONFIG } from '@/lib/specialAccess'

interface ChristmasTreeProps {
  scale?: number
  treeColor?: string
  starColor?: string
  decorationLevel?: 0 | 1 | 2 | 3 | 4 // 0 = bare, 4 = fully decorated
  showBaseDecorations?: boolean
}

// Decoration level thresholds based on message count
export function getDecorationLevel(messageCount: number): 0 | 1 | 2 | 3 | 4 {
  if (messageCount >= 30) return 4
  if (messageCount >= 20) return 3
  if (messageCount >= 10) return 2
  if (messageCount >= 5) return 1
  return 0
}

export function ChristmasTree({ 
  scale = 1, 
  treeColor = '#0d5c0d',
  starColor = '#ffd700',
  decorationLevel = 2,
  showBaseDecorations = true 
}: ChristmasTreeProps) {
  const starRef = useRef<THREE.Mesh>(null)

  // Generate random ornament positions based on decoration level
  const ornaments = useMemo(() => {
    if (!showBaseDecorations) return []
    
    const colors = [0xff0000, 0xffd700, 0x0066ff, 0xff69b4, 0x00ff88, 0xffffff, 0xff6600, 0x9932cc]
    const items: { position: [number, number, number]; color: number; size: number }[] = []
    
    // Number of ornaments based on decoration level
    const ornamentCounts = [0, 10, 20, 32, 45]
    const count = ornamentCounts[decorationLevel]

    for (let i = 0; i < count; i++) {
      const layer = Math.floor(i / 9) % 5
      const layerData = [
        { minY: 1.2, maxY: 2.3, radius: 2.0 },
        { minY: 2.5, maxY: 3.5, radius: 1.7 },
        { minY: 3.7, maxY: 4.8, radius: 1.3 },
        { minY: 5.0, maxY: 5.8, radius: 0.9 },
        { minY: 6.0, maxY: 6.8, radius: 0.5 },
      ][layer]

      const angle = (i * 2.39996) + layer * 0.5 // Golden angle for even distribution
      const y = layerData.minY + (Math.random() * 0.5 + 0.25) * (layerData.maxY - layerData.minY)
      const radiusAtHeight = layerData.radius * (1 - (y - layerData.minY) / (layerData.maxY - layerData.minY) * 0.4)

      items.push({
        position: [
          Math.cos(angle) * radiusAtHeight,
          y,
          Math.sin(angle) * radiusAtHeight,
        ],
        color: colors[i % colors.length],
        size: 0.1 + Math.random() * 0.06,
      })
    }
    return items
  }, [decorationLevel, showBaseDecorations])

  // Generate tree lights based on decoration level
  const lights = useMemo(() => {
    if (!showBaseDecorations || decorationLevel < 1) return []
    
    const colors = [0xffff00, 0xff0000, 0x00ff00, 0x0088ff, 0xff00ff, 0xffffff]
    const items: { position: [number, number, number]; color: number; phase: number }[] = []
    
    const lightCounts = [0, 15, 30, 45, 65]
    const count = lightCounts[decorationLevel]

    for (let i = 0; i < count; i++) {
      const layer = Math.floor(i / 13) % 5
      const layerData = [
        { minY: 1.0, maxY: 2.5, radius: 2.2 },
        { minY: 2.5, maxY: 4.0, radius: 1.8 },
        { minY: 4.0, maxY: 5.2, radius: 1.4 },
        { minY: 5.2, maxY: 6.2, radius: 1.0 },
        { minY: 6.2, maxY: 7.0, radius: 0.6 },
      ][layer]

      const angle = i * 0.618 * Math.PI * 2 // Golden ratio spacing
      const y = layerData.minY + Math.random() * (layerData.maxY - layerData.minY)
      const radiusAtHeight = layerData.radius * (1 - (y - layerData.minY) / (layerData.maxY - layerData.minY) * 0.5)

      items.push({
        position: [
          Math.cos(angle) * radiusAtHeight,
          y,
          Math.sin(angle) * radiusAtHeight,
        ],
        color: colors[i % colors.length],
        phase: Math.random() * Math.PI * 2,
      })
    }
    return items
  }, [decorationLevel, showBaseDecorations])

  // Animate star rotation
  useFrame((state) => {
    if (starRef.current) {
      starRef.current.rotation.z = state.clock.elapsedTime * 0.5
    }
  })

  // Tree layers configuration
  const layers = [
    { radius: 2.5, height: 2.5, y: 1.5 },
    { radius: 2.0, height: 2.2, y: 3.0 },
    { radius: 1.5, height: 2.0, y: 4.3 },
    { radius: 1.0, height: 1.8, y: 5.4 },
    { radius: 0.5, height: 1.5, y: 6.3 },
  ]

  return (
    <group scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.6, 1.5, 12]} />
        <meshStandardMaterial color="#4a3728" roughness={0.9} />
      </mesh>

      {/* Tree Layers */}
      {layers.map((layer, i) => (
        <mesh key={i} position={[0, layer.y, 0]} castShadow receiveShadow>
          <coneGeometry args={[layer.radius, layer.height, 12 + i * 2]} />
          <meshStandardMaterial color={treeColor} roughness={0.8} flatShading />
        </mesh>
      ))}

      {/* Star - Cosmic gradient or regular */}
      {starColor === COSMIC_STAR_CONFIG.id ? (
        <CosmicStar position={[0, 7.5, 0]} scale={[0.4, 0.4, 0.1]} />
      ) : (
        <>
          <mesh ref={starRef} position={[0, 7.5, 0]} scale={[0.4, 0.4, 0.1]}>
            <StarGeometry />
            <meshStandardMaterial
              color={starColor}
              emissive={starColor}
              emissiveIntensity={0.8}
              roughness={0.3}
              metalness={0.8}
            />
          </mesh>

          {/* Star glow */}
          <pointLight position={[0, 7.5, 0]} color={starColor} intensity={1} distance={5} />
        </>
      )}

      {/* Ornaments */}
      {ornaments.map((ornament, i) => (
        <mesh key={`ornament-${i}`} position={ornament.position} castShadow>
          <sphereGeometry args={[ornament.size, 16, 16]} />
          <meshStandardMaterial color={ornament.color} roughness={0.2} metalness={0.8} />
        </mesh>
      ))}

      {/* Lights */}
      {lights.map((light, i) => (
        <TreeLight key={`light-${i}`} {...light} />
      ))}

      {/* Tree glow lights */}
      <pointLight position={[0, 3, 0]} color="#ffaa00" intensity={0.8} distance={12} />
      <pointLight position={[0, 5, 0]} color="#ff6600" intensity={0.5} distance={8} />
    </group>
  )
}

function TreeLight({ position, color, phase }: { position: [number, number, number]; color: number; phase: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const brightness = (Math.sin(state.clock.elapsedTime * 3 + phase) + 1) * 0.5
      ;(meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5 + brightness * 0.5
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={1} />
    </mesh>
  )
}

function StarGeometry() {
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

  return <primitive object={geometry} attach="geometry" />
}
