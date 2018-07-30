import React, { Component } from "react";
import "./App.css";
import Menu from "./components/Menu/Menu";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

library.add(fab, faArrowLeft, faArrowRight);

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1 className="App-upper">
          Colored Block Menu Using{" "}
          <a
            href="https://github.com/d3/d3-scale-chromatic"
            target="_blank"
            rel="noopener noreferrer"
          >
            d3-scale-chromatic <FontAwesomeIcon icon={["fab", "github"]} />
          </a>
        </h1>
        <Menu />
        <h5 className="App-lower">
          <a href="https://github.com/ConnorCIngram/color-block-menu-react-d3-scale-chromatic">
            <FontAwesomeIcon icon={["fab", "github"]} />
          </a>
        </h5>
      </div>
    );
  }
}

export default App;
