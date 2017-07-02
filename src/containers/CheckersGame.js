import React, { Component } from "react";
import PropTypes from "prop-types";
import "./CheckersGame.css";
import Square from "../components/Square";
import { connect } from "react-redux";
import {
  checkerDragged,
  checkerDropped,
  removePiece,
  endTurn,
  setInstructions,
  setActivePiece,
  kingPiece
} from "../actions/Game";
import { indexToCoordinate } from "../util";
import { isValidMove, getValidMoves, isPlayableSpace, getCurrentPlayer, getOtherPlayer } from "../rules/CheckersRules";
import BasicSquare from "../components/BasicSquare";

import Checker from "../components/Checker";

class CheckersGame extends Component {
  static propTypes = {
    size: PropTypes.number
  };

  componentDidMount() {
    const { setInstructions, currentPlayer } = this.props;
    setInstructions(`${currentPlayer.name}, it is your turn.`);
  }

  renderChecker(x, y, piece) {
    const { activePiece, currentPlayerKey, boardState } = this.props;

    const isCurrentPlayersPiece = currentPlayerKey === piece.key;
    const availableMoves = getValidMoves({ x, y }, boardState);

    const canDrag =
      isCurrentPlayersPiece &&
      availableMoves.length > 0 &&
      (!activePiece || (activePiece.x === x && activePiece.y === y && availableMoves.some(move => move.isJump)));
    return (
      <Checker
        x={x}
        y={y}
        canDrag={canDrag}
        onCheckerDragged={checkerDragged.bind(this, { x, y })}
        color={piece.color}
        symbol={piece.isKing ? piece.kingSymbol : piece.symbol}
      />
    );
  }

  createSquares() {
    const { boardState, checkerDropped } = this.props;
    const squares = [];
    for (let i = 0; i < 64; i++) {
      const piece = boardState[i];
      const { x, y } = indexToCoordinate(i);
      if (isPlayableSpace(x, y)) {
        squares.push(
          <Square
            key={piece.id}
            isValidMove={source => isValidMove(source, { x, y }, boardState)}
            onCheckerDropped={source => checkerDropped(source, { x, y })}
          >
            {this.renderChecker(x, y, piece)}
          </Square>
        );
      } else {
        squares.push(<BasicSquare key={`${x}-${y}`} />);
      }
    }
    return squares;
  }

  render() {
    return (
      <div>
        <div className="board">
          {this.createSquares()}
        </div>
        <div className="instructions">
          {this.props.instructions}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentPlayerKey: getCurrentPlayer(state.turn.count).key,
  currentPlayer: getCurrentPlayer(state.turn.count),
  otherPlayer: getOtherPlayer(state.turn.count),
  instructions: state.instructions,
  activePiece: state.turn.activePiece
});
export default connect(mapStateToProps, {
  checkerDragged,
  checkerDropped,
  removePiece,
  endTurn,
  setInstructions,
  setActivePiece,
  kingPiece
})(CheckersGame);