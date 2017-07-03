import { coordinatesToIndex, indexToCoordinate } from "../util";
import { CheckersConstants } from "../config/constants";

/**
 * Checkers rules for moves
 */
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
  // Black moves up the board, White moves down the board
  // Kings can move both up and down
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
  // Unless we're jumping another piece we should only move 1 square in the X and Y direction
  mustBeInRange(source, dest, state) {
    return isJump(source, dest, state) || (Math.abs(dest.y - source.y) === 1 && Math.abs(dest.x - source.x) === 1);
  },
  // Gotta be within the bounds of the board
  mustBeInBounds(source, dest, state) {
    const boardSize = window.boardSize;
    const isWithinBounds = ({ x, y }) => x >= 0 && x < boardSize && y >= 0 && y < boardSize;
    return isWithinBounds(source) && isWithinBounds(dest);
  }
};

export const isJump = (source, dest, state) => {
  return !!getJumpedPiece(source, dest, state);
};

/**
 * Returns the piece that was jumped (if any)
 * @param {object} source - The start of the move
 * @param {object} dest - The end of the move
 * @param {array} state - The current state of the board
 */
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
  return getValidMoves(source, state).some(move => move.x === dest.x && move.y === dest.y);
}

/**
 * Whether we should turn the moved piece into a King
 * @param {object} source - The start of the move
 * @param {object} dest - The end of the move
 * @param {array} state - The current state of the board
 */
export function shouldKing(source, dest, boardState) {
  const destIndex = coordinatesToIndex(dest.x, dest.y);
  const state = boardState[destIndex];

  if (state.key === CheckersConstants.BLACK.key) {
    return dest.y === 0;
  }

  return dest.y === window.boardSize - 1;
}

/**
 * Whether there are any pieces we can jump.  This is needed for continuation
 * moves where you are making a double or triple jump
 * @param {object} source - The board square to search from
 * @param {*} boardState - The current state of the board
 */
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

  const potentialMoves = [];
  // Normal moves
  potentialMoves.push({ x: x + 1, y: y + dx });
  potentialMoves.push({ x: x - 1, y: y + dx });

  // Jumps
  potentialMoves.push({ x: x + 2, y: y + dx + dx, isJump: true });
  potentialMoves.push({ x: x - 2, y: y + dx + dx, isJump: true });

  if (piece.isKing) {
    // King can move in the opposite direction
    potentialMoves.push({ x: x + 1, y: y - dx });
    potentialMoves.push({ x: x - 1, y: y - dx });

    potentialMoves.push({ x: x + 2, y: y - dx - dx, isJump: true });
    potentialMoves.push({ x: x - 2, y: y - dx - dx, isJump: true });
  }

  const validMoves = potentialMoves.filter(dest => {
    return Object.keys(ValidityChecks).every(func => ValidityChecks[func](source, dest, boardState));
  });

  // One last filter, if there is a piece you can jump, you must jump it
  const hasJumpAvailable = validMoves.some(move => move.isJump);
  return hasJumpAvailable ? validMoves.filter(move => move.isJump) : validMoves;
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

/**
 * Returns an array of all valid moves for a player given the current board state
 * @param {object} player - The current player
 * @param {array} boardState - The current board state
 */
export const getAvailableMovesForPlayer = (player, boardState) => {
  return boardState
    .map((piece, index, full) => {
      console.log("FULL", full);
      const { x, y } = indexToCoordinate(index);
      return getValidMoves({ x, y }, boardState).map(move => ({
        source: { x, y },
        dest: { x: move.x, y: move.y },
        isJump: move.isJump
      }));
    })
    .filter(Boolean)
    .reduce((a, b) => a.concat(b), []); // Flatten array
};

/**
 * 
 * @param {number} turn - The turn number
 * @param {array} boardState - The current state of the board
 */
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

export const generateBoard = size => {
  const W = CheckersConstants.WHITE;
  const B = CheckersConstants.BLACK;
  // 'O' for brevity in the initialState here
  const O = CheckersConstants.EMPTY_SQUARE;
  const EMPTY_SQUARE = CheckersConstants.EMPTY_SQUARE;

  let board = [];
  for (let i = 0; i < size * size; i++) {
    let { x, y } = indexToCoordinate(i);
    let elem;

    if (isPlayableSpace(x, y)) {
      if (y < 3) {
        elem = W;
      } else if (size - y - 1 < 3) {
        elem = B;
      } else {
        elem = O;
      }
    } else {
      elem = O;
    }
    board.push(elem);
  }

  // For react-dnd to track our pieces we need stable IDs,
  // so this assigns them in the initial state
  console.log("Generated board", board);
  return board.map((x, index) => (x === EMPTY_SQUARE ? x : { ...x, id: index }));
};
