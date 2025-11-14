import {  useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

const MouseLayer = () => {
    // const state = useThree()
    const meshRef = useRef(null)
    const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0,1,0), -500), [])
    const point = new THREE.Vector3()

    useFrame(({ pointer, raycaster, camera }) => {
        if(!meshRef.current) return
        raycaster.setFromCamera(pointer, camera)
        raycaster.ray.intersectPlane(plane, point)

        meshRef.current.position.copy(point)
    })

    return (
        
        
        <mesh ref={meshRef} position={[0, 500, 0]}>   
            <sphereGeometry args={[10,50,10]} />
            <meshStandardMaterial color="orange" />
        </mesh>
    );
}

export default MouseLayer;
