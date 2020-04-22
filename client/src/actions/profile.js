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
