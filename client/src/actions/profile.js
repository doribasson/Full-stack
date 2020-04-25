import axios from "axios";
import { setAlert } from "./alert";

import {
  PROFILE_ERROR,
  GET_PROFILE,
  GET_PROFILES,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  ACCOUNT_DELETED,
  GET_REPOS
} from "./types";

//Get current users profile
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get("/api/profile/me"); //no need id or anything, he will know whitch profile to load from the token we sent whitch has a user id

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      // payload: console.log(err.response)
      payload: {
        msg: err.response.statusText, //Bad Request
        status: err.response.status, //400
        msg2: err.response.data //there is no profile for this user
      }
    });
  }
};

//Get all profile
export const getProfiles = () => async dispach => {
  dispach({ type: CLEAR_PROFILE }); //prevent the flushing past users profile
  try {
    const res = await axios.get("/api/profile");

    dispach({
      type: GET_PROFILES,
      payload: res.data
    });
  } catch (err) {
    dispach({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//Get profile by ID
export const getProfileById = userId => async dispach => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);

    dispach({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispach({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//Get Github repos
export const getGithubRepos = username => async dispach => {
  try {
    const res = await axios.get(`/api/profile/github/${username}`);

    dispach({
      type: GET_REPOS,
      payload: res.data
    });
  } catch (err) {
    dispach({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//Create or update profile
//we want redirect after submitted the form and in action we use in history and not <Redirect>
//history - object has method call push that redirect us to a client side route
//edit - to know if we updateing or editing profile or create new profile,
export const createProfile = (
  formData,
  history,
  edit = false
) => async dispach => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const res = await axios.post("/api/profile", formData, config);

    dispach({
      type: GET_PROFILE,
      payload: res.data
    });

    dispach(setAlert(edit ? "Profile Updated" : "Profile Created", "success"));

    //if not edit so ceate new profile
    if (!edit) {
      history.push("/dashboard");
    }
  } catch (err) {
    //validation errors with alert
    const errors = err.response.data.errors;
    //if forget the status or skills or other that require field then that will show in an alert
    if (errors) {
      errors.forEach(error => dispach(setAlert(error.msg, "danger")));
    }

    dispach({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//Add Experience
//history - because i want to redirect back to the Dashboard afterward
export const addExperience = (formData, history) => async dispach => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json" //because we sending data
      }
    };

    const res = await axios.put("/api/profile/experience", formData, config);

    dispach({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispach(setAlert("Experience Added", "success"));

    history.push("/dashboard");
  } catch (err) {
    //validation errors with alert
    const errors = err.response.data.errors;
    //if forget require field then that will show in an alert
    if (errors) {
      errors.forEach(error => dispach(setAlert(error.msg, "danger")));
    }

    dispach({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//Add Education
//history - because i want to redirect back to the Dashboard afterward
export const addEducation = (formData, history) => async dispach => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json" //because we sending data
      }
    };

    const res = await axios.put("/api/profile/education", formData, config);

    dispach({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispach(setAlert("Education Added", "success"));

    history.push("/dashboard");
  } catch (err) {
    //validation errors with alert
    const errors = err.response.data.errors;
    //if forget require field then that will show in an alert
    if (errors) {
      errors.forEach(error => dispach(setAlert(error.msg, "danger")));
    }

    dispach({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//Delete experience
export const deleteExperience = id => async dispach => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);

    dispach({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispach(setAlert("Experience Removed", "success"));
  } catch (err) {
    dispach({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//Delete education
export const deleteEducation = id => async dispach => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);

    dispach({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispach(setAlert("Education Removed", "success"));
  } catch (err) {
    dispach({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//Delete account & profile
//will know the account to delete from the token
export const deleteAccount = () => async dispach => {
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    try {
      const res = await axios.delete("/api/profile");

      dispach({ type: CLEAR_PROFILE });
      dispach({ type: ACCOUNT_DELETED });

      dispach(setAlert("Your account has been permanatly deleted"));
    } catch (err) {
      dispach({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};
