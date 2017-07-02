import {
  isJump,
  getJumpedPiece,
  canJump,
  getCurrentPlayer,
  getOtherPlayer,
  shouldKing,
  checkGameState
} from "../rules/CheckersRules";
export const GameActions = {
  CHECKER_DRAGGED: "CHECKER_DRAGGED",
  CHECKER_DROPPED: "CHECKER_DROPPED",
  END_TURN: "END_TURN",
  RESET_GAME: "RESET_GAME",
  SET_INSTRUCTIONS: "SET_INSTRUCTIONS",
  REMOVE_CHECKER: "REMOVE_CHECKER",
  ERROR_MESSAGE: "ERROR_MESSAGE",
  SET_ACTIVE_PIECE: "SET_ACTIVE_PIECE",
  KING_PIECE: "KING_PIECE",
  GAME_OVER: "GAME_OVER"
};

export const endTurn = () => ({
  type: GameActions.END_TURN
});

export const setInstructions = instructions => ({
  type: GameActions.SET_INSTRUCTIONS,
  instructions
});

export const setActivePiece = (x, y) => ({
  type: GameActions.SET_ACTIVE_PIECE,
  x,
  y
});

export const kingPiece = (x, y) => ({
  type: GameActions.KING_PIECE,
  x,
  y
});
export const setError = errorMessage => ({
  type: GameActions.SET_INSTRUCTIONS,
  errorMessage
});

export const checkerDragged = (x, y) => {
  return {
    type: GameActions.CHECKER_DRAGGED,
    x,
    y
  };
};

export const gameOver = finalState => dispatch => {
  dispatch({ type: GameActions.GAME_OVER });
  dispatch(setInstructions(`Game over! ${finalState}`));
};

export const checkerDropped = (source, dest) => {
  return (dispatch, getState) => {
    dispatch({ type: GameActions.CHECKER_DROPPED, source, dest });

    const currentPlayer = getCurrentPlayer(getState().turn.count);
    const otherPlayer = getOtherPlayer(getState().turn.count);

    // // King the piece?
    if (shouldKing(source, dest, getState().board)) {
      debugger;
      dispatch(kingPiece(dest.x, dest.y));
    }

    if (isJump(source, dest, getState().board)) {
      const jumpedPiece = getJumpedPiece(source, dest, getState().board);
      dispatch(removePiece(jumpedPiece.x, jumpedPiece.y));

      if (canJump(dest, getState().board)) {
        dispatch(setActivePiece(dest.x, dest.y));
        return dispatch(setInstructions(`${currentPlayer.name}, it is still your turn!`));
      }
    }

    const gameState = checkGameState(getState().turn.count, getState().board);
    if (gameState.gameOver) {
      dispatch(gameOver(gameState.description));
    } else {
      dispatch(setInstructions(`${otherPlayer.name}, it is your turn.`));
      dispatch(endTurn());
    }
  };
};

export const removePiece = (x, y) => {
  return {
    type: GameActions.REMOVE_CHECKER,
    x,
    y
  };
};

export const resetGame = () => {
  return {
    type: GameActions.RESET_GAME
  };
};
