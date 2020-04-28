import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST
} from "../actions/types";

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
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== payload), //removed the specific post from array posts
        loading: false
      };

    case POST_ERROR:
      return {
        ...state,
        error: payload, //come from actions posts.js file
        loading: false
      };
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map(
          post =>
            //foreach post - if the post_id ===payload.id .. if equal the correct post that adding or removeing like so,  returning the post with the mnipulate(add/remove) array likes
            post._id === payload.id ? { ...post, likes: payload.likes } : post //: else just return post without changeing the likes
        ),
        loading: false
      };
    default:
      return state;
  }
}
