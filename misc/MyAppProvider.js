import React, { createContext, useContext } from "react";
import { useAppStateEffect } from "./useAppStateEffect";
import { useMyAppProviderMethods } from "./useMyAppProviderMethods";

const MyAppContext = createContext(null);

export const MyAppProvider = ({ children }) => {
  const {
    MyAppState,
    dispatch,
    _runTask,
    _taskFinished,
    _runNextTask,
    _nextTaskObsolete,
    checkIfNewDayAndPrepareEverythingAccordingly,
    createTask,
    updateTask,
    deleteTask,
  } = useMyAppProviderMethods();

  // after turning on, etc.
  const checkAliveAndInCaseNotDoNecessaryStuff = async () => {
    if (!MyAppState.alive) {
      // all the stuff needed to recover context using database goes here
      console.log("ded, reviving...");

      await checkIfNewDayAndPrepareEverythingAccordingly();
    }
  };
  useAppStateEffect(checkAliveAndInCaseNotDoNecessaryStuff, MyAppState.alive);

  // newer, callback to know whether update finished in the next main loop cycle
  const runTask = async (callback, index, finishCurrentTask) => {
    await _runTask(index, finishCurrentTask);
    if (callback) {
      callback();
    }
  };

  const taskFinished = async (callback, index) => {
    await _taskFinished(index);
    if (callback) {
      callback();
    }
  };

  const runNextTask = async (callback) => {
    await _runNextTask(index);
    if (callback) {
      callback();
    }
  };

  const nextTaskObsolete = async (callback) => {
    await _nextTaskObsolete();
    if (callback) {
      callback();
    }
  };

  return (
    <MyAppContext.Provider
      value={{
        MyAppState,
        dispatch,
        runTask, // new refactor
        taskFinished, // new refactor
        runNextTask, // new refactor
        nextTaskObsolete, // new refactor
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </MyAppContext.Provider>
  );
};

export const useMyAppState = () => useContext(MyAppContext);
