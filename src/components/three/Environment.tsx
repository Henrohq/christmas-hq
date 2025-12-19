import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function SnowGround() {
  // Generate snow mounds
  const mounds = useMemo(() => {
    const items: { position: [number, number, number]; radius: number }[] = []
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * 15 + 8
      items.push({
        position: [
          Math.cos(angle) * distance,
          -0.5,
          Math.sin(angle) * distance,
        ],
        radius: Math.random() * 1.5 + 0.5,
      })
    }
    return items
  }, [])

  return (
    <group>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <circleGeometry args={[30, 64]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Snow mounds */}
      {mounds.map((mound, i) => (
        <mesh key={i} position={mound.position}>
          <sphereGeometry args={[mound.radius, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} metalness={0.1} />
        </mesh>
      ))}
    </group>
  )
}

export function Snowfall() {
  const pointsRef = useRef<THREE.Points>(null)
  const velocitiesRef = useRef<Float32Array>()

  const { positions } = useMemo(() => {
    const count = 2000
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = Math.random() * 30
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50
      velocities[i] = 0.02 + Math.random() * 0.03
    }

    velocitiesRef.current = velocities
    return { positions }
  }, [])

  useFrame((state) => {
    if (pointsRef.current && velocitiesRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array
      const vel = velocitiesRef.current

      for (let i = 0; i < pos.length / 3; i++) {
        pos[i * 3 + 1] -= vel[i]
        pos[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.002

        if (pos[i * 3 + 1] < -1) {
          pos[i * 3 + 1] = 30
        }
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.1}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

export function Starfield() {
  const positions = useMemo(() => {
    const count = 500
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const radius = 80 + Math.random() * 20

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.cos(phi)
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
    }

    return positions
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.5}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Snowman component
function Snowman({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Bottom snowball */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      
      {/* Middle snowball */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      
      {/* Head snowball */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      
      {/* Carrot nose */}
      <mesh position={[0, 2.2, 0.35]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.06, 0.25, 8]} />
        <meshStandardMaterial color="#ff6600" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.12, 2.3, 0.3]} castShadow>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.12, 2.3, 0.3]} castShadow>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Smile (coal) */}
      {[-0.15, -0.075, 0, 0.075, 0.15].map((x, i) => (
        <mesh key={i} position={[x, 2.05, 0.32]} castShadow>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      ))}
      
      {/* Buttons */}
      {[1.7, 1.4, 1.1].map((y, i) => (
        <mesh key={i} position={[0, y, 0.43]} castShadow>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      ))}
      
      {/* Stick arms */}
      <mesh position={[-0.6, 1.6, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 6]} />
        <meshStandardMaterial color="#654321" roughness={0.9} />
      </mesh>
      <mesh position={[0.6, 1.6, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 6]} />
        <meshStandardMaterial color="#654321" roughness={0.9} />
      </mesh>
      
      {/* Top hat */}
      <group position={[0, 2.55, 0]}>
        {/* Brim */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.05, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        {/* Hat top */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.5, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>
    </group>
  )
}

// Footsteps in snow
function Footsteps({ decorationLevel }: { decorationLevel: 0 | 1 | 2 | 3 | 4 }) {
  const footsteps = useMemo(() => {
    if (decorationLevel === 0) return []
    
    const steps: { position: [number, number, number]; rotation: number; side: 'left' | 'right' }[] = []
    const stepCount = Math.min(decorationLevel * 3, 12) // Up to 12 footsteps
    
    // Create a path of footsteps
    for (let i = 0; i < stepCount; i++) {
      const progress = i / stepCount
      const angle = Math.PI * 0.4 + progress * Math.PI * 0.3 // Curved path
      const distance = 8 + progress * 6
      
      steps.push({
        position: [
          Math.cos(angle) * distance,
          -0.48,
          Math.sin(angle) * distance,
        ],
        rotation: angle + (i % 2 === 0 ? -0.15 : 0.15),
        side: i % 2 === 0 ? 'left' : 'right',
      })
    }
    
    return steps
  }, [decorationLevel])
  
  return (
    <group>
      {footsteps.map((step, i) => (
        <mesh
          key={i}
          position={step.position}
          rotation={[-Math.PI / 2, step.rotation, 0]}
        >
          {/* Footprint shape (simple ellipse) */}
          <circleGeometry args={[0.15, 16]} />
          <meshStandardMaterial 
            color="#e8e8ff" 
            transparent 
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

// Santa's Sled
function SantaSled({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, Math.PI * 0.15, 0]}>
      {/* Sled base */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[1.5, 0.1, 0.8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>
      
      {/* Sled sides */}
      <mesh position={[-0.7, 0.3, 0]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>
      <mesh position={[0.7, 0.3, 0]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>
      
      {/* Sled back */}
      <mesh position={[0, 0.4, -0.35]} castShadow>
        <boxGeometry args={[1.4, 0.7, 0.1]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>
      
      {/* Curved runners (skis) */}
      <mesh position={[-0.6, -0.05, 0.1]} rotation={[-0.1, 0, 0]} castShadow>
        <boxGeometry args={[0.08, 0.08, 1.2]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.6} />
      </mesh>
      <mesh position={[0.6, -0.05, 0.1]} rotation={[-0.1, 0, 0]} castShadow>
        <boxGeometry args={[0.08, 0.08, 1.2]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.6} />
      </mesh>
      
      {/* Gift boxes in sled */}
      <mesh position={[-0.2, 0.35, 0]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#c41e3a" />
      </mesh>
      <mesh position={[0.3, 0.35, 0.1]} castShadow>
        <boxGeometry args={[0.25, 0.25, 0.25]} />
        <meshStandardMaterial color="#228b22" />
      </mesh>
      <mesh position={[0.1, 0.55, -0.1]} castShadow>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color="#1e90ff" />
      </mesh>
      
      {/* Ribbons on gifts */}
      <mesh position={[-0.2, 0.35, 0]} castShadow>
        <boxGeometry args={[0.32, 0.04, 0.04]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>
      <mesh position={[0.3, 0.35, 0.1]} castShadow>
        <boxGeometry args={[0.27, 0.04, 0.04]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>
    </group>
  )
}

// Landscape Decorations - scales with message count
export function LandscapeDecorations({ decorationLevel }: { decorationLevel: 0 | 1 | 2 | 3 | 4 }) {
  const snowmenPositions = useMemo(() => {
    if (decorationLevel < 2) return []
    
    // Add snowmen at level 2+
    const positions: [number, number, number][] = [
      [6, -0.5, 8],  // Front right
      [-7, -0.5, 6], // Front left
    ]
    
    // Add more snowmen at higher levels
    if (decorationLevel >= 3) {
      positions.push([-5, -0.5, -10]) // Back left
    }
    if (decorationLevel >= 4) {
      positions.push([8, -0.5, -8])   // Back right
    }
    
    return positions
  }, [decorationLevel])
  
  const sledPosition = useMemo((): [number, number, number] | null => {
    if (decorationLevel < 3) return null
    return [10, -0.5, -5] // Back right area
  }, [decorationLevel])
  
  return (
    <group>
      {/* Footsteps (appear at level 1+) */}
      <Footsteps decorationLevel={decorationLevel} />
      
      {/* Snowmen (appear at level 2+) */}
      {snowmenPositions.map((pos, i) => (
        <Snowman key={i} position={pos} />
      ))}
      
      {/* Santa's Sled (appears at level 3+) */}
      {sledPosition && <SantaSled position={sledPosition} />}
    </group>
  )
}

export function SceneLighting() {
  return (
    <>
      {/* Ambient */}
      <ambientLight intensity={0.4} color="#404080" />

      {/* Moonlight */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.5}
        color="#8888ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Lamp light in front of tree - Natural night light (warm, focused) */}
      <pointLight 
        position={[0, 4, 8]} 
        intensity={1.5} 
        color="#fff8dc" 
        distance={18}
        decay={1.5}
        castShadow
      />

      {/* Colored accent lights */}
      <pointLight position={[-3, 2, 3]} intensity={0.5} color="#ff0000" distance={8} />
      <pointLight position={[3, 2, 3]} intensity={0.5} color="#00ff00" distance={8} />
      <pointLight position={[0, 1, -3]} intensity={0.3} color="#0066ff" distance={10} />
    </>
  )
}


