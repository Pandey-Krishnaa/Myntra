import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const userAuthSlice = createSlice({
  name: "userAuthSlice",
  initialState: {
    isAuthenticated: false,
    user: null,
    status: false,
    token: null,
  },
  reducers: {
    setStatus(state, action) {
      return { ...state, status: action.payload.status };
    },
    setUser(state, action) {
      return { ...state, user: action.payload.user };
    },
    setToken(state, action) {
      localStorage.setItem("token", action.payload.token);
      return { ...state, token: action.payload.token };
    },
    removeUser() {
      localStorage.removeItem("token");
      return {
        isAuthenticated: false,
        user: null,
        status: "IDLE",
        token: null,
      };
    },
    setAuth(state, action) {
      return { ...state, isAuthenticated: action.payload.isAuthenticated };
    },
  },
});

export const { setStatus, setUser, setAuth, removeUser, setToken } =
  userAuthSlice.actions;
export default userAuthSlice.reducer;
export function loginThunk(email, password) {
  return async function (dispatch, getState) {
    dispatch(setStatus({ status: "LOADING" }));
    const toastId = toast.loading("LOGGING IN...");
    try {
      const jsonData = await fetch(process.env.REACT_APP_LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await jsonData.json();

      if (!jsonData.ok) throw new Error(data.message);

      dispatch(setStatus({ status: "IDLE" }));
      dispatch(setUser({ user: data.user }));
      dispatch(setAuth({ isAuthenticated: true }));
      dispatch(setToken({ token: data.token }));
      toast.success(`Welcome ${data.user.name}`);
    } catch (err) {
      toast.error(err.message);
      dispatch(setStatus({ status: "ERROR" }));
      dispatch(removeUser());
    }
    toast.dismiss(toastId);
    dispatch(setStatus({ status: "IDLE" }));
  };
}

export function getUserByTokenThunk() {
  return async function (dispatch) {
    dispatch(setStatus({ status: "LOADING" }));
    try {
      const token = localStorage.getItem("token");
      const jsonData = await fetch(process.env.REACT_APP_ME_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      if (!jsonData.ok) throw new Error("something went wrong");
      const data = await jsonData.json();
      dispatch(setAuth({ isAuthenticated: true }));
      dispatch(setUser({ user: data.user }));
    } catch (err) {
      dispatch(removeUser());
    }
    dispatch(setStatus({ status: "IDLE" }));
  };
}

export function signupThunk(user) {
  const form = new FormData();
  form.append("name", user.name);
  form.append("password", user.password);
  form.append("email", user.email);
  form.append("avatar", user.avatar);
  return async function (dispatch) {
    dispatch(setStatus({ status: "LOADING" }));
    const id = toast.loading("Signing In");
    try {
      const res = await fetch(process.env.REACT_APP_SIGNUP_URL, {
        method: "post",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      localStorage.setItem("token", data.token);
      dispatch(getUserByTokenThunk());
    } catch (err) {
      toast.error(err.message);
    }
    dispatch(setStatus({ status: "IDLE" }));
    toast.dismiss(id);
  };
}
