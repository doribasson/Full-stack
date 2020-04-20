import { SET_ALERT, REMOVE_ALERT } from "./types";
import { v4 as uuid } from "uuid";

export const setAlert = (msg, alertType, timeout = 3000) => dispatch => {
  //SetAlert calls from the component and dispatch the type SET_ALERT to reducer and its going to add the alert to the state  //dispatch is middleware thunk give use more then one action type from this function
  const id = uuid(); //give use random long string
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id }
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
