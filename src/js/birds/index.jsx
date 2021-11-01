import React, { useState, useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'

export const Background = ({ pointerCoords }) => {
  return (
    <Canvas id="canvas-container" camera={{ fov: 65, near: 0.1, far: 1000, position: [0, 0, 40] }}>
      <ambientLight />
      <pointLight position={[-5, 0, 5]} />
      <pointLight position={[5, 0, 5]} />
      <Birds pointerCoords={pointerCoords} />
    </Canvas>
  )
}

const TIME_STEP = 0.01
const MAX_SPEED = 20
const BOID1_WEIGHT = 0.005
const BOID1_RADIUS = 15
const BOID2_WEIGHT = 0.3
const BOID2_RADIUS = 3
const BOID3_WEIGHT = 0.002
const BOID3_RADIUS = 15
const BOID4_WEIGHT = 0.15
const BOID5_WEIGHT = 0.00001 / 1500000
const BOID6_WEIGHT = 0.3

const distance = (v1, v2) => {
  return length(sub(v2, v1))
}

const sub = (v1, v2) => {
  return [
    v1[0] - v2[0],
    v1[1] - v2[1],
    v1[2] - v2[2]
  ]
}

const add = (v1, v2) => {
  return [
    v1[0] + v2[0],
    v1[1] + v2[1],
    v1[2] + v2[2]
  ]
}

const neg = (v) => {
  return [
    -v[0],
    -v[1],
    -v[2]
  ]
}

const normalize = (v) => {
  return scale(v, 1 / length(v))
}

const scale = (v, c) => {
  return [
    v[0] * c,
    v[1] * c,
    v[2] * c
  ]
}

const length = (v) => {
  return Math.sqrt((v[0] * v[0]) + (v[1] * v[1]) + (v[2] * v[2]))
}

const clamp = (v, c) => {
  if (length(v) < c) return v
  return scale(normalize(v), c)
}

const boid1 = (birds) => {
  return birds.map((bird, i) => {
    let center = birds.reduce((acc, neighbor, j) => {
      if (i === j || distance(bird.position, neighbor.position) > BOID1_RADIUS) return acc

      return [add(acc[0], neighbor.position), acc[1] + 1]
    }, [[0, 0, 0], 0])
    center = center[1] === 0 ? bird.position : scale(center[0], 1 / center[1])

    return scale(sub(center, bird.position), BOID1_WEIGHT)
  })
}

const boid2 = (birds) => {
  return birds.map((bird, i) => {
    let avoid = birds.reduce((acc, neighbor, j) => {
      if (i === j || distance(bird.position, neighbor.position) > BOID2_RADIUS) return acc

      return add(acc, normalize(sub(bird.position, neighbor.position)))
    }, [0, 0, 0])

    return scale(avoid, BOID2_WEIGHT)
  })
}

const boid3 = (birds) => {
  return birds.map((bird, i) => {
    let direction = birds.reduce((acc, neighbor, j) => {
      if (i === j || distance(bird.position, neighbor.position) > BOID3_RADIUS) return acc

      return [add(acc[0], neighbor.velocity), acc[1] + 1]
    }, [[0, 0, 0], 0])
    direction = direction[1] === 0 ? [0, 0, 0] : scale(direction[0], 1 / direction[1])

    return scale(direction, BOID3_WEIGHT)
  })
}

const boid4 = (birds, t) => {
  return birds.map(() => new Array(3).fill(Math.sin(t / 11) * Math.sin(t / 3)  * BOID4_WEIGHT))
}

const boid5 = (birds) => {
  return birds.map((bird, i) => {
    const distance = length(bird.position)
    return scale(normalize(neg(bird.position)), Math.pow(10, distance - 35) * BOID5_WEIGHT)
  })
}

const boid6 = (birds, pointerCoords) => {
  return birds.map((bird) => {
    return scale(normalize(sub(pointerCoords, bird.position)), BOID6_WEIGHT)
  })
}

export const Birds = ({ pointerCoords }) => {
  const { raycaster, scene, camera } = useThree()

  useEffect(() => {
    raycaster.setFromCamera(pointerCoords, camera)
  }, [pointerCoords])

  const transformedPointerCoords = useMemo(() => {
    if (scene.children.length === 0) return [0, 0, 0]

    const intersections = raycaster.intersectObject(scene.children[3])
    if (intersections.length === 0) return [0, 0, 0]

    const point = intersections[0].point
    return [point.x, point.y, point.z]
  }, [raycaster, pointerCoords])

  const [birds, setBirds] = useState(() => {
    return new Array(15).fill(null).map(() => ({
      position: new Array(3).fill(0).map(() => (Math.random() * 30) - 15),
      velocity: new Array(3).fill(0).map(() => (Math.random() * 30) - 15)
    }))
  })

  const [physicsDelta, setPhysicsDelta] = useState(0)
  const [t, setT] = useState(0)

  useFrame((state, delta) => {
    const newPhysicsDelta = physicsDelta + delta

    if (newPhysicsDelta > TIME_STEP) {
      const b1 = boid1(birds)
      const b2 = boid2(birds)
      const b3 = boid3(birds)
      const b4 = boid4(birds, t)
      const b5 = boid5(birds)
      const b6 = boid6(birds, transformedPointerCoords)
      setBirds(birds.map((bird, i) => {
        const v = clamp(add(add(add(add(add(add(bird.velocity, b1[i]), b2[i]), b3[i]), b4[i]), b5[i]), b6[i]), MAX_SPEED)

        return {
          position: add(bird.position, scale(v, TIME_STEP)),
          velocity: v
        }
      }))
      setPhysicsDelta(newPhysicsDelta - TIME_STEP)
      setT(t + TIME_STEP)
    } else {
      setPhysicsDelta(newPhysicsDelta)
    }
  })

  return (
    <>
      <Backplate />
      {birds.map(({ position, velocity }, i) => <Bird key={i} position={position} velocity={velocity} />)}
    </>
  )
}

export const Backplate = () => {
  // const updatePointer = useCallback(throttle((e) => setPointerCoords([e.point.x, e.point.y, e.point.z]), 200), [])
  return (
    <mesh scale={100}>
      <planeGeometry />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  )
}

const v = new Float32Array([
  -0.5, -0.5, -1,
  -0.5, 0.5, -1,
  0.5, 0.5, -1,

  -0.5, -0.5, -1,
  0.5, 0.5, -1,
  0.5, -0.5, -1,

  -0.5, -0.5, -1,
  0.5, -0.5, -1,
  0, 0, 1,

  0.5, -0.5, -1,
  0.5, 0.5, -1,
  0, 0, 1,

  0.5, 0.5, -1,
  -0.5, 0.5, -1,
  0, 0, 1,

  -0.5, 0.5, -1,
  -0.5, -0.5, -1,
  0, 0, 1,
])

const Bird = ({ position, velocity }) => {
  const mesh = useRef()
  return (
    <mesh
      onUpdate={(self) => self.lookAt(...velocity)}
      position={position}
      ref={mesh}
    >
      <BirdGeometry />
      <meshPhongMaterial color={'#0e6063'} />
    </mesh>
  )
}

const BirdGeometry = () => {
  return (
    <bufferGeometry onUpdate={(self) => self.computeVertexNormals()}>
      <bufferAttribute attachObject={['attributes', 'position']} count={v.length / 3} array={v} itemSize={3} />
    </bufferGeometry>
  )
}

