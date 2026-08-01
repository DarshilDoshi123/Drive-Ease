import { message } from "antd";
import api from "../../services/api";

// ============================================
// SUBMIT CAR LISTING
// ============================================

export const submitCarListing =
  (requestData) => async (dispatch) => {
    dispatch({
      type: "LOADING",
      payload: true,
    });

    try {
      const response = await api.post(
        "/api/car-listings/submit",
        requestData
      );

      message.success(
        response.data?.message ||
          "Car listing request submitted successfully"
      );

      return response.data?.data?.request || null;
    } catch (error) {
      console.error(
        "Submit listing error:",
        error.response?.data || error.message
      );

      message.error(
        error.response?.data?.message ||
          "Unable to submit your car listing"
      );

      return null;
    } finally {
      dispatch({
        type: "LOADING",
        payload: false,
      });
    }
  };

// ============================================
// GET CURRENT USER LISTINGS
// ============================================

export const getMyCarListings =
  () => async (dispatch) => {
    dispatch({
      type: "LOADING",
      payload: true,
    });

    try {
      const response = await api.get(
        "/api/car-listings/my-listings"
      );

      const requests =
        response.data?.data?.requests || [];

      dispatch({
        type: "GET_MY_CAR_LISTINGS",
        payload: requests,
      });

      return requests;
    } catch (error) {
      console.error(
        "Get listings error:",
        error.response?.data || error.message
      );

      message.error(
        error.response?.data?.message ||
          "Unable to load your car listings"
      );

      dispatch({
        type: "GET_MY_CAR_LISTINGS",
        payload: [],
      });

      return [];
    } finally {
      dispatch({
        type: "LOADING",
        payload: false,
      });
    }
  };

// ============================================
// RESUBMIT REJECTED / CHANGE-REQUESTED LISTING
// ============================================

export const resubmitCarListing =
  (requestId, requestData) => async (dispatch) => {
    dispatch({
      type: "LOADING",
      payload: true,
    });

    try {
      const response = await api.patch(
        `/api/car-listings/${requestId}/resubmit`,
        requestData
      );

      message.success(
        response.data?.message ||
          "Listing resubmitted successfully"
      );

      await dispatch(getMyCarListings());

      return response.data?.data?.request || null;
    } catch (error) {
      console.error(
        "Resubmit listing error:",
        error.response?.data || error.message
      );

      message.error(
        error.response?.data?.message ||
          "Unable to resubmit listing"
      );

      return null;
    } finally {
      dispatch({
        type: "LOADING",
        payload: false,
      });
    }
  };

// ============================================
// ADMIN: GET ALL LISTING REQUESTS
// ============================================

export const getAdminCarListings =
  (status = "all") => async (dispatch) => {
    dispatch({
      type: "LOADING",
      payload: true,
    });

    try {
      const response = await api.get(
        `/api/car-listings/admin/all?status=${status}`
      );

      const requests =
        response.data?.data?.requests || [];

      dispatch({
        type: "GET_ADMIN_CAR_LISTINGS",
        payload: requests,
      });

      return requests;
    } catch (error) {
      console.error(
        "Admin listings error:",
        error.response?.data || error.message
      );

      message.error(
        error.response?.data?.message ||
          "Unable to load listing requests"
      );

      dispatch({
        type: "GET_ADMIN_CAR_LISTINGS",
        payload: [],
      });

      return [];
    } finally {
      dispatch({
        type: "LOADING",
        payload: false,
      });
    }
  };

// ============================================
// ADMIN: APPROVE LISTING
// ============================================

export const approveCarListing =
  (requestId, reviewData) => async (dispatch) => {
    dispatch({
      type: "LOADING",
      payload: true,
    });

    try {
      const response = await api.patch(
        `/api/car-listings/admin/${requestId}/approve`,
        reviewData
      );

      message.success(
        response.data?.message ||
          "Car listing approved successfully"
      );

      await dispatch(getAdminCarListings());

      return response.data;
    } catch (error) {
      console.error(
        "Approve listing error:",
        error.response?.data || error.message
      );

      message.error(
        error.response?.data?.message ||
          "Unable to approve listing"
      );

      return null;
    } finally {
      dispatch({
        type: "LOADING",
        payload: false,
      });
    }
  };

// ============================================
// ADMIN: REJECT / REQUEST CHANGES
// ============================================

export const reviewCarListing =
  (requestId, reviewData) => async (dispatch) => {
    dispatch({
      type: "LOADING",
      payload: true,
    });

    try {
      const response = await api.patch(
        `/api/car-listings/admin/${requestId}/review`,
        reviewData
      );

      message.success(
        response.data?.message ||
          "Listing reviewed successfully"
      );

      await dispatch(getAdminCarListings());

      return response.data;
    } catch (error) {
      console.error(
        "Review listing error:",
        error.response?.data || error.message
      );

      message.error(
        error.response?.data?.message ||
          "Unable to review listing"
      );

      return null;
    } finally {
      dispatch({
        type: "LOADING",
        payload: false,
      });
    }
  };