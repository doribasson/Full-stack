import React from "react";
import { Route, Switch } from "react-router-dom";
import Register from "../auth/Register";
import Login from "../auth/Login";
import Alert from "../layout/Alert";
import Dashboard from "../dashboard/Dashboard";
import CreateProfile from "../profile-forms/CreateProfile";
import EditProfile from "../profile-forms/EditProfile";
import AddExperience from "../profile-forms/AddExperience";
import AddEducation from "../profile-forms/AddEducation";
import Profiles from "../profiles/Profiles";
import Profile from "../profile/Profile";
import Posts from "../posts/Posts";
import Post from "../post/Post";
import NotFound from "../layout/NotFound";
import PrivateRoute from "../routing/PrivateRoute";

const Routes = () => {
  return (
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
        <PrivateRoute exact path="/create-profile" component={CreateProfile} />

        <PrivateRoute exact path="/edit-profile" component={EditProfile} />

        <PrivateRoute exact path="/add-experience" component={AddExperience} />

        <PrivateRoute exact path="/add-education" component={AddEducation} />

        <PrivateRoute exact path="/posts" component={Posts} />
        <PrivateRoute exact path="/posts/:id" component={Post} />
        <Route component={NotFound} />
        {/* Route - if we are not login and we type in the url http://localhost:3000/dashboard
          he will take us to dashboard and its worng because we are not log in Authenticated
          <Route exact path="/dashboard" component={Dashboard} /> */}
      </Switch>
    </section>
  );
};

export default Routes;
