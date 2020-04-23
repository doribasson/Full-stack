import axios from "axios";
import { setAlert } from "./alert";

import { PROFILE_ERROR, GET_PROFILE } from "./types";

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
