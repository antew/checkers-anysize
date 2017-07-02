import { Defaults } from "./config/constants";

const boardSize = Defaults.boardSize;

export const coordinatesToIndex = (x, y) => {
  return boardSize * y + x;
};
export const indexToCoordinate = index => ({
  x: index % boardSize,
  y: Math.floor(index / boardSize)
});
