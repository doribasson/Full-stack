import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

//if we click logout so will not see the dashboard
//component what we pass here from route
//..rest = get any other parameter that it past in
//auth = for check if authenticate // we dont want all the objcet of auth just isAuthenticated andloading so we do auth:{isAuthenticated, loading}

//if we are not Authenticated and loading so we go to Login page, else we go to component that come in prop..like dashboard
const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      !isAuthenticated && !loading ? (
        <Redirect to="/login" />
      ) : (
        <Component {...props} />
      )
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth //take this from auth reducer for using it here
});

export default connect(mapStateToProps)(PrivateRoute);
