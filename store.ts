import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";

export interface RootState {
  counter: { value: number };
}

const store = configureStore({
  reducer: rootReducer, // Pass your root reducer here
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializableCheck for non-serializable data
    }),
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in development mode
});

export default store;
