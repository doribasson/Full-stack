import { GET_POSTS, POST_ERROR } from "../actions/types";

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload, //come from actions post.js file
        loading: false
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload, //come from actions posts.js file
        loading: false
      };
    default:
      return state;
  }
}
