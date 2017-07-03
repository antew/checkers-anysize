export const coordinatesToIndex = (x, y) => {
  return window.boardSize * y + x;
};
export const indexToCoordinate = index => ({
  x: index % window.boardSize,
  y: Math.floor(index / window.boardSize)
});
