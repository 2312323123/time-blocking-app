import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  _isDaySet,
  _setDay,
  _getDay,
  _deleteDay,
  _deleteTask,
  _editTask,
  _createTask,
  _retrieveTaskList,
  _deleteTaskList,
  _getCurrentTaskIndex,
  _getCurrentTaskInfo,
  _deleteCurrentTaskInfo,
  _newDayStarted,
} from "./misc/dbAPI";
import { RunningTask } from "./views/RunningTask";
import { TaskList } from "./views/TaskList";
import { TaskCreate } from "./views/TaskCreate";
import { TaskEdit } from "./views/TaskEdit";
import { AppState } from "react-native";
import { DbContext } from "./misc/dbAPIContext";

const Stack = createNativeStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "gray",
  },
};

export default function App() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      // if (
      //   appState.current.match(/inactive|background/) &&
      //   nextAppState === "active"
      // ) {
      //   console.log("App has come to the foreground!");
      // }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      // console.log("AppState", appState.current);

      if (appState.current === "active") {
        // daily reset stuff goes here
        (async () => {
          const isDaySet = await _isDaySet();
          if (!isDaySet) {
            const day = _getDay();
            if (day !== new Date().getDate()) {
              await _setDay(new Date().getDate()); // 1-31
              await _deleteCurrentTaskInfo();
              await _newDayStarted();
            }
          }
        })();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // // TODO: delete later
  // useEffect(() => {
  //   async function Test() {
  //     console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL");
  //     // await _deleteTaskList();
  //     // await _deleteDay();

  //     const isDaySet = await _isDaySet();
  //     if (!isDaySet) {
  //       await _createTask("task1", 1, 30, 30, false);
  //       await _createTask("task2", 2, 30, 30);
  //       await _createTask("task3", 3, 30, 30);
  //       await _editTask("task1", "task1", 4, 30, 30);
  //       await _deleteTask("task2");
  //       await _createTask("task5", 10, 0, 22, false);
  //       await _setDay(new Date().getDate()); // 1-31
  //     }
  //     const tasks = await _retrieveTaskList();
  //     console.log(tasks);

  //     // await _deleteTaskList();
  //     // await _deleteDay();
  //     console.log("isDaySet afterwards: ", isDaySet);
  //   }
  //   Test();
  // }, []);
  // // end TODO

  const [isRunning, setIsRunning] = useState(false);

  // dbState stuff
  const [dbState, setDbState] = useState();

  const updateDbState = async () => {
    const tasks = await _retrieveTaskList();
    console.log("tasks: ", tasks);
    setDbState(tasks);
  };

  // currentTaskIndex stuff
  const [currentTaskIndex, setCurrentTaskIndex] = useState();
  const [currentTaskStart, setCurrentTaskStart] = useState();
  const [currentTaskEnd, setCurrentTaskEnd] = useState();

  const updateCurrentTask = async () => {
    const currentTaskInfo = await _getCurrentTaskInfo();

    let index, start_hours, start_minutes, end_hours, end_minutes;

    if (typeof currentTaskInfo !== "undefined" && currentTaskInfo !== null) {
      ({ index, start_hours, start_minutes, end_hours, end_minutes } =
        currentTaskInfo);
    }

    if (typeof index !== "undefined" && index !== null) {
      setCurrentTaskIndex(index);

      const start = new Date();
      start.setHours(start_hours);
      start.setMinutes(start_minutes);
      setCurrentTaskStart(start);

      const end = new Date();
      end.setHours(end_hours, end_minutes, 0, 0);
      setCurrentTaskEnd(end);
    } else {
      setCurrentTaskIndex(undefined);
      setCurrentTaskStart(undefined);
      setCurrentTaskEnd(undefined);
    }
  };

  // dbState and currentTaskIndex initialization stuff
  useEffect(() => {
    const DoAsyncStuff = async () => {
      await updateDbState();
      await updateCurrentTask();
    };
    DoAsyncStuff();
  }, []);

  return (
    <DbContext.Provider
      value={{
        dbState,
        updateDbState,
        currentTaskIndex,
        updateCurrentTask,
        currentTaskStart,
        currentTaskEnd,
        isRunning,
        setIsRunning,
      }}
    >
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator>
          <Stack.Group
            screenOptions={{ headerStyle: { backgroundColor: "darkgreen" } }}
          >
            <Stack.Screen
              name="Home"
              component={RunningTask}
              options={{
                title: "Current Task",
              }}
            />
            <Stack.Screen name="Task List" component={TaskList} />
            <Stack.Screen name="New Task" component={TaskCreate} />
            <Stack.Screen name="Edit Task" component={TaskEdit} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </DbContext.Provider>
  );
}
