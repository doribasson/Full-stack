import { SET_ALERT, REMOVE_ALERT } from "../actions/types";
const initialState = [];

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      return [...state, payload]; //return for the state an array ... state is a mutable - we have to include any other state that already there so we use [...state] spread operator... action.payload - new alert that come from action
    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== payload);
    default:
      return state;
  }
}

// export default function(state = initialState, action) {
//   switch (action.type) {
//     case SET_ALERT:
//       return [...state, action.payload]; //return for the state an array ... state is a mutable - we have to include any other state that already there so we use [...state] spread operator... action.payload - new alert that come from action
//      case REMOVE_ALERT:
//          return state.filter(alert=> alert.id !== action.payload);
//       default:
//           return state;
//   }
// }
