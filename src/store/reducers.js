import { combineReducers } from "redux";
import { calendarReducer } from "../store/calendar";
import { profileReducer } from "../store/profile";

const rootReducer = {
  calendar: calendarReducer,
  profile: profileReducer,
};

export default combineReducers(rootReducer);
