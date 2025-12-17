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


