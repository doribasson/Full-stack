import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { email, password } = formData;

  //   const onChange = e => setFormData({ ...formData, name: e.target.value }); //here just the name can type
  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value }); //for every field

  const onSubmit = e => {
    e.preventDefault();
    login(email, password);
  };

  //Redirect if logged in //automatic take use to the page dashboard if we have token after Authenticate
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign Into Your Account
      </p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => onChange(e)}
            minLength="6"
          />
        </div>

        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Dont have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  // auth: state.auth //give use all the state object in the reducer auth.js.. token,isAuthenticated,loading,user

  isAuthenticated: state.auth.isAuthenticated ////but we need just the isAuthenticated state.. check this value if is Authenticate
});

export default connect(mapStateToProps, { login })(Login);
