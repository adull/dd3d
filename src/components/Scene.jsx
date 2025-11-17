
import React, { useRef, useEffect, useMemo } from 'react'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { dragLoop, dumdrag } from '../helpers/drag'
import { computeLayout } from '../helpers/layout'
import { createBoxes } from '../helpers/boxes'
import BoxComponent from './BoxComponent'
import Container from './Container'

const Scene = ({ cameraPos, camRef }) => {
    const gridRef = useRef(null)
    const controlsRef = useRef(null)
    const draggingRef = useRef({ isDragging: false, item: null})
    const activeMeshRef = useRef(null)
    const containersRef = useRef([])
    const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0,1,0), 0), [])

    const word = '1234'
    const gameRef = useRef({
        characters: word,
        operators: '+-/x',
        solutions: ''
    })

    

    const containers = [
        { name: `characters`, pos: [0,500,0], color: `white`},
        { name: `operators`, pos: [0,0,0], color: `white` },
        { name: `solutions`, pos: [0,-500,0], color: `white`}
    ] 
    
    const characters = createBoxes({
        array: word.split(''),
        container: containers.find(item => item.name === `characters`)
    })
    const operators = createBoxes({
        array: gameRef.current.operators.split(''),
        container: containers.find(item => item.name === `operators`)
    })
    const boxes = [...characters, ...operators]



    // console.log(boxes)
    const instructionRef = useRef(
        boxes.reduce((acc, item) => {
          acc[item.id] = { sleep: true, goTo: item.pos };
          return acc;
        }, {})
      );


    const onDragRotateCam = false
    // const onDragRotateCam = true

    containersRef.current = Array.from(containers, () => null)



    useEffect(() => {
        const handlePointerUp =  () => {   
            draggingRef.current.isDragging = false
        }
        window.addEventListener('pointerup', handlePointerUp)
        return () => window.removeEventListener('pointerup', handlePointerUp)
    }, [])

    const grabItem = (meshRef, item) => {
        draggingRef.current = { isDragging: true, isArranging: false, item }
        activeMeshRef.current = meshRef.current
    }



    useFrame(({ scene, mouse, camera, raycaster, pointer, viewport}) => {
        if(draggingRef.current.isDragging) {
            // console.log(draggingRef.current.item)
            console.log(mouse)
            dumdrag({ mouse, camera, plane, raycaster, mesh: activeMeshRef.current })
        }
        //     // console.log(draggingRef.current)
        //     dragLoop({ 
        //         scene, camera, mouse, plane, raycaster, viewport, 
        //         body: activeBodyRef.current, mesh: activeMeshRef.current, 
        //         updateFn, item: draggingRef.current.item, game: gameRef.current,
        //         isArranging: draggingRef.current.isArranging
        //     })
        // }
    })

    return (
        <>
            <PerspectiveCamera makeDefault position={cameraPos} ref={camRef}/>
            <directionalLight color="white" position={[0, 0, 5]} />
            <directionalLight color="white" position={[5, 5, 0]} />
            { containers.map((container, i) => (
                <Container key={i} ref={containersRef[i]} name={container.name} initPos={container.pos} />
            ))}
            <>
                { boxes.map(item => { 
                    // console.log(instructionRef.current); 
                    return (
                        <BoxComponent 
                        key={item.id} 
                        item={item} 
                        mouseDown={grabItem} 
                        instructionRef={instructionRef}/>
                    )
                }) }
            </>
                
            
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
