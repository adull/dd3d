const hardSet = (body, posObj) => {
    console.log(body, posObj)
    const zero = { x: 0, y: 0, z: 0}
    body.setTranslation(posObj)
    body.setLinvel(zero)
}

export { hardSet }