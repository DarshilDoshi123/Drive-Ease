import { message } from "antd";
import api from "../../services/api";

export const userLogin = (reqObj) => async (dispatch) => {
  dispatch({
    type: "LOADING",
    payload: true,
  });

  try {
    const response = await api.post("/api/users/login", {
      username: reqObj.username?.trim(),
      password: reqObj.password,
    });

    const { user, token } = response.data.data;

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);

    message.success(response.data.message || "Login successful");

    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);

    const errorMessage =
      error.response?.data?.message ||
      (error.response
        ? "Unable to login. Please check your credentials."
        : "Server connection failed. Render free tier backend may be waking up—please wait 20 seconds and try again.");

    message.error(errorMessage);
  } finally {
    dispatch({
      type: "LOADING",
      payload: false,
    });
  }
};

export const userRegister = (reqObj) => async (dispatch) => {
  dispatch({
    type: "LOADING",
    payload: true,
  });

  try {
    const response = await api.post("/api/users/register", {
      username: reqObj.username?.trim(),
      password: reqObj.password,
    });

    message.success(
      response.data.message ||
        "Registration successful. Please log in."
    );

    setTimeout(() => {
      window.location.href = "/login";
    }, 500);
  } catch (error) {
    console.error(
      "Registration error:",
      error.response?.data || error.message
    );

    const errorMessage =
      error.response?.data?.message ||
      (error.response
        ? "Registration failed. Please check your details."
        : "Server connection failed. Render free tier backend may be waking up—please wait 20 seconds and try again.");

    message.error(errorMessage);
  } finally {
    dispatch({
      type: "LOADING",
      payload: false,
    });
  }
};