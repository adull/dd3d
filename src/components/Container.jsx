import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'

const Container = ({ initPos }) => {
    const  meshRef = useRef()
    const bodyRef = useRef()

    useFrame(() => {
        // if(meshRef.current) {
        //     meshRef.current.rotation.z += 0.01
        // }
    })

    // useEffect(() => {
    //     if(bodyRef.current) {
    //         console.log(bodyRef.current)
    //         // bodyRef.current.object.name = `container`
    //     }
    // }, [bodyRef])

    return (
        
        <RigidBody ref={bodyRef} gravityScale={0} linearDamping={4} position={initPos} >
            <mesh ref={meshRef} name={`container`}>
                <boxGeometry args={[100,1,1000]}/>
                <meshStandardMaterial color="orange" />
            </mesh>
        </RigidBody>
    );
}

export default Container;
