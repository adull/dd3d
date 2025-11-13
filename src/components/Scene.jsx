
import React, { useRef, useEffect, useMemo, useState } from 'react'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

import { dragLoop } from '../helpers/drag'
import { evenlySpace } from '../helpers/space'
import BoxComponent from './BoxComponent'
import Container from './Container'
import MouseLayer from './MouseLayer'


const Scene = ({ cameraPos, camRef }) => {
    console.log({ cameraPos, camRef})
    const gridRef = useRef(null)
    const controlsRef = useRef(null)
    const isDraggingRef = useRef(false)
    const activeBodyRef = useRef(null)
    const activeMeshRef = useRef(null)
    // const state = useThree()
    const containersRef = useRef([])
    const draggingStateRef = useRef(null)

    // const [letters, setLetters] = useState('1234'.split(''))
    // const [operators, setOperators] = useState('()+-x'.split(''))
    // const [solutions, setSolutions] = useState([])
    const [game, setGame] = useState({
        letters: '1234',
        operators: '()+-x',
        solutions: ''
    }) 

    const containers = [
        { name: `letters`, pos: [500,0,0], color: `white`},
        { name: `operators`, pos: [0,0,0], color: `white` },
        { name: `solutions`, pos: [-500,0,0], color: `white`}
    ] 

    
    const letters = evenlySpace({height: 500, x: -250, y: 250, width: 500, array: game.letters.split('')})
    const operators = evenlySpace({height: 0, x: -250, y: 250, width: 500, array: game.operators.split('')})
    const solutions = evenlySpace({height: -500, x: -250, y: 250, width: 500, array: game.solutions.split('')})
    const boxes = [...letters, ...operators, ...solutions]


    const onDragRotateCam = false
    // const onDragRotateCam = true

    containersRef.current = Array.from(containers, () => null)
    console.log(containersRef.current)

    const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0,1,0), -500), [])


    useEffect(() => {
        const handlePointerUp =  () => {   
            isDraggingRef.current = false
            console.log(draggingStateRef.current)
        }
        window.addEventListener('pointerup', handlePointerUp)
        return () => window.removeEventListener('pointerup', handlePointerUp)
    }, [])

    const grabItem = (bodyRef, meshRef) => {
        isDraggingRef.current = true
        activeBodyRef.current = bodyRef.current
        activeMeshRef.current = meshRef.current

        console.log({bodyRef, meshRef})

    }

    const updateFn = (draggingRes) => {
        console.log(draggingRes)
        if (draggingRes.isOverlapping) {
            const updatedGame = {
                ...game,
                [draggingRes.name]: game[draggingRes.name] + ' '
            }
            console.log({ updatedGame})
            // setGame(updatedGame)
        } else {
            const updatedGame = Object.fromEntries(
                Object.entries(game).map(([key, val]) => [key, val.replace(' ', '')])
            )
            // setGame(updatedGame)
        }
        draggingStateRef.current = draggingRes
    }

    useFrame(({ scene, camera, raycaster, pointer, viewport}) => {
        if(isDraggingRef.current) {
            dragLoop({ scene, camera, pointer, plane, raycaster, viewport, body: activeBodyRef.current, mesh: activeMeshRef.current, updateFn })
            // console.log(dragRes)
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
