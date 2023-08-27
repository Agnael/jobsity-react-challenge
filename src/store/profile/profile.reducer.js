import { profileActionTypes } from "./profile.actions";
import initialState from "./profile.state";

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case profileActionTypes.SET_INFERRED_CURRENT_LOCATION:
      const { currentIp, currentLocation } = action.payload;

      return {
        ...state,
        lastKnownIp: currentIp,
        inferredCurrentUserLocation: currentLocation,
      };
    case profileActionTypes.SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };
    default:
      return state;
  }
};

export default profileReducer;
