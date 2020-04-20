import axios from "axios";

//when we have a token we will send it to ecery request insted picking and chooseing what request to send it
const setAuthToken = token => {
  //from localStorage
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
