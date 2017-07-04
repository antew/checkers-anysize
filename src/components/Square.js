import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { DropTarget } from "react-dnd";
import "./Square.css";
import classNames from "classnames";
import { ItemTypes } from "../config/constants";
import BasicSquare from "./BasicSquare";

const target = {
  canDrop(props, monitor) {
    const item = monitor.getItem();
    return props.isValidMove(item);
  },

  drop(props, monitor, component) {
    props.onCheckerDropped(monitor.getItem());
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

class Square extends PureComponent {
  static propTypes = {
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    black: PropTypes.bool,
    children: PropTypes.element
  };

  render() {
    const { connectDropTarget, children, black, isOver, canDrop } = this.props;
    const squareClasses = classNames({
      black: black,
      "is-over": isOver,
      "can-drop": canDrop,
      "cannot-drop": isOver && !canDrop
    });

    return connectDropTarget(
      // Wrapper div is necessary for react-dnd, only native element nodes
      // can be passed to it as React DnD connectors.  We don't want our
      // basic square to know about the nightmarish hellscape of drag-and-drop
      // so we wrap it.
      <div>
        <BasicSquare black classes={squareClasses}>
          {children}
        </BasicSquare>
      </div>
    );
  }
}

export default DropTarget(ItemTypes.CHECKER, target, collect)(Square);
