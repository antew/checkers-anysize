import React, { Component } from "react";
import "./App.css";
import CheckersGame from "./containers/CheckersGame";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import { connect } from "react-redux";
import { compose } from "redux";

import { resetGame } from "./actions/Game";
class App extends Component {
  render() {
    const { boardState, resetGame, turn } = this.props;
    return (
      <div className="App">
        <CheckersGame boardState={boardState} />
        <button onClick={resetGame}>Reset Game</button>
        <span>
          Turn {turn.count}
        </span>
        <div />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  boardState: state.board,
  turn: state.turn
});

const enhance = compose(connect(mapStateToProps, { resetGame }), DragDropContext(HTML5Backend));

export default enhance(App);
