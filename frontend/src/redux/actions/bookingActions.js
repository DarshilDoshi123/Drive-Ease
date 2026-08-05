import { message } from "antd";
import api from "../../services/api";

// ============================================
// BOOK CAR
// ============================================

export const bookCar = (reqObj) => async (dispatch) => {
  dispatch({
    type: "LOADING",
    payload: true,
  });

  try {
    const response = await api.post(
      "/api/bookings/bookcar",
      reqObj
    );

    const booking = response.data?.data?.booking;

    message.success(
      response.data?.message ||
        "Your car was booked successfully"
    );

    if (booking?._id) {
      setTimeout(() => {
        window.location.href = `/booking-success/${booking._id}`;
      }, 700);
    } else {
      setTimeout(() => {
        window.location.href = "/userbookings";
      }, 700);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Booking error:",
      error.response?.data || error.message
    );

    message.error(
      error.response?.data?.message ||
        "Unable to complete the booking"
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
// GET BOOKINGS
// ============================================

export const getAllBookings =
  () => async (dispatch) => {
    dispatch({
      type: "LOADING",
      payload: true,
    });

    try {
      const response = await api.get(
        "/api/bookings/getallbookings"
      );

      const bookings =
        response.data?.data?.bookings || [];

      dispatch({
        type: "GET_ALL_BOOKINGS",
        payload: bookings,
      });

      return bookings;
    } catch (error) {
      console.error(
        "Bookings loading error:",
        error.response?.data || error.message
      );

      message.error(
        error.response?.data?.message ||
          "Failed to load bookings"
      );

      dispatch({
        type: "GET_ALL_BOOKINGS",
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
// CANCEL BOOKING
// ============================================

export const cancelBooking =
  (bookingId) => async (dispatch) => {
    dispatch({
      type: "LOADING",
      payload: true,
    });

    try {
      const response = await api.patch(
        `/api/bookings/${bookingId}/cancel`
      );

      message.success(
        response.data?.message ||
          "Booking cancelled successfully"
      );

      await dispatch(getAllBookings());

      return response.data;
    } catch (error) {
      console.error(
        "Cancel booking error:",
        error.response?.data || error.message
      );

      message.error(
        error.response?.data?.message ||
          "Unable to cancel booking"
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
// GET SINGLE BOOKING
// ============================================

export const getBookingById =
  (bookingId) => async (dispatch) => {
    dispatch({
      type: "LOADING",
      payload: true,
    });

    try {
      const response = await api.get(
        `/api/bookings/${bookingId}`
      );

      return response.data?.data?.booking || null;
    } catch (error) {
      console.error(
        "Booking details error:",
        error.response?.data || error.message
      );

      message.error(
        error.response?.data?.message ||
          "Unable to load booking details"
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
// GET OWNER EARNINGS
// ============================================

export const getOwnerEarnings =
  () => async (dispatch) => {
    dispatch({
      type: "LOADING",
      payload: true,
    });

    try {
      const response = await api.get(
        "/api/bookings/owner/earnings"
      );

      return (
        response.data?.data || {
          statistics: {},
          bookings: [],
        }
      );
    } catch (error) {
      console.error(
        "Owner earnings error:",
        error.response?.data ||
          error.message
      );

      message.error(
        error.response?.data?.message ||
          "Unable to load owner earnings"
      );

      return {
        statistics: {},
        bookings: [],
      };
    } finally {
      dispatch({
        type: "LOADING",
        payload: false,
      });
    }
  };

// ============================================
// GET ADMIN REVENUE
// ============================================

export const getAdminRevenue =
  () => async (dispatch) => {
    dispatch({
      type: "LOADING",
      payload: true,
    });

    try {
      const response = await api.get(
        "/api/bookings/admin/revenue"
      );

      return (
        response.data?.data || {
          statistics: {},
          bookings: [],
        }
      );
    } catch (error) {
      console.error(
        "Admin revenue error:",
        error.response?.data ||
          error.message
      );

      message.error(
        error.response?.data?.message ||
          "Unable to load revenue dashboard"
      );

      return {
        statistics: {},
        bookings: [],
      };
    } finally {
      dispatch({
        type: "LOADING",
        payload: false,
      });
    }
  };

// ============================================
// UPDATE PAYOUT STATUS
// ============================================

export const updatePayoutStatus =
  (
    bookingId,
    payoutStatus
  ) =>
  async (dispatch) => {
    dispatch({
      type: "LOADING",
      payload: true,
    });

    try {
      const response = await api.patch(
        `/api/bookings/admin/${bookingId}/payout`,
        {
          payoutStatus,
        }
      );

      message.success(
        response.data?.message ||
          "Payout status updated"
      );

      return (
        response.data?.data?.booking ||
        null
      );
    } catch (error) {
      console.error(
        "Payout update error:",
        error.response?.data ||
          error.message
      );

      message.error(
        error.response?.data?.message ||
          "Unable to update payout"
      );

      return null;
    } finally {
      dispatch({
        type: "LOADING",
        payload: false,
      });
    }
  };