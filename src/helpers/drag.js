import EventEmitter from 'events'
import deepEqual from 'fast-deep-equal';
import * as THREE from 'three'

// const dragEvent = new EventEmitter()
const prevResults = new Map()
let wasOverlapping = false


// function i used to make sure that things were to scale
const testDraw = (pos, box, viewport) => {
    console.log({ box })
    
    const px = ndcToPixels(pos, viewport)
    console.log({ px })
    const div = document.createElement("div")
    const cont = document.createTextNode('a')
    // div.setAttribute('style', `position: absolute;left: ${px.x}px; bottom:${px.y}px`)
    div.setAttribute(
        'style',
        `position: absolute; left:${box.x}px; top:${box.y}px; height:${box.height}px;width:${box.width}px; background-color:blue`
    )
    div.append(cont)
    const root = document.getElementById('root')
    document.body.insertBefore(div, root)
    
}

const overlappingData = (a, b) => {
    const isOverlapping = !(
      a.x + a.width < b.x ||
      b.x + b.width < a.x ||
      a.y + a.height < b.y ||
      b.y + b.height < a.y
    );
    const bw = b.width
    const isLeft = isOverlapping && a.x < b.x + bw / 2

    const aCenter = a.x + a.width / 2;
    const progress = (aCenter - b.x) / bw;
    const clampedProgress = Math.min(Math.max(progress, 0), 1).toPrecision(2);

    return {
        isOverlapping,
        position: isOverlapping ? isLeft ? 'left' : 'right' : null,
        progress: clampedProgress
    }
  };

const overlappingResponse = (name, data) => { return {...data, name}}

const dragLoop = ({ scene, camera, pointer, plane, raycaster, body, mesh, viewport, updateFn }) => {
    const current = body.translation()
    const dragging = getBoxFromScreen(mesh, camera, viewport)
    const containers = getContainers(scene, current)
  
    for (const container of containers) {
      const containerMesh = container.children[0]
      const name = containerMesh.name.replace('container--', '')
  
      const containerPos = getBoxFromScreen(containerMesh, camera, viewport)
      const od = overlappingData(dragging, containerPos)
  
      const prev = prevResults.get(name)

  
      if (!prev || !deepEqual(od, prev)) {
        const res = overlappingResponse(name, od)
  
        if (res.isOverlapping) {
            wasOverlapping = true
          updateFn(res)
          prevResults.set(name, od)
          return; 
        }
  
        prevResults.set(name, od);
      }
    }
  
    if (![...prevResults.values()].some(r => r.isOverlapping)) {
        // console.log(prevResults)
        if(wasOverlapping) {
            updateFn({ isOverlapping: false });
            wasOverlapping = false
        }
    }
  

    const velocity = body.linvel()
    const target = new THREE.Vector3()
    raycaster.ray.intersectPlane(plane, target)
    
    const stiffness = 9000
    const damping = 1000

    const posError = new THREE.Vector3().subVectors(target, current)
    const velError = new THREE.Vector3().copy(velocity)

    const force = posError.multiplyScalar(stiffness).sub(velError.multiplyScalar(damping))
    body.applyImpulse(force, true)
}

// this shouldnt be computed over and over.
const getContainers = (scene) => {
    const objects = scene.children.filter(item => item.type === "Object3D")
    const containers = objects.filter(item => item.children[0].name.includes("container"))
    return containers
    
}

const getScreenPosition = (obj, camera) => { 
    const pos = new THREE.Vector3()
    obj.localToWorld(pos)
    pos.project(camera)

    return pos
}

const ndcToPixels = (pos, viewport) => {
    const { width, height } = viewport
    return {
      x: (pos.x * 0.5 + 0.5) * width,
      y: (1 - (pos.y * 0.5 + 0.5)) * height,
    };
}

const getBoxFromScreen = (rect, camera, viewport) => {
    rect.updateMatrixWorld(true)
    const geometry = rect.geometry
    const box = geometry.boundingBox.clone();
    const corners = [
        new THREE.Vector3(box.min.x, box.min.y, box.min.z),
        new THREE.Vector3(box.min.x, box.min.y, box.max.z),
        new THREE.Vector3(box.min.x, box.max.y, box.min.z),
        new THREE.Vector3(box.min.x, box.max.y, box.max.z),
        new THREE.Vector3(box.max.x, box.min.y, box.min.z),
        new THREE.Vector3(box.max.x, box.min.y, box.max.z),
        new THREE.Vector3(box.max.x, box.max.y, box.min.z),
        new THREE.Vector3(box.max.x, box.max.y, box.max.z),
    ];

    const screenPoints = corners.map(corner => {
        rect.localToWorld(corner)
        corner.project(camera)
        return ndcToPixels(corner, viewport)
    });

    const xs = screenPoints.map(p => p.x)
    const ys = screenPoints.map(p => p.y)
  
    const left = Math.min(...xs)
    const right = Math.max(...xs)
    const top = Math.min(...ys)
    const bottom = Math.max(...ys)
  
    return {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top,
    };

}

export { dragLoop }