const evenlySpace = ({height, width, x, y, array}) => {
    const increment = (width) / (array.length - 1)
    return array.map((item, index) => {
        return { pos: [height, 0, x + (index * increment)] }
    })
}

export { evenlySpace }