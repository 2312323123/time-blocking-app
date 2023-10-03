import React, { useEffect, useState } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { _retrieveTaskList, _getCurrentTaskInfo } from "./misc/dbAPI";
import { RunningTask } from "./views/RunningTask";
import { TaskList } from "./views/TaskList";
import { TaskCreate } from "./views/TaskCreate";
import { TaskEdit } from "./views/TaskEdit";
import { DbContext } from "./misc/dbAPIContext";
import { MyAppProvider } from "./misc/MyAppProvider";

const Stack = createNativeStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "gray",
  },
};

export default function App() {
  const [isRunning, setIsRunning] = useState(false);

  // dbState stuff
  const [dbState, setDbState] = useState();

  const updateDbState = async () => {
    const tasks = await _retrieveTaskList();
    // console.log("tasks: ", tasks);
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
    <MyAppProvider>
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
    </MyAppProvider>
  );
}
