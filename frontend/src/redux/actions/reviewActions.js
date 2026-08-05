import api from "../../services/api";

export const getCarReviews =
  (carId) => async () => {
    try {
      const response = await api.get(
        `/api/reviews/car/${carId}`
      );

      return response.data.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };