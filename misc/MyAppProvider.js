import React, { createContext, useContext, useEffect, useReducer } from "react";
import { useAppStateEffect } from "./useAppStateEffect";
import { initialState, reducer } from "./reducer";
import { _retrieveTaskList, _getCurrentTaskInfo } from "./dbAPI";

const MyAppContext = createContext(null);

export const MyAppProvider = ({ children }) => {
  const [MyAppState, dispatch] = useReducer(reducer, initialState);

  // from refactor:
  const updateDbState = async () => {
    const tasks = await _retrieveTaskList();
    dispatch({ type: "UPDATE_DB_STATE", payload: tasks });
  };

  const updateCurrentTask = async () => {
    const currentTaskInfo = await _getCurrentTaskInfo();
    dispatch({ type: "UPDATE_CURRENTTASK", payload: currentTaskInfo });
  };

  // from refactor + legacy
  // dbState and currentTaskIndex initialization stuff
  useEffect(() => {
    const DoAsyncStuff = async () => {
      await updateDbState();
      await updateCurrentTask();
    };
    DoAsyncStuff();
  }, []);

  // newer, callback to know whether update finished in the next main loop cycle
  const runTask = async (callback, index) => {
    if (callback) {
      callback();
    }
  };

  const taskFinished = async (callback, index) => {
    if (callback) {
      callback();
    }
  };

  const runNextTask = async (callback) => {
    if (callback) {
      callback();
    }
  };

  // after turning on, etc.
  const checkAliveAndInCaseNotDoNecessaryStuff = async () => {
    if (!MyAppState.alive) {
      // all the stuff needed to recover context using database goes here
      console.log("ded, reviving...");

      const tasks = await _retrieveTaskList();
      dispatch({ type: "UPDATE_DB_STATE", payload: tasks });

      // necessary at the end
      dispatch({ type: "UPDATE_ALIVE" });
    }
  };

  useAppStateEffect(checkAliveAndInCaseNotDoNecessaryStuff, MyAppState.alive);

  return (
    <MyAppContext.Provider
      value={{ MyAppState, dispatch, updateDbState, updateCurrentTask }}
    >
      {children}
    </MyAppContext.Provider>
  );
};

export const useMyAppState = () => useContext(MyAppContext);
