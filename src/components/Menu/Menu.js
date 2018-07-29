import React, { Component } from "react";
import "./Menu.css";

import MenuBlock from "../MenuBlock/MenuBlock";

var d3ScaleChromatic = require("d3-scale-chromatic");

let colorSchemes = [];
for (let d in d3ScaleChromatic) {
  if (typeof d3ScaleChromatic[d] == "function") {
    // interpolated scheme
    colorSchemes.push({
      name: d,
      scheme: convertToStepScheme(d3ScaleChromatic[d], 10)
    });
  } else {
    // scheme
    if (d3ScaleChromatic[d][0]) {
      // ignore discrete schemes because they're coverted by their interolation
      colorSchemes.push({
        name: d,
        scheme: d3ScaleChromatic[d]
      });
    }
  }
}
console.log(colorSchemes);

/**
 * Returns an array of color steps through a d3-scale-chromatic continous interpolator.
 *
 *
 * @param {d3.interpolator} scheme  The d3 continuous interpolator
 * @param {number} steps               Indicates how many colors you want to return
 * @param {array, len 2} [splice]   Optional variable, takes a subsection of [0,1] (ex: [0.8,1])
 */
function convertToStepScheme(scheme, steps, splice) {
  let step = 1 / steps;
  let a = [];
  let start = 0;
  let end = 1;
  // if splice was passed, validate
  if (splice) {
    if (splice.length === 2) {
      if (splice[0] < splice[1]) {
        start = splice[0];
        end = splice[1];
        step = (end - start) / steps;
      }
    }
  }

  // populate the array
  for (let i = start; i < end; i += step) {
    a.push(scheme(i));
  }

  // trim the array if necessary
  //  I'm shifting, but a better alternative could be used
  if (a.length > steps) a.shift();

  // return the array
  return a;
}

// media query breakpoints
const breakpoints = {
  mobileS: { min: 0, max: 600, maxCols: 1 },
  mobile: { min: 600, max: 900, maxCols: 2 },
  tablet: { min: 900, max: 1200, maxCols: 4 },
  computer: { min: 1200, max: 1800, maxCols: 10 },
  computerL: { min: 1800, max: Infinity, maxCols: 20 }
};

class Menu extends Component {
  constructor(props) {
    super(props);

    // initialize max columns for current device

    this.state = {
      schemeIdx: 0,
      scheme: colorSchemes[0],
      maxCols: null,
      device: null
    };
    this.handleSchemeChange = this.handleSchemeChange.bind(this);
  }

  handleSchemeChange() {
    this.setState(
      // first increment the scheme index by 1, or reset if end of color schemes
      {
        schemeIdx:
          this.state.schemeIdx < colorSchemes.length - 1
            ? this.state.schemeIdx + 1
            : 0
      },
      () => {
        // on the callback, update the actual state color scheme
        this.setState({ scheme: colorSchemes[this.state.schemeIdx] });
      }
    );
  }

  componentDidMount() {
    // once the component mounts, listen for and handle window sizes
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  resize() {
    let width = parseInt(window.innerWidth),
      device;

    // find breakpoints
    for (let key in breakpoints) {
      if (breakpoints.hasOwnProperty(key)) {
        if (breakpoints[key].min <= width && width <= breakpoints[key].max) {
          device = key;
          break;
        }
      }
    }

    // only change state if the device width has changed
    if (this.state.device !== device) {
      this.setState(() => {
        return {
          device: device,
          maxCols: breakpoints[device].maxCols
        };
      });
    }
  }

  render() {
    return (
      <div className="Menu">
        <div className="Menu-upper">{this.state.scheme.name}</div>
        <div
          className="Menu-wrapper"
          style={{
            gridTemplateColumns:
              "repeat(" +
              Math.min(this.state.scheme.scheme.length, this.state.maxCols) +
              ",1fr)"
          }}
        >
          {this.state.scheme.scheme.map(color => {
            return <MenuBlock color={color} key={color.substr(1)} />;
          })}
        </div>
        <div className="Menu-lower">
          <button onClick={this.handleSchemeChange} className="button change">
            Change Color Scheme
          </button>
        </div>
      </div>
    );
  }
}

export default Menu;
