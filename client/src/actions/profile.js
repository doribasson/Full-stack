import axios from "axios";
import { setAlert } from "./alert";

import { Get_PROFILE, PROFILE_ERROR, GET_PROFILE } from "./types";

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
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
