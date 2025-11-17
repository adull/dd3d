// import deepEqual from 'fast-deep-equal';
import * as THREE from 'three'
import { computeLayout } from './layout'

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

const overlappingData = (a, b, word) => {
    const isOverlapping = !(
      a.x + a.width < b.x ||
      b.x + b.width < a.x ||
      a.y + a.height < b.y ||
      b.y + b.height < a.y
    );
  
    // const word = item.word
    if (!isOverlapping) return { index: -1}
  
    const bw = b.width
    const aCenter = a.x + a.width / 2
    const progress = Math.min(Math.max((aCenter - b.x) / bw, 0), 1)
    const gapIndex = Math.round(progress * word.length)
    return { index: gapIndex }
  };
const getInsertionIndex = (cursorX, layout) => {
  // console.log(cursorX)
  // console.log(layout)
  if (layout.length === 0) return 0
  if(cursorX < layout[0].x) return 0

  if(cursorX > layout[layout.length - 1].x) return layout.length - 1

  for(let i = 0; i < layout.length - 1; i ++) {
    // this needs some work - this doesnt look visually right because:
    // 1: it should be if its halfway through the item, not on the left hand side of it
    // 2: theyre on different z scales so it looks off visually - need to use getBoxFromScreen to create the flat x vals to compare to.
    // fine for now, cant release like this though.
    const itemX = layout[i].x
    if(cursorX < itemX) return i
  }
  return layout.length - 1
}

const isOverlapping = (a, b) =>  !(
    a.x + a.width < b.x ||
    b.x + b.width < a.x ||
    a.y + a.height < b.y ||
    b.y + b.height < a.y
  );

  
const canDrop = (draggingType, containerType) => {
  const rules = {
    // container   allowed items
    'characters': ['characters', 'solutions'],
    'operators': [],
    'solutions': ['characters', 'solutions', 'operators']
  }

  return rules[containerType].includes(draggingType)
}


const dragLoop = ({ scene, camera, mouse, plane, raycaster, body, mesh, viewport, updateFn, item, game, isArranging }) => {
  // if(!isArranging) {
    
  // } 
    // raycaster.setFromCamera(mouse, camera);
    // const point = new THREE.Vector3();
    // raycaster.ray.intersectPlane(plane, point);
    // console.log({ x: point.x, y: point.y})

    const current = body.translation()
    
    const meshFromGroup = mesh.children[0]
    const dragging = getBoxFromScreen(meshFromGroup, camera, viewport)

    const containers = getContainers(scene, current)
  
    for (const container of containers) {
      // console.log(container)
      const containerMesh = container.children[0]
      const containerName = containerMesh.name.replace("container--","")

      
        const containerObj = getBoxFromScreen(containerMesh, camera, viewport)
        if(isOverlapping(dragging, containerObj)) {
          if(canDrop(item.type, containerName)) {
            const word = game[containerName];
            const boxList = word.split('')
            const layout = computeLayout({
              count: boxList.length,
              width: 500,
              padding: 40,
              height: container.position.x
            })
            // console.log(layout)

            const cursorX = dragging.worldCenter.x
            // console.log(cursorX)
            // console.log(dragging)
            const insertionIndex = getInsertionIndex(cursorX, layout)
            const prev = prevResults.get(containerName);
            if (prev !== insertionIndex) {
              console.log(insertionIndex)
              updateFn({
                containerName: containerName,
                oldIndex: item.index,
                newIndex: insertionIndex,
              });
              prevResults.set(containerName, insertionIndex);
            }

          // return
          } else {
            // console.log(`cant - ${item.type} : ${containerName}`)
          }
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

    const worldCenter = new THREE.Vector3();
    worldCenter.copy(box.getCenter(new THREE.Vector3()));
    rect.localToWorld(worldCenter);

  
    return {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top,
      worldCenter
    };

}

export { dragLoop }