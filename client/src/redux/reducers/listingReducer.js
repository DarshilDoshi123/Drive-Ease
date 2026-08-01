const initialState = {
  myListings: [],
  adminListings: [],
};

export const listingReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "GET_MY_CAR_LISTINGS":
      return {
        ...state,
        myListings: Array.isArray(action.payload)
          ? action.payload
          : [],
      };

    case "GET_ADMIN_CAR_LISTINGS":
      return {
        ...state,
        adminListings: Array.isArray(action.payload)
          ? action.payload
          : [],
      };

    default:
      return state;
  }
};