import { coordinatesToIndex, indexToCoordinate } from "../util";
import { CheckersConstants, Defaults } from "../config/constants";

const ValidityChecks = {
  mustNotBeTheSameSquare(source, dest) {
    return source.x !== dest.x || source.y !== dest.y;
  },
  mustBeABlackSquare(source, dest) {
    return (dest.x + dest.y) % 2 === 1;
  },
  mustNotBeOccupied(source, dest, state) {
    const { x, y } = dest;
    return state[coordinatesToIndex(x, y)] === 0;
  },
  mustBeInTheCorrectDirection(source, dest, state) {
    const dy = dest.y - source.y;
    const index = coordinatesToIndex(source.x, source.y);
    const isKing = state[index].isKing;
    const allowedDirection = state[index].direction;

    if (isKing) {
      return true;
    }

    return allowedDirection === -1 ? dy < 0 : dy > 0;
  },
  mustBeInRange(source, dest, state) {
    return isJump(source, dest, state) || (Math.abs(dest.y - source.y) === 1 && Math.abs(dest.x - source.x) === 1);
  },
  mustBeInBounds(source, dest, state) {
    const boardSize = Defaults.boardSize;
    const isWithinBounds = ({ x, y }) => x >= 0 && x < boardSize && y >= 0 && y < boardSize;
    return isWithinBounds(source) && isWithinBounds(dest);
  }
};

export const isJump = (source, dest, state) => {
  return !!getJumpedPiece(source, dest, state);
};

export const getJumpedPiece = (source, dest, state) => {
  const isMovingTwoSquares = Math.abs(dest.x - source.x) === 2 && Math.abs(dest.y - source.y) === 2;
  const dx = dest.x - source.x;
  const dy = dest.y - source.y;

  const jumpX = source.x + dx / 2;
  const jumpY = source.y + dy / 2;
  const jumpCoords = coordinatesToIndex(jumpX, jumpY);

  const sourcePiece = state[coordinatesToIndex(source.x, source.y)];
  const jumpPiece = state[jumpCoords];

  if (isMovingTwoSquares && jumpPiece !== 0 && sourcePiece.key !== jumpPiece.key) {
    return { x: jumpX, y: jumpY };
  }
};

export function isValidMove(source, dest, state) {
  return Object.keys(ValidityChecks).every(func => ValidityChecks[func](source, dest, state));
}

export function shouldKing(source, dest, boardState) {
  const destIndex = coordinatesToIndex(dest.x, dest.y);
  const state = boardState[destIndex];

  if (state.key === CheckersConstants.BLACK.key) {
    return dest.y === 0;
  }

  return dest.y === Defaults.boardSize;
}

export function canJump(source, boardState) {
  return getValidMoves(source, boardState).filter(move => move.isJump).length > 0;
}

export function getValidMoves(source, boardState) {
  const { x, y } = source;
  const index = coordinatesToIndex(x, y);
  const piece = boardState[index];
  if (piece === CheckersConstants.EMPTY_SQUARE) {
    return [];
  }
  const dx = piece.direction;

  const validMoves = [];
  // Normal moves
  validMoves.push({ x: x + 1, y: y + dx });
  validMoves.push({ x: x - 1, y: y + dx });

  // Jumps
  validMoves.push({ x: x + 2, y: y + dx + dx, isJump: true });
  validMoves.push({ x: x - 2, y: y + dx + dx, isJump: true });

  if (piece.isKing) {
    // King can move in the opposite direction
    validMoves.push({ x: x + 1, y: y - dx });
    validMoves.push({ x: x - 1, y: y - dx });

    validMoves.push({ x: x + 2, y: y - dx - dx, isJump: true });
    validMoves.push({ x: x - 2, y: y - dx - dx, isJump: true });
  }

  return validMoves.filter(dest => isValidMove(source, dest, boardState));
}

export function isPlayableSpace(x, y) {
  return (x + y) % 2 === 1;
}

export function getCurrentPlayer(turn) {
  return turn % 2 === 0 ? CheckersConstants.BLACK : CheckersConstants.WHITE;
}

export function getOtherPlayer(turn) {
  return getCurrentPlayer(turn) === CheckersConstants.WHITE ? CheckersConstants.BLACK : CheckersConstants.WHITE;
}

const getAvailableMovesForPlayer = (player, boardState) => {
  return boardState
    .map((piece, index) => {
      const { x, y } = indexToCoordinate(index);
      return piece.key === player.key && getValidMoves({ x, y }, boardState);
    })
    .filter(Boolean)
    .reduce((a, b) => a.concat(b)); // Flatten array
};
export function checkGameState(turn, boardState) {
  const currentPlayer = getCurrentPlayer(turn);
  const otherPlayer = getOtherPlayer(turn);
  const currentPlayerPieceCount = boardState.filter(x => x.key === currentPlayer.key).length;
  const otherPlayerPieceCount = boardState.filter(x => x.key === otherPlayer.key).length;

  const gameOver = description => ({ gameOver: true, description });

  // No pieces left, game over
  if (currentPlayerPieceCount === 0) {
    return gameOver(`${otherPlayer.name} has won, ${currentPlayer.name} has no more pieces`);
  }

  if (otherPlayerPieceCount === 0) {
    return gameOver(`${currentPlayer.name} has won, ${otherPlayer.name} has no more pieces`);
  }

  // If we're ending our turn and the opponent can't move then they have lost
  const currentPlayerAvailableMoves = getAvailableMovesForPlayer(currentPlayer, boardState);
  const otherPlayerAvailableMoves = getAvailableMovesForPlayer(otherPlayer, boardState);

  if (otherPlayerAvailableMoves.length === 0) {
    return gameOver(`${currentPlayer.name} has won, ${otherPlayer.name} can't move`);
  }
  if (currentPlayerAvailableMoves.length === 0) {
    return gameOver(`${otherPlayer.name} has won, ${currentPlayer.name} can't move`);
  }

  return {
    gameOver: false
  };
}
