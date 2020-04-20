import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alert from "./components/layout/Alert";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utills/setAuthToken";
//Redux
import { Provider } from "react-redux";
import store from "./store";

if (localStorage.token) {
  //set token to header with token if there is one
  setAuthToken(localStorage.token);
}

////Fragment is like a ghost element it will not show ip in the dom
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []); //[] make it run once and update just if the state update - its like componentDidupdate and not loop

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;

// //client-react
// npx create-react-app client
// npm i axios react-router-dom redux react-redux redux-thunk redux-devtools-extension moment react-moment uuid
// racf+tab  / rafce+tab --> function compoenent
