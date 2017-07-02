import { GameActions } from "../actions/Game.js";

const initialState = "";
export default (instructions = initialState, action) => {
  switch (action.type) {
    case GameActions.SET_INSTRUCTIONS:
      return action.instructions;

    case GameActions.RESET_GAME:
      return initialState;

    default:
      return instructions;
  }
};
