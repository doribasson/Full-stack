import {
  GET_POSTS,
  GET_POST,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  ADD_COMMENT,
  REMOVE_COMMENT
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
    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false
      };
    case ADD_POST:
      return {
        ...state,
        posts: [payload, ...state.posts], //...state.posts - copy all posts array , adding payload - add new post.. [all togther]
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
    case ADD_COMMENT:
      return {
        ...state,
        post: { ...state.post, comments: payload }, //payload = all the comments
        loading: false
      };
    case REMOVE_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          //we want all comment except that one in the payload
          comments: state.post.comments.filter(
            comment => comment._id !== payload
          )
        },
        loading: false
      };
    default:
      return state;
  }
}
