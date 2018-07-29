import React, { Component } from "react";
import "./MenuBlock.css";

class MenuBlock extends Component {
  state = {};
  render() {
    return (
      <div className="Menu-block">
        <div
          className="Menu-block-upper"
          style={{ backgroundColor: this.props.color }}
          href="/"
          onMouseEnter={e => {
            e.target.style.backgroundColor = "#212121";
            e.target.style.color = this.props.color;

            // e.target.parentNode.style.gridTemplateRows = "auto 30px";
          }}
          onMouseLeave={e => {
            e.target.style.backgroundColor = this.props.color;
            e.target.style.color = "black";

            // e.target.parentNode.style.gridTemplateRows = "auto 2px";
          }}
          onTouchStart={e => {
            e.target.style.backgroundColor = "#212121";
            e.target.style.color = this.props.color;
          }}
          onTouchEnd={e => {
            e.target.style.backgroundColor = this.props.color;
            e.target.style.color = "#212121";
          }}
        >
          {this.props.color.toUpperCase()}
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
