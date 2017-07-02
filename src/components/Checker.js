import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Checker.css";
import classNames from "classnames";
import { ItemTypes } from "../config/constants";
import { DragSource } from "react-dnd";

const checkerSource = {
  canDrag(props) {
    return props.canDrag;
  },
  beginDrag(props) {
    props.onCheckerDragged();
    return { x: props.x, y: props.y };
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
    canDrag: monitor.canDrag()
  };
}

class Checker extends Component {
  static propTypes = {
    symbol: PropTypes.string.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    canDrag: PropTypes.bool.isRequired
  };

  render() {
    const { symbol, connectDragSource, canDrag, isDragging } = this.props;
    const classes = classNames("checker", {
      translucent: isDragging,
      moveable: canDrag
    });
    return (
      <div className={classes}>
        {connectDragSource(
          <span style={{ color: this.props.color }}>
            {symbol}
          </span>
        )}
      </div>
    );
  }
}

export default DragSource(ItemTypes.CHECKER, checkerSource, collect)(Checker);
