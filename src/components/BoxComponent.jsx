import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'

const BoxComponent = ({ initPos, gravity, mouseDown }) => {
    const  meshRef = useRef()
    const bodyRef = useRef()

    // useFrame(() => {
    //     if(meshRef.current) {
    //         meshRef.current.rotation.z += 0.01
    //     }
    // })

    const onMouseDown = () => {
        mouseDown(bodyRef)
    }

    const hasGravity = gravity ? 1 : 0
    return (
        
            <RigidBody ref={bodyRef} linearDamping={0} canSleep position={ initPos ?? [0,500,0] } colliders={"cuboid"} gravityScale={hasGravity}>
                <mesh ref={meshRef} onPointerDown={onMouseDown} >
                    <boxGeometry args={[50,5,50]} />
                    <meshStandardMaterial color="blue" />
                </mesh>
            </RigidBody>
    );
}

export default BoxComponent;
