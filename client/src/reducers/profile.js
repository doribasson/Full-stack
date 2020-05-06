import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  ACCOUNT_DELETED
} from "../actions/types";

const initialState = {
  profile: null, //when we login it will make request and get all profile date and put here also if we visit anther user profile page he will put there well... both set data get put there because there are indvidual profile
  profiles: [], // for profile listing page list of developer
  repos: [], //because we fetch the github repos we need for those
  loading: true, //once we make a request will send it to false
  error: {} //for any error of request
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
        // profile: null
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false
      };
    case ACCOUNT_DELETED:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false
      };

    case GET_REPOS:
      return {
        ...state,
        repos: payload,
        loading: false
      };
    default:
      return state;
  }
}
