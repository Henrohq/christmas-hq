import { useRef, useState, useMemo, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Message, Profile } from '@/types/database'

interface MessageDecorationProps {
  message: Message
  sender?: Profile
  position: [number, number, number]
  onClick: () => void
}

// PERFORMANCE OPTIMIZED: Reduced polygon counts, removed lights, memoized components
// Gift box decoration - placed at base of tree (50% BIGGER)
export const GiftDecoration = memo(function GiftDecoration({ message, sender, position, onClick }: MessageDecorationProps) {
  const groupRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  const animOffset = useRef(Math.random() * Math.PI * 2)

  // OPTIMIZED: Only animate on hover, plus glow pulse
  useFrame((state) => {
    if (groupRef.current && hovered) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.5 + animOffset.current) * 0.08
    }
    
    // Pulsing glow effect
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 0.8 + animOffset.current) * 0.5 + 0.5
      glowRef.current.scale.setScalar(1 + pulse * 0.15)
    }
  })

  const giftColor = message.decoration_style || '#c41e3a'
  const ribbonColor = '#ffd700'
  // Increased base size by 50% (was 0.4, now 0.6)
  const baseSize = 0.6
  const boxSize = baseSize + (message.position_index || 0) % 3 * 0.15

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerOver={() => {
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
      scale={hovered ? 1.1 : 1}
    >
      {/* Glow effect - outer sphere */}
      <mesh ref={glowRef} position={[0, boxSize / 2, 0]}>
        <sphereGeometry args={[boxSize * 0.8, 8, 8]} />
        <meshBasicMaterial
          color={giftColor}
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>

      {/* Gift box */}
      <mesh castShadow position={[0, boxSize / 2, 0]}>
        <boxGeometry args={[boxSize, boxSize * 0.8, boxSize * 0.7]} />
        <meshStandardMaterial 
          color={giftColor} 
          roughness={0.6}
          emissive={giftColor}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>

      {/* Lid */}
      <mesh position={[0, boxSize * 0.95, 0]}>
        <boxGeometry args={[boxSize + 0.08, 0.1, boxSize * 0.7 + 0.08]} />
        <meshStandardMaterial color={giftColor} roughness={0.5} />
      </mesh>

      {/* Ribbons */}
      <mesh position={[0, boxSize / 2, boxSize * 0.36]}>
        <boxGeometry args={[boxSize + 0.03, boxSize * 0.12, 0.03]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, boxSize / 2, 0]}>
        <boxGeometry args={[boxSize * 0.12, boxSize * 0.85, boxSize * 0.72]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Bow - OPTIMIZED: Reduced segments from 8,16 to 6,12 */}
      <mesh position={[-0.12, boxSize + 0.15, 0]} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.12, 0.035, 6, 12]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0.12, boxSize + 0.15, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <torusGeometry args={[0.12, 0.035, 6, 12]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Hover label */}
      {hovered && (
        <Html position={[0, boxSize + 0.7, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="glass px-3 py-2 rounded-lg text-center whitespace-nowrap">
            <p className="text-white text-sm font-medium">
              From: {sender?.display_name || sender?.full_name || 'Anonymous'}
            </p>
            <p className="text-yellow-300 text-xs">Click to read</p>
          </div>
        </Html>
      )}

      {/* REMOVED: Point light for better performance with 40+ objects */}
    </group>
  )
})

// Card/Envelope decoration - floats near tree
export const CardDecoration = memo(function CardDecoration({ message, sender, position, onClick }: MessageDecorationProps) {
  const groupRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  const animOffset = useRef(Math.random() * Math.PI * 2)
  const swingSpeed = useRef(0.3 + Math.random() * 0.15)

  // OPTIMIZED: Simpler, less frequent updates
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating - reduced frequency
      const time = state.clock.elapsedTime * 0.4 + animOffset.current
      groupRef.current.position.y = position[1] + Math.sin(time) * 0.08
      groupRef.current.rotation.z = Math.sin(time * swingSpeed.current) * 0.06
    }
    
    // Pulsing glow
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 0.8 + animOffset.current) * 0.5 + 0.5
      glowRef.current.scale.setScalar(1 + pulse * 0.15)
    }
  })

  const cardColor = message.decoration_style || '#c41e3a'

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerOver={() => {
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
      scale={hovered ? 1.15 : 1}
    >
      {/* Glow effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.55, 8, 8]} />
        <meshBasicMaterial
          color={cardColor}
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>

      {/* Card body */}
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.6, 0.05]} />
        <meshStandardMaterial 
          color={cardColor} 
          roughness={0.4} 
          metalness={0.1}
          emissive={cardColor}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>

        {/* Envelope flap (closed) */}
        <mesh position={[0, 0.2, 0.03]} rotation={[Math.PI * 0.12, 0, 0]}>
          <shapeGeometry args={[createFlapShape(0.45, 0.25)]} />
          <meshStandardMaterial 
            color={adjustColor(cardColor, 10)} 
            roughness={0.4} 
            metalness={0.1} 
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Wax seal - OPTIMIZED: Reduced from 16 to 12 segments */}
        <mesh position={[0, 0.05, 0.03]}>
          <circleGeometry args={[0.1, 12]} />
          <meshStandardMaterial color="#daa520" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* String - OPTIMIZED: Reduced from 8 to 6 segments */}
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.5, 6]} />
          <meshStandardMaterial color="#c41e3a" roughness={0.8} />
        </mesh>

        {/* Hover label */}
        {hovered && (
          <Html position={[0, -0.5, 0]} center style={{ pointerEvents: 'none' }}>
            <div className="glass px-3 py-2 rounded-lg text-center whitespace-nowrap">
              <p className="text-white text-sm font-medium">
                From: {sender?.display_name || sender?.full_name || 'Anonymous'}
              </p>
              <p className="text-yellow-300 text-xs">Click to read</p>
            </div>
          </Html>
        )}

        {/* Glow on hover - Simplified for performance */}
        {hovered && (
          <mesh position={[0, 0, -0.1]}>
            <planeGeometry args={[1.2, 0.9]} />
            <meshBasicMaterial color={cardColor} transparent opacity={0.25} />
          </mesh>
        )}
    </group>
  )
})

