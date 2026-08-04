import {
  LOGIN,
  LOGOUT
} from "./types";

export const login = uid => (dispatch) => {
  dispatch({
    type: LOGIN,
    payload: uid,
  });
};

export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT
  });
};