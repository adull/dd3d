const getCurrentCamPos = (camRef) => {
    console.log(`get current campos`)
    const pos = camRef.current.position
    console.log(pos)
}
const updateSavedCamPos = (camRef) => {
    const pos = camRef.current.position
    const stringPos = JSON.stringify(pos)
    
    sessionStorage.setItem("camPos", stringPos)
}

const getSavedCamPos = () => {
    // const defaultPos = [0,20,100]
    const defaultObj = {x: 0, y: 20, z: 100}
    const defaultPos = JSON.stringify(defaultObj)
    const camPos = sessionStorage.getItem("camPos")
    return camPos ?? defaultPos
}

const posArrToObj = (arr) => {
    return { x:arr[0], y: arr[1], z: arr[2]}
}

const posObjToArr = (obj) => {
    return [obj.x, obj.y, obj.z]
}

const isOperator = (char) => {
    const operators = '+-x/'.split()
    return operators.includes(char)
}

const getItemType = (char) => {
    return isOperator(char) ? `operators` : `characters`
}

export { getCurrentCamPos, getSavedCamPos, updateSavedCamPos, posArrToObj, posObjToArr, isOperator, getItemType }

