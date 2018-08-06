import React, { Component } from "react";
import "./Menu.css";

import MenuBlock from "../MenuBlock/MenuBlock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
var d3ScaleChromatic = require("d3-scale-chromatic");

// global array that all color schemes will go into
//  each scheme is an object:
//    name: String
//    scheme: Array
//    type: String
let colorSchemes = [];
for (let d in d3ScaleChromatic) {
  if (typeof d3ScaleChromatic[d] === "function") {
    // interpolated scheme
    colorSchemes.push({
      name: d,
      scheme: convertToStepScheme(d3ScaleChromatic[d], 10),
      type: "interpolated"
    });
  } else {
    // scheme
    if (d3ScaleChromatic[d][0]) {
      // ignore discrete schemes because they're coverted by their interolation
      colorSchemes.push({
        name: d,
        scheme: d3ScaleChromatic[d],
        type: "scheme"
      });
    }
  }
}
// you can add custom schemes by pushing to colorSchemes
// ex:
// colorSchemes.push({
//   name: 'name',
//   scheme: ['#000', '#001', '#002', ...]
// })

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
  mobileS: { min: 0, max: 600, maxCols: 2 },
  mobile: { min: 600, max: 900, maxCols: 2 },
  tablet: { min: 900, max: 1200, maxCols: 4 },
  computer: { min: 1200, max: 1800, maxCols: 10 },
  computerL: { min: 1800, max: Infinity, maxCols: 20 }
};

// unique key generator from https://gist.github.com/jed/982883
//  used to uniquely identify mapped components
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

class Menu extends Component {
  constructor(props) {
    super(props);

    // initialize max columns for current device

    this.state = {
      scheme: colorSchemes[0],
      maxCols: null,
      device: null,
      editMenuActive: false
    };
    this.handleSchemeChange = this.handleSchemeChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSpliceChange = this.handleSpliceChange.bind(this);
  }

  handleSchemeChange(e) {
    let currentIndex = colorSchemes.indexOf(this.state.scheme);
    let nextIndex;
    if (e.target.id === "button increment") {
      // increment index
      nextIndex = currentIndex < colorSchemes.length - 1 ? currentIndex + 1 : 0;
    } else if (e.target.id === "button decrement") {
      // decrement index
      nextIndex = currentIndex > 0 ? currentIndex - 1 : colorSchemes.length - 1;
    } else {
      // should never get here
      console.log("ERROR: INDEX DID NOT CHANGE");
      nextIndex = currentIndex;
    }
    this.setState(() => {
      return {
        scheme: colorSchemes[nextIndex]
      };
    });
    document.getElementById("Menu-select").selectedIndex = nextIndex;
  }

  handleSelectChange(e) {
    this.setState({
      scheme: colorSchemes.filter(scheme => scheme.name === e.target.value)[0]
    });
  }

  handleSpliceChange(e) {
    let start = parseFloat(document.getElementById("splice-1").value);
    let end = parseFloat(document.getElementById("splice-2").value);
    let steps = parseInt(document.getElementById("splice-steps").value, 10);

    if (!start) start = 0;
    if (!end) end = 1;
    if (!steps) steps = 10;

    if (start > 1 || start < 0) {
      alert("Values must be between 0 and 1.");
      return;
    } else if (end > 1 || end < 0) {
      alert("Values must be between 0 and 1.");

      return;
    }

    // validate
    if (end >= start && steps > 0 && steps < 10000) {
      let idx = colorSchemes.indexOf(this.state.scheme);

      colorSchemes[idx].scheme = convertToStepScheme(
        d3ScaleChromatic[this.state.scheme.name],
        steps,
        [start, end]
      );
      this.setState({ scheme: colorSchemes[idx] });
    } else {
      alert("Values must be between 0 and 1.");
      return;
    }
  }

  componentDidMount() {
    // once the component mounts, listen for and handle window sizes
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  resize() {
    let width = parseInt(window.innerWidth, 10),
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

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
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
            return <MenuBlock color={color} key={uuidv4()} />;
          })}
        </div>
        <div className="Menu-lower">
          <button
            onClick={this.handleSchemeChange}
            className="button change"
            id="button decrement"
          >
            <FontAwesomeIcon
              icon={"arrow-left"}
              style={{ pointerEvents: "none" }}
            />
          </button>
          <div className="Menu-select">
            <select onChange={this.handleSelectChange} id="Menu-select">
              {colorSchemes.map(scheme => {
                return (
                  <option value={scheme.name} key={scheme.name}>
                    {scheme.name}
                  </option>
                );
              })}
            </select>
          </div>
          <button
            onClick={this.handleSchemeChange}
            className="button change"
            id="button increment"
          >
            <FontAwesomeIcon
              icon={"arrow-right"}
              style={{ pointerEvents: "none" }}
            />
          </button>
          {this.state.scheme.type === "interpolated" && (
            <div>
              <button
                onClick={e => {
                  e.target.value = "X";
                  this.setState(() => {
                    return { editMenuActive: !this.state.editMenuActive };
                  });
                }}
              >
                Edit
              </button>
            </div>
          )}
          {this.state.editMenuActive && (
            <EditSplice handler={this.handleSpliceChange} />
          )}
        </div>
      </div>
    );
  }
}

export default Menu;

const EditSplice = props => {
  return (
    <div>
      <div style={{ paddingTop: "1rem" }}>
        Edit the splice and steps of this interpolation:{" "}
      </div>
      <div className="Menu-lower-splice">
        <div className="Menu-lower-splice inputs">
          <p>
            <label htmlFor="splice-1">Splice Start: </label>
            <input
              type="number"
              id="splice-1"
              name="splice-1"
              step="0.1"
              placeholder="0.0"
              min="0"
              max="1"
            />{" "}
          </p>
          <label htmlFor="splice-2">Splice End: </label>
          <input
            type="number"
            id="splice-2"
            name="splice-2"
            step="0.1"
            placeholder="1.0"
            min="0"
            max="1"
          />{" "}
          <p>
            <label htmlFor="splice-steps">Steps: </label>
            <input
              type="number"
              id="splice-steps"
              name="splice-steps"
              step="1"
              placeholder="10"
              min="1"
              max="9999"
            />
          </p>
        </div>
        <div className="Menu-lower-splice button">
          <button className="button splice" onClick={props.handler}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
