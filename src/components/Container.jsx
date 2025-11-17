import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const Container = ({ initPos, name }) => {
    const  meshRef = useRef()

    useFrame(() => {
        // if(meshRef.current) {
        //     meshRef.current.rotation.z += 0.01
        // }
    })


    return (
        <mesh ref={meshRef} name={`container--${name}`} position={initPos} >
            <boxGeometry args={[1000,100,15]}/>
            <meshStandardMaterial color="orange" />
        </mesh>
    );
}

export default Container;
