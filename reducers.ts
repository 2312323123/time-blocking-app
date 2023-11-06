import { combineReducers } from "@reduxjs/toolkit";
import counterReducer from "./features/counterSlice";
import runningTaskSlice from "./features/runningTaskSlice";

const rootReducer = combineReducers({
  counter: counterReducer,
  runningTask: runningTaskSlice,
});

export default rootReducer;
