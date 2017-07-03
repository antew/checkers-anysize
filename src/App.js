import React, { Component } from "react";
import "./App.css";
import CheckersGame from "./containers/CheckersGame";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import { connect } from "react-redux";
import { compose } from "redux";

import { resetGame, updateBoardSize } from "./actions/Game";
class App extends Component {
  render() {
    const { boardState, resetGame, turn, updateBoardSize } = this.props;
    return (
      <div className="App">
        <CheckersGame boardState={boardState} />
        <div className="control-panel">
          <button onClick={resetGame}>Reset Game</button>
          <div className="turn-counter">
            Turn: {turn.count}
          </div>
          <div className="board-size">
            <input
              type="number"
              min={4}
              max={32}
              value={window.boardSize}
              onChange={e => updateBoardSize(parseInt(e.target.value, 10))}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  boardState: state.board,
  turn: state.turn
});

const enhance = compose(connect(mapStateToProps, { resetGame, updateBoardSize }), DragDropContext(HTML5Backend));

export default enhance(App);
