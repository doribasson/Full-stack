import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alert from "./components/layout/Alert";
import Dashboard from "./components/dashboard/Dashboard";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utills/setAuthToken";
import CreateProfile from "./components/profile-forms/CreateProfile";
import EditProfile from "./components/profile-forms/EditProfile";
import AddExperience from "./components/profile-forms/AddExperience";
import AddEducation from "./components/profile-forms/AddEducation";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import Posts from "./components/posts/Posts";
import PrivateRoute from "./components/routing/PrivateRoute";
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
              <Route exact path="/profiles" component={Profiles} />
              <Route exact path="/profile/:id" component={Profile} />
              {/* PrivateRoute-  if we are not Authenticated and not loading so we go to Login page (PrivateRoute), else we go to component that come in prop..like dashboard 
              and if we type in the url  http://localhost:3000/dashboard he will not take us to dashboard and he take use to login  */}
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              />

              <PrivateRoute
                exact
                path="/edit-profile"
                component={EditProfile}
              />

              <PrivateRoute
                exact
                path="/add-experience"
                component={AddExperience}
              />

              <PrivateRoute
                exact
                path="/add-education"
                component={AddEducation}
              />

              <PrivateRoute exact path="/posts" component={Posts} />
              {/* Route - if we are not login and we type in the url http://localhost:3000/dashboard
              he will take us to dashboard and its worng because we are not log in Authenticated
              <Route exact path="/dashboard" component={Dashboard} /> */}
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
