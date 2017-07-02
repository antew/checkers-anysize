import { GameActions } from "../actions/Game.js";
import { coordinatesToIndex } from "../util";
import { CheckersConstants } from "../config/constants";

const W = CheckersConstants.WHITE;
const B = CheckersConstants.BLACK;
// 'O' for brevity in the initialState here
const O = CheckersConstants.EMPTY_SQUARE;
const EMPTY_SQUARE = CheckersConstants.EMPTY_SQUARE;

/* prettier-ignore */
const initialState = [
  O, W, O, W, O, W, O, W,
  W, O, W, O, W, O, W, O,
  O, W, O, W, O, W, O, W,
  O, O, O, O, O, O, O, O,
  O, O, O, O, O, O, O, O,
  B, O, B, O, B, O, B, O,
  O, B, O, B, O, B, O, B,
  B, O, B, O, B, O, B, O,
]
// For react-dnd to track our pieces we need stable IDs,
// so this assigns them in the initial state
.map((x, index) => x === EMPTY_SQUARE ? x : { ...x, id: index });

export default (state = initialState, action) => {
  switch (action.type) {
    case GameActions.RESET_GAME:
      return initialState;

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
