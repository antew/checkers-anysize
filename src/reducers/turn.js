import { GameActions } from "../actions/Game.js";

const initialState = {
  count: 0,
  activePiece: undefined
};
export default (turn = initialState, action) => {
  switch (action.type) {
    case GameActions.END_TURN:
      return {
        ...turn,
        count: turn.count + 1,
        activePiece: undefined
      };
    case GameActions.SET_ACTIVE_PIECE:
      const { x, y } = action;
      return {
        ...turn,
        activePiece: {
          x,
          y
        }
      };
    case GameActions.RESET_GAME:
      return initialState;
    default:
      return turn;
  }
};
