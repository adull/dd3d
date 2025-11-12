import { useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'

import { getSavedCamPos } from '../helpers'
import Scene from './Scene'
import CameraHelperButtons from './CameraHelperButtons'


const Three = () => {
    const [height, setHeight] = useState(0)
    const camRef = useRef(null)

    const domRef = useRef(null)
    
    const cp = JSON.parse(getSavedCamPos())
    const cameraPos = [cp.x,cp.y,cp.z]

    useEffect(() => {
        const el = domRef.current
        const parent = el

        const parentHeight = parent.clientHeight
        let nonCanvasHeight = 92
        
        console.log(`set height..`)
        setHeight(parentHeight - nonCanvasHeight)
    }, [])

    return (
        <div className="w-full h-full" ref={domRef}>
            <Canvas className="h-full" style={{height}}>
                <Scene cameraPos={cameraPos} camRef={camRef}/>
            </Canvas>
            <CameraHelperButtons enabled={['getCurrentCamPos', 'updateSavedCamPos']} camRef={camRef} />
        </div>
    );
    }

export default Three;
