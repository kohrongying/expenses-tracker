import {
  LOGIN,
  LOGOUT
} from "../actions/types";

const INITIAL_STATE = {
  isAuthenticated: false,
  uid: "",
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case LOGIN:
    return Object.assign({}, state, {
      isAuthenticated: true,
      uid: action.payload,
    });
  case LOGOUT:
    return Object.assign({}, state, INITIAL_STATE);
  default:
    return state;
  }
};