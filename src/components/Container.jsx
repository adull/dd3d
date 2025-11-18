import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import { computeLayout } from '../helpers/layout'


const Container = ({ initPos, name, boxes }) => {
    const  meshRef = useRef()
    const bodyRef = useRef()

    const layout = useRef([])
    const hoverPosition = useRef(-1)

    useEffect(() => {
        const height = initPos[1]
        const relevantBoxes = boxes.filter(item => item.type === name)
        layout.current = computeLayout({ count: relevantBoxes.length, height})
    }, [initPos, boxes])

    useFrame(() => {
        // if(meshRef.current) {
        //     meshRef.current.rotation.z += 0.01
        // }
    })

    const getIndex = (e) => {
        // console.log(e.point)
        const x = e.point.x
        const xs = layout.current.map(item => item.x)
        // const new = [...xs, x]
        let index = 0
        // console.log(xs)
        for(let i = 0; i < xs.length; i ++) {
            if(x > xs[i]) {
                index++
            }
            if(x < xs[i]) {
                index = i
                break
            }
            if (i === xs.length - 1) {
                index =  xs.length - 1
                break
            }
        }
        // console.log(index)
        if(hoverPosition.current !== index) {
            hoverPosition.current = index
            console.log(hoverPosition.current)
        }
        // console.log(xs)
        // console.log({ x: e.x, y: e.y})
    }


    return (
        
        <RigidBody ref={bodyRef} gravityScale={0} type="fixed" position={initPos} >
            <mesh ref={meshRef} name={`container--${name}`} onPointerMove={getIndex}>
                <boxGeometry args={[1000,100,15]}/>
                <meshStandardMaterial color="orange" />
            </mesh>
        </RigidBody>
    );
}

export default Container;
