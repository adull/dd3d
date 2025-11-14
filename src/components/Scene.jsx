
import React, { useRef, useEffect, useMemo } from 'react'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { dragLoop } from '../helpers/drag'
import { createBoxes } from '../helpers/boxes'
import BoxComponent from './BoxComponent'
import Container from './Container'

const Scene = ({ cameraPos, camRef }) => {
    const gridRef = useRef(null)
    const controlsRef = useRef(null)
    const draggingRef = useRef({ isDragging: false, item: null})
    const activeBodyRef = useRef(null)
    const activeMeshRef = useRef(null)
    const containersRef = useRef([])
    const dragSignalRef = useRef(null)

    const word = '1234'
    const gameRef = useRef({
        letters: word,
        operators: '+-/x',
        solutions: ''
    })

    const containers = [
        { name: `letters`, pos: [0,500,0], color: `white`},
        { name: `operators`, pos: [0,0,0], color: `white` },
        { name: `solutions`, pos: [0,-500,0], color: `white`}
    ] 

    
    
    const letters = createBoxes({
        array: word.split(''),
        container: containers.find(item => item.name === `letters`)
    })
    const operators = createBoxes({
        array: gameRef.current.operators.split(''),
        container: containers.find(item => item.name === `operators`)
    })
    const boxes = [...letters, ...operators]

    console.log(boxes)
    const instructionRef = useRef(
        boxes.reduce((acc, item) => {
          acc[item.id] = { goTo: item.pos };
          return acc;
        }, {})
      );
      

    console.log(instructionRef)


    const onDragRotateCam = false
    // const onDragRotateCam = true

    containersRef.current = Array.from(containers, () => null)
    // console.log(containersRef.current)

    const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0,0,1), -500), [])



    useEffect(() => {
        const handlePointerUp =  () => {   
            draggingRef.current = { isDragging: false, item: null}
            console.log(draggingRef.current)
        }
        window.addEventListener('pointerup', handlePointerUp)
        return () => window.removeEventListener('pointerup', handlePointerUp)
    }, [])

    const grabItem = (bodyRef, meshRef, item) => {
        draggingRef.current = { isDragging: true, item }
        activeBodyRef.current = bodyRef.current
        activeMeshRef.current = meshRef.current

        console.log({bodyRef, meshRef})

    }

    const updateFn = (draggingRes) => {
        console.log(draggingRes)
        dragSignalRef.current = draggingRes
    }

    useFrame(({ scene, camera, raycaster, pointer, viewport}) => {
        if(draggingRef.current.isDragging) {
            // console.log(draggingRef.current)
            dragLoop({ 
                scene, camera, pointer, plane, raycaster, viewport, 
                body: activeBodyRef.current, mesh: activeMeshRef.current, 
                updateFn, item: draggingRef.current.item, game: gameRef.current
            })
        }
    })

    return (
        <>
            <PerspectiveCamera makeDefault position={cameraPos} ref={camRef}/>
            <directionalLight color="white" position={[0, 0, 5]} />
            <directionalLight color="white" position={[5, 5, 0]} />
            <Physics >
                { containers.map((container, i) => (
                    <Container ref={containersRef[i]} name={container.name} initPos={container.pos} />
                ))}
                <>
                    { boxes.map(item => (
                        <BoxComponent gravity={false} item={item} mouseDown={grabItem} dragSignal={dragSignalRef}/>
                    )) }
                </>
                
            </Physics>
            
            <OrbitControls enableRotate={onDragRotateCam} enablePan={onDragRotateCam} ref={controlsRef} makeDefault />
            <gridHelper
                ref={gridRef}
                args={[10000, 100, '#000000', '#cccccc']}
                position={[0, 0, 0]}
                rotation={[Math.PI/2,0,0]}
            />
        </>
    );
}

export default React.memo(Scene);
