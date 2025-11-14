const computeLayout = ({ count, width = 500, padding = 0, height = 0 }) => {
    if (count === 0) return [];
  
    const totalInnerWidth = width - padding * 2;
    const spacing = count > 1 ? totalInnerWidth / (count - 1) : 0;
    const start = -totalInnerWidth / 2;
  
    return Array.from({ length: count }, (_, index) => {
      return {
        x: start + spacing * index,
        y: height,
        z: 30,
      };
    });
  };

  
export { computeLayout }