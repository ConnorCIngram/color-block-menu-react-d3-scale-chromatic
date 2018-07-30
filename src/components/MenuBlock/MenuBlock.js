import React, { Component } from "react";
import "./MenuBlock.css";

class MenuBlock extends Component {
  state = {};
  render() {
    return (
      <div className="Menu-block">
        <div
          className="Menu-block-upper-bar"
          style={{ backgroundColor: this.props.color }}
        />
        <div
          className="Menu-block-upper"
          style={{ backgroundColor: this.props.color, color: this.props.color }}
          href="/"
          onMouseEnter={e => {
            e.target.style.color = this.props.color;
          }}
          onMouseLeave={e => {
            e.target.style.backgroundColor = this.props.color;
          }}
          onTouchStart={e => {
            e.target.style.color = this.props.color;
          }}
          onTouchEnd={e => {
            e.target.style.backgroundColor = this.props.color;
          }}
        >
          <span
            style={{ pointerEvents: "none" }}
            className="Menu-block-upper-text"
          >
            {this.props.color.toUpperCase()}
          </span>
        </div>
        <div
          className="Menu-block-lower"
          style={{ backgroundColor: this.props.color }}
        />
      </div>
    );
  }
}

export default MenuBlock;
