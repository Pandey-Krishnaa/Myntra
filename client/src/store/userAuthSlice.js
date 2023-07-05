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
        err: null,
      };
    },
    setAuth(state, action) {
      return { ...state, isAuthenticated: action.payload.isAuthenticated };
    },
    setError(state, action) {
      return { ...state, err: action.payload.err };
    },
  },
});

export const { setStatus, setUser, setAuth, removeUser, setToken, setError } =
  userAuthSlice.actions;
export default userAuthSlice.reducer;

export function loginThunk(email, password) {
  return async function (dispatch) {
    dispatch(setStatus({ status: "LOADING" }));
    const toastId = toast.loading("LOGGING IN...");
    try {
      const jsonData = await fetch(
        `${process.env.REACT_APP_ROOT_USER_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
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
      const jsonData = await fetch(
        `${process.env.REACT_APP_ROOT_USER_URL}/me`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );
      if (!jsonData.ok) throw new Error("something went wrong");
      const data = await jsonData.json();
      dispatch(setAuth({ isAuthenticated: true }));
      dispatch(setUser({ user: data.user }));
      dispatch(setToken({ token }));
    } catch (err) {
      console.log(err.message);
      // dispatch(removeUser());
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
      console.log(`${process.env.REACT_APP_ROOT_USER_URL}/signup`);
      const res = await fetch(`${process.env.REACT_APP_ROOT_USER_URL}/signup`, {
        method: "post",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      localStorage.setItem("token", data.token);
      dispatch(setUser({ user: data.user }));
      dispatch(setAuth({ isAuthenticated: true }));
      dispatch(setToken({ token: data.token }));
    } catch (err) {
      toast.error(err.message);
    }
    dispatch(setStatus({ status: "IDLE" }));
    toast.dismiss(id);
  };
}

export const emailVerificationThunk = (otp, userId) => {
  return async function (dispatch) {
    dispatch(setStatus({ status: "LOADING" }));
    const toastId = toast.loading("verifying your otp");
    try {
      const res = await fetch(
        `${process.env.REACT_APP_ROOT_USER_URL}/verification/${userId}`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      dispatch(setUser({ user: data.user }));
      toast.dismiss(toastId);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message);
      setError({ err });
    }
    dispatch(setStatus({ status: "IDLE" }));
  };
};

export const sendOtpEmailHandler = (email, purpose, lockEmailHandler) => {
  // purpose = either {resetPassword} or {emailVerification}
  return async function (dispatch) {
    let toastId = toast.loading("sending email....");
    dispatch(setStatus({ status: "LOADING" }));
    try {
      const res = await fetch(
        `${process.env.REACT_APP_ROOT_USER_URL}/forget-password`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ email, subject: purpose }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      lockEmailHandler(true);
      toast.dismiss(toastId);
      toast.success(data.message);
    } catch (err) {
      lockEmailHandler(false);
      toast.dismiss(toastId);
      toast.error(err.message);
      setError({ err });
    }

    dispatch(setStatus({ status: "IDLE" }));
  };
};

export const resetPasswordThunk = (info, email, navigateToLoginPageHandler) => {
  return async function (dispatch) {
    dispatch(setStatus({ status: "LOADING" }));
    const toastId = toast.loading("settingup your new password...");

    try {
      const res = await fetch(
        `${process.env.REACT_APP_ROOT_USER_URL}/reset-password/${email}`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(info),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.dismiss(toastId);
      toast.success(data.message);
      navigateToLoginPageHandler();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message);
    }
    dispatch(setStatus({ status: "IDLE" }));
  };
};

export function changeProfieThunk(formData) {
  return async function (dispatch) {
    dispatch(setStatus({ status: "LOADING" }));
    const toastId = toast.loading("Updating Profile..");
    try {
      const res = await fetch(
        `${process.env.REACT_APP_ROOT_USER_URL}/change-avatar`,
        {
          method: "post",
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
          body: formData,
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      dispatch(setUser({ user: data.user }));
      toast.dismiss(toastId);
      toast.success("profile updated");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message);
    }
    dispatch(setStatus({ status: "IDLE" }));
  };
}

export function updateProfileInfo(info) {
  return async function (dispatch) {
    const toastId = toast.loading("Updating your info ..");
    console.log(info);
    dispatch(setStatus({ status: "LOADING" }));
    try {
      const res = await fetch(`${process.env.REACT_APP_ROOT_USER_URL}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(info),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      dispatch(setUser({ user: data.user }));
      toast.dismiss(toastId);
      toast.success("information updated");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message);
    }
    dispatch(setStatus({ status: "IDLE" }));
  };
}

export const changePasswordThunk = (info, clearFeilds) => {
  return async function (dispatch) {
    dispatch(setStatus({ status: "LOADING" }));
    const toastId = toast.loading("changing password...");
    try {
      const res = await fetch(
        `${process.env.REACT_APP_ROOT_USER_URL}/change-password`,
        {
          method: "post",
          headers: {
            "x-auth-token": localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(info),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      toast.dismiss(toastId);
      toast.success("password changed...");
      clearFeilds();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message);
      clearFeilds();
    }
    dispatch(setStatus({ status: "IDLE" }));
  };
};
