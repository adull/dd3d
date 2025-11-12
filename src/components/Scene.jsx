
import React, { useRef, useEffect, useMemo } from 'react'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

import { dragLoop } from '../helpers/drag'
import BoxComponent from './BoxComponent'
import Container from './Container'
import MouseLayer from './MouseLayer'


const Scene = ({ cameraPos, camRef }) => {
    console.log({ cameraPos, camRef})
    const gridRef = useRef(null)
    const controlsRef = useRef(null)
    const isDraggingRef = useRef(false)
    const activeItemRef = useRef(null)
    // const state = useThree()
    const containersRef = useRef([])
    // const raycasterRef = useRef(new THREE.Raycaster())
    

    const onDragRotateCam = false
    // const onDragRotateCam = true


    const boxes = [
        { pos: [0,10,-100] },
        { pos: [0,10,100] }
    ]

    const containers = [
        { name: `letters`, pos: [0,0,0], color: `white` },
        { name: `operators`, pos: [500,0,0], color: `white`}
    ] 
    // containers.forEach(item => containersRef.push(null))
    containersRef.current = Array.from(containers, () => null)
    console.log(containersRef.current)

    const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0,1,0), -500), [])
    // const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0,0,1), 0), [])


    useEffect(() => {
        const handlePointerUp =  () => {   
            isDraggingRef.current = false
        }
        window.addEventListener('pointerup', handlePointerUp)
        return () => window.removeEventListener('pointerup', handlePointerUp)
    }, [])

    const grabItem = (ref) => {
        isDraggingRef.current = true
        activeItemRef.current = ref.current

    }

    useFrame(({ scene, camera, raycaster, pointer, viewport}) => {
        if(isDraggingRef.current) {
            // console.log({ viewport  })
            dragLoop({scene, camera, pointer, plane, raycaster, viewport, body: activeItemRef.current})
        }
    })

    return (
        <>
            <PerspectiveCamera makeDefault position={cameraPos} ref={camRef}/>
            <directionalLight color="white" position={[0, 0, 5]} />
            <directionalLight color="white" position={[0, 5, 0]} />
            <MouseLayer />
            <Physics >
                { containers.map((container, i) => (
                    <Container ref={containersRef[i]} name={container.name} initPos={container.pos} />
                ))}
                <>
                    { boxes.map(item => (
                        <BoxComponent gravity={false} initPos={item.pos} mouseDown={grabItem}/>
                    )) }
                </>
                
            </Physics>
            
            <OrbitControls enableRotate={onDragRotateCam} enablePan={onDragRotateCam} ref={controlsRef} makeDefault />
            <gridHelper
                ref={gridRef}
                args={[10000, 100, '#000000', '#cccccc']}
                position={[0, 0, 0]}
                rotation={[0, -Math.PI / 2, 0]}
            />
        </>
    );
}

export default React.memo(Scene);
