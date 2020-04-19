import React, { Fragment } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";

////Fragment is like a ghost element it will not show ip in the dom
const App = () => (
  <Fragment>
    <Navbar />
    <Landing />
  </Fragment>
);

export default App;
