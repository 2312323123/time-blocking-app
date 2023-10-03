import React, { createContext, useContext, useReducer } from "react";
import { useAppStateEffect } from "./useAppStateEffect";
import { initialState, reducer } from "./reducer";
import { _updateDbState, _updateCurrentTask } from "./reducerAsyncFunctions";

const MyAppContext = createContext(null);

export const MyAppProvider = ({ children }) => {
  const [MyAppState, dispatch] = useReducer(reducer, initialState);

  const checkAliveAndInCaseNotDoNecessaryStuff = () => {
    if (!MyAppState.alive) {
      // all the stuff needed to recover context using database goes here
      console.log("ded, reviving...");

      // necessary at the end
      dispatch({ type: "UPDATE_ALIVE" });
    }
  };

  useAppStateEffect(checkAliveAndInCaseNotDoNecessaryStuff, MyAppState.alive);

  const updateDbState = () => {
    _updateDbState(dispatch);
  };

  const updateCurrentTask = () => {
    _updateCurrentTask(dispatch);
  };

  return (
    <MyAppContext.Provider
      value={{ MyAppState, dispatch, updateDbState, updateCurrentTask }}
    >
      {children}
    </MyAppContext.Provider>
  );
};

export const useMyAppState = () => useContext(MyAppContext);
