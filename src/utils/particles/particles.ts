import { MathUtils } from 'three'

export const getRandomSpherePositions = (count: number): Float32Array => {
  const positions = new Float32Array(count * 3)

  const distance = 2.5
  // Create random positions within a sphere

  for (let i = 0; i < count; i++) {
    const theta = MathUtils.randFloatSpread(360)
    const phi = MathUtils.randFloatSpread(360)
    let x = distance * Math.sin(theta) * Math.cos(phi)
    let y = distance * Math.sin(theta) * Math.sin(phi)
    let z = distance * Math.cos(theta) + Math.random() * 0.5 - 0.25
    positions.set([x, y, z], i * 3)
  }

  return positions
}
