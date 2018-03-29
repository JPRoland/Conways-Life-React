import React, { Component } from "react";
import LifeCanvas from "./LifeCanvas";
import "./App.css";

class App extends Component {
  /**
   * Render
   */
  render() {
    return (
      <div className="App">
        <h1 className="App-header">The Game of Life</h1>
        <LifeCanvas width={100} height={100} />
      </div>
    );
  }
}

export default App;
