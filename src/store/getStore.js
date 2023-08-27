import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import { calendarInitialState } from "./calendar";
import { profileInitialState } from "./profile";

// const dayMap = new Map([0, []]);
// const monthMap = new Map([0, dayMap]);
// const yearMap = new Map([0, monthMap]);

const initialState = {
  calendar: calendarInitialState,
  profile: profileInitialState,
};

const enhancers = [];
const middleware = [thunk];

if (process.env.NODE_ENV === "development") {
  const devToolsExtension = window.devToolsExtension;

  if (typeof devToolsExtension === "function") {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

export default function getStore(reducer) {
  const store = createStore(reducer, initialState, composedEnhancers);
  return store;
}
