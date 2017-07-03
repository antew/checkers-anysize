import { GameActions } from "../actions/Game.js";
import { coordinatesToIndex, indexToCoordinate } from "../util";
import { Defaults, CheckersConstants } from "../config/constants";
import { generateBoard } from "../rules/CheckersRules";

// Todo, replace hackyness, right now some utility functions
// require the board size but are not connected to redux
window.boardSize = Defaults.boardSize;
const initialState = generateBoard(window.boardSize);
const EMPTY_SQUARE = CheckersConstants.EMPTY_SQUARE;
export default (state = initialState, action) => {
  switch (action.type) {
    case GameActions.RESET_GAME:
      return initialState;

    case GameActions.UPDATE_BOARD_SIZE:
      window.boardSize = action.size || 8;
      return generateBoard(action.size);
    case GameActions.CHECKER_DRAGGED:
      return state;

    case GameActions.REMOVE_CHECKER:
      const indexToRemove = coordinatesToIndex(action.x, action.y);
      return state.map((x, index) => (index === indexToRemove ? EMPTY_SQUARE : x));

    case GameActions.KING_PIECE:
      const indexToUpdate = coordinatesToIndex(action.x, action.y);
      return state.map((x, index) => (index === indexToUpdate ? { ...x, isKing: true } : x));

    case GameActions.CHECKER_DROPPED:
      const { x: x1, y: y1 } = action.source;
      const { x: x2, y: y2 } = action.dest;

      const sourceIndex = coordinatesToIndex(x1, y1);
      const destIndex = coordinatesToIndex(x2, y2);

      return state.map((square, index) => {
        // Remove the original piece
        if (index === sourceIndex) {
          return EMPTY_SQUARE;
        }

        // Move it to its new home
        if (index === destIndex) {
          return { ...state[sourceIndex] };
        }

        return square;
      });

    default:
      return state;
  }
};
