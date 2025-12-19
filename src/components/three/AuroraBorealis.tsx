import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Aurora Borealis (Northern Lights) Effect
 * Simple gradient cloud effect with aurora colors
 */

export function AuroraBorealis() {
  // Create a smooth gradient texture with aurora colors
  const auroraTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    
    // Create horizontal gradient with aurora colors
    const gradient = ctx.createLinearGradient(0, 0, 1024, 0)
    
    // Aurora color stops: green -> cyan -> purple -> pink -> green
    gradient.addColorStop(0, 'rgba(0, 255, 136, 0.4)')      // Green
    gradient.addColorStop(0.25, 'rgba(0, 204, 255, 0.5)')  // Cyan
    gradient.addColorStop(0.5, 'rgba(170, 0, 255, 0.6)')   // Purple
    gradient.addColorStop(0.75, 'rgba(255, 0, 136, 0.5)')  // Pink
    gradient.addColorStop(1, 'rgba(0, 255, 136, 0.4)')     // Green
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1024, 512)
    
    // Add vertical gradient overlay for softness
    const verticalGradient = ctx.createLinearGradient(0, 0, 0, 512)
    verticalGradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)')    // Dark at top
    verticalGradient.addColorStop(0.3, 'rgba(0, 0, 0, 0)')    // Transparent
    verticalGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0)')    // Transparent
    verticalGradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)')    // Dark at bottom
    
    ctx.fillStyle = verticalGradient
    ctx.fillRect(0, 0, 1024, 512)
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.needsUpdate = true
    return texture
  }, [])

  return (
    <group>
      {/* Simple backdrop plane with aurora gradient */}
      <mesh 
        position={[0, 30, -60]}
        rotation={[0, 0, 0]}
      >
        <planeGeometry args={[200, 80]} />
        <meshBasicMaterial
          map={auroraTexture}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Subtle ambient lights for atmosphere */}
      <ambientLight intensity={0.1} color="#00ff88" />
      <pointLight 
        position={[0, 35, -50]} 
        intensity={0.5} 
        color="#00ff88" 
        distance={100}
      />
      <pointLight 
        position={[-30, 40, -55]} 
        intensity={0.4} 
        color="#00ccff" 
        distance={80}
      />
      <pointLight 
        position={[30, 38, -55]} 
        intensity={0.4} 
        color="#aa00ff" 
        distance={80}
      />
    </group>
  )
}

