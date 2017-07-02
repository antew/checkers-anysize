import { GameActions } from "../actions/Game.js";

const initialState = {
  instructions: "",
  additionalInstructions: ""
};
export default (instructions = initialState, action) => {
  switch (action.type) {
    case GameActions.SET_INSTRUCTIONS:
      return {
        ...instructions,
        instructions: action.instructions
      };
    case GameActions.SET_ADDITIONAL_INSTRUCTIONS:
      return {
        ...instructions,
        additionalInstructions: action.additionalInstructions
      };

    case GameActions.END_TURN:
      return {
        ...instructions,
        additionalInstructions: ""
      };

    case GameActions.RESET_GAME:
      return initialState;

    default:
      return instructions;
  }
};