// Ornament decoration - hangs on tree
export const OrnamentDecoration = memo(function OrnamentDecoration({ message, sender, position, onClick }: MessageDecorationProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  const ornamentColor = message.decoration_style || '#c41e3a'
  const glowColor = useMemo(() => new THREE.Color(ornamentColor), [ornamentColor])

  // OPTIMIZED: Simpler rotation, glow only pulses on hover
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.25
    }
    if (glowRef.current && hovered) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.12 + 0.88
      glowRef.current.scale.setScalar(pulse * 1.25)
    }
  })

  return (
    <group position={position}>
      {/* Outer glow - OPTIMIZED: Reduced from 16x16 to 8x8 segments */}
      <mesh ref={glowRef} scale={hovered ? 1.15 : 1.05}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={hovered ? 0.35 : 0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main ornament - OPTIMIZED: Reduced from 32x32 to 12x12 segments */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={() => {
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
        scale={hovered ? 1.2 : 1}
      >
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial
          color={ornamentColor}
          roughness={0.2}
          metalness={0.85}
          emissive={ornamentColor}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>

      {/* Ornament cap - OPTIMIZED: Reduced from 8 to 6 segments */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.07, 6]} />
        <meshStandardMaterial color="#ffd700" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Hook - OPTIMIZED: Reduced from 8,16 to 6,12 segments */}
      <mesh position={[0, 0.24, 0]}>
        <torusGeometry args={[0.03, 0.008, 6, 12, Math.PI]} />
        <meshStandardMaterial color="#ffd700" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* REMOVED: Point light - using emissive materials for glow instead */}

      {/* Hover label */}
      {hovered && (
        <Html position={[0, 0.5, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="glass px-3 py-2 rounded-lg text-center whitespace-nowrap">
            <p className="text-white text-sm font-medium">
              From: {sender?.display_name || sender?.full_name || 'Anonymous'}
            </p>
            <p className="text-yellow-300 text-xs">Click to read</p>
          </div>
        </Html>
      )}
    </group>
  )
})

// Helper to create flap shape
function createFlapShape(width: number, height: number): THREE.Shape {
  const shape = new THREE.Shape()
  shape.moveTo(-width, 0)
  shape.lineTo(0, -height)
  shape.lineTo(width, 0)
  shape.lineTo(-width, 0)
  return shape
}

// Helper to adjust color brightness
function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.min(255, Math.max(0, (num >> 16) + amt))
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt))
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt))
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`
}

// Position calculator for 40+ messages
export function calculateDecorationPositions(_messageCount: number) {
  const giftPositions: [number, number, number][] = []
  const cardPositions: [number, number, number][] = []
  const ornamentPositions: [number, number, number][] = []

  // Gifts: Arranged in rings around tree base on the GROUND (y = -0.35 to sit on snow)
  // Adjusted spacing for bigger gifts (50% larger)
  const giftRings = [
    { radius: 3.2, count: 8, y: -0.35 },
    { radius: 4.0, count: 10, y: -0.35 },
    { radius: 4.8, count: 12, y: -0.35 },
    { radius: 5.5, count: 14, y: -0.35 },
  ]
  
  let giftIndex = 0
  for (const ring of giftRings) {
    for (let i = 0; i < ring.count; i++) {
      const angle = (i / ring.count) * Math.PI * 2 + (giftIndex % 2) * 0.2
      giftPositions.push([
        Math.cos(angle) * ring.radius,
        ring.y,
        Math.sin(angle) * ring.radius,
      ])
      giftIndex++
    }
  }

  // Cards: Float around tree at various heights (up to ~20 cards)
  for (let i = 0; i < 20; i++) {
    const layer = Math.floor(i / 5)
    const angle = (i % 5) * (Math.PI * 2 / 5) + layer * 0.4
    const height = 3 + layer * 1.5
    const radius = 3.5 - layer * 0.3

    cardPositions.push([
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius,
    ])
  }

  // Ornaments: Distributed on tree surface (up to ~20 ornaments)
  for (let i = 0; i < 20; i++) {
    const layer = Math.floor(i / 5)
    const layerData = [
      { y: 2.2, radius: 2.0 },
      { y: 3.5, radius: 1.6 },
      { y: 4.8, radius: 1.2 },
      { y: 5.8, radius: 0.8 },
    ][layer % 4]

    const angle = (i % 5) * (Math.PI * 2 / 5) + layer * 0.5

    ornamentPositions.push([
      Math.cos(angle) * layerData.radius,
      layerData.y,
      Math.sin(angle) * layerData.radius,
    ])
  }

  return { giftPositions, cardPositions, ornamentPositions }
}
