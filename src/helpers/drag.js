import * as THREE from 'three'


const testDraw = (pos, box) => {
    console.log({ box })
    
    const px = ndcToPixels(pos, viewport)
    console.log({ px })
    const div = document.createElement("div")
    const cont = document.createTextNode('a')
    // div.setAttribute('style', `position: absolute;left: ${px.x}px; bottom:${px.y}px`)
    div.setAttribute(
        'style',
        `position: absolute; left:${box.x}px; top:${box.y}px; height:${box.height}px;width:${box.width}px; background-color:red`
    )
    div.append(cont)
    const root = document.getElementById('root')
    document.body.insertBefore(div, root)
    
}

const dragLoop = ({ scene, camera, pointer, plane, raycaster, body, viewport }) => {
    console.log(body)
    const current = body.translation();

    // getScreenPosition(container, camera)

    const containers = getContainers(scene, current)
    containers.forEach(container => {
        const mesh = container.children[0]
        const pos = getScreenPosition(container, camera)
        const box = getBoxFromScreen(mesh, camera, viewport)
        testDraw(pos, box)
        // console.log({ container })
       
        
    })


    const velocity = body.linvel();
    const target = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, target);
    

    const stiffness = 9000; 
    const damping = 1000;

    const posError = new THREE.Vector3().subVectors(target, current);
    const velError = new THREE.Vector3().copy(velocity);

    const force = posError.multiplyScalar(stiffness).sub(velError.multiplyScalar(damping));
    body.applyImpulse(force, true);
}

const getContainers = (scene) => {
    const objects = scene.children.filter(item => item.type === "Object3D")
    const containers = objects.filter(item => item.children[0].name === "container")
    return containers
    
}

const getScreenPosition = (obj, camera) => { 
    const pos = new THREE.Vector3();
    obj.localToWorld(pos)
    pos.project(camera)

    return pos
}

const ndcToPixels = (pos, viewport) => {
    const { width, height } = viewport;
    return {
      x: (pos.x * 0.5 + 0.5) * width,
      y: (1 - (pos.y * 0.5 + 0.5)) * height,
    };
}

const getBoxFromScreen = (container, camera, viewport) => {
    container.updateMatrixWorld(true)
    const geometry = container.geometry
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
        container.localToWorld(corner);
        corner.project(camera);
        return ndcToPixels(corner, viewport);
    });

    const xs = screenPoints.map(p => p.x);
    const ys = screenPoints.map(p => p.y);
  
    const left = Math.min(...xs);
    const right = Math.max(...xs);
    const top = Math.min(...ys);
    const bottom = Math.max(...ys);
  
    return {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top,
    };

}

export { dragLoop }