import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'

const Container = ({ initPos, name, items }) => {
    const  meshRef = useRef()
    const bodyRef = useRef()

    useFrame(() => {
        // if(meshRef.current) {
        //     meshRef.current.rotation.z += 0.01
        // }
    })


    return (
        
        <RigidBody ref={bodyRef} gravityScale={0} type="fixed" position={initPos} >
            <mesh ref={meshRef} name={`container--${name}`}>
                <boxGeometry args={[100,1,1000]}/>
                <meshStandardMaterial color="orange" />
            </mesh>
        </RigidBody>
    );
}

export default Container;
