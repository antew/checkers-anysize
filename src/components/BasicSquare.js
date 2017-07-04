import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./BasicSquare.css";

export default class BasicSquare extends PureComponent {
  static propTypes = {
    black: PropTypes.bool,
    children: PropTypes.element,
    styleName: PropTypes.string
  };

  render() {
    const { black, children, classes } = this.props;

    return (
      <div className={classNames("square", { black: black }, classes)}>
        {children}
      </div>
    );
  }
}
