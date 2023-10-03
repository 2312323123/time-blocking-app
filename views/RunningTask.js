import React, { useRef, useEffect } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import {
  _getCurrentTask,
  _getNextTask,
  _retrieveTaskList,
  _deleteCurrentTaskInfo,
  _editTask,
  _setCurrentTaskInfo,
} from "../misc/dbAPI";
import { useDb } from "../misc/dbAPIContext";
import { useFocusEffect } from "@react-navigation/native";
import CountDown from "react-native-countdown-component";
import { AppState } from "react-native";
import { useMyAppState } from "../misc/MyAppProvider";

export const RunningTask = ({ navigation }) => {
  const { MyAppState, dispatch } = useMyAppState();
  // const { MyAppState, dispatch, updateDbState, updateCurrentTask } =
  //   useMyAppState();
  // const {
  //   isRunning,
  //   dbState,
  //   currentTaskIndex,
  //   currentTaskStart,
  //   currentTaskEnd,
  // } = MyAppState;
  const { testVariable } = MyAppState;
  const [focusVisible, setFocusVisible] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      // console.log("RunningTask screen focused"); // This will run when the screen gains focus (navigated to)
      setFocusVisible(true);
      return () => {
        // console.log("RunningTask screen unfocused"); // This will run when the screen loses focus (navigated away from)
        setFocusVisible(false);
      };
    }, [])
  );

  const {
    dbState,
    currentTaskIndex,
    currentTaskStart,
    currentTaskEnd,
    updateCurrentTask,
    updateDbState,
    isRunning,
    setIsRunning,
  } = useDb();

  let intervalRef = React.useRef(null);

  const [debug, setDebug] = React.useState("debug");

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      // if (
      //   appState.current.match(/inactive|background/) &&
      //   nextAppState === "active"
      // ) {
      //   console.log("App has come to the foreground!");
      // }

      appState.current = nextAppState;
      // console.log("AppState", appState.current);

      if (appState.current === "active") {
        // timer initialization stuff goes here
        (async () => {
          await mainLoop();
          await mainLoop(); // hoped 2nd one would speed up start of timer
        })();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const mainLoop = async () => {
    console.log("hi");
    // convenient in here, but could be called once before setInterval
    let currentTask;
    if (typeof currentTaskIndex !== "undefined" && currentTaskIndex !== null) {
      currentTask = dbState[currentTaskIndex];
    }
    // =====================

    if (
      typeof currentTaskIndex !== "undefined" &&
      currentTaskIndex !== null &&
      new Date() >= currentTaskStart &&
      new Date() < currentTaskEnd
    ) {
      console.log("1111111111111111");
      const now = new Date();
      const timeLeft = parseInt((currentTaskEnd - now) / 1000);
      // console.log("NNNNNNNNNNNNNNNNNNNNNNNNNNNNN");
      // console.log(currentTaskEnd);
      // console.log(now);

      setState({ ...state, timeLeft: timeLeft });
    } else if (
      typeof currentTaskEnd !== "undefined" &&
      currentTaskEnd !== null &&
      new Date() >= currentTaskEnd
    ) {
      console.log("2222222222222222");
      await _editTask(
        currentTaskIndex,
        currentTask.name,
        currentTask.time_hours,
        currentTask.time_minutes,
        currentTask.duration,
        true
      );
      await _deleteCurrentTaskInfo();
      await updateCurrentTask();
      await updateDbState();
      // TODO: check if it works: make sure isRunning is set to true
      setState({
        ...state,
        timeLeft: undefined,
      });
      if (isRunning) {
        setIsRunning(false);
      }
    } else if (new Date() < currentTaskStart) {
      console.log("333333333333333333");
      // in this case we just want the next task (not running) screen to be displayed
      // TODO: make sure isRunning is set to false
      if (isRunning) {
        setIsRunning(false);
      }
    } else if (
      typeof currentTaskIndex === "undefined" ||
      currentTaskIndex === null
    ) {
      console.log("4444444444444444444");
      // console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
      // set next task or no tasks left screen
      let nextCurrentTask = await _getCurrentTask();
      if (!nextCurrentTask) {
        nextCurrentTask = await _getNextTask();
      }
      if (typeof nextCurrentTask !== "undefined" && nextCurrentTask !== null) {
        const end_time = new Date();
        end_time.setHours(
          nextCurrentTask.time_hours,
          nextCurrentTask.time_minutes,
          0,
          0
        );
        end_time.setMinutes(end_time.getMinutes() + nextCurrentTask.duration);

        console.log(
          "ZZZZZZZZZZZZZZZZZZZZZZZZZZ typeof nextCurrentTask: ",
          typeof nextCurrentTask
        );

        await _setCurrentTaskInfo(
          nextCurrentTask.index,
          nextCurrentTask.time_hours,
          nextCurrentTask.time_minutes,
          end_time.getHours(),
          end_time.getMinutes()
        );

        await updateCurrentTask();
      } else {
        console.log("CCCCCCCCCCCCCCCCCCCCCCCCCC");
        setState({ ...state, noTasksLeft: true });
      }
    } else {
      console.log("5555555555555555555");
      throw (
        "something went wrong in the timer loop\ntypeof currentTaskIndex: " +
        typeof currentTaskIndex +
        "\ncurrentTaskIndex: " +
        currentTaskIndex +
        "\ncurrentTaskStart: " +
        currentTaskStart
      );
    }
  };

  React.useEffect(() => {
    async function DoAsyncStuff() {
      // console.log(dbState[currentTaskIndex]);
      // console.log(currentTaskStart);
      // console.log("VVVVVVVVVVVVVVVVVVVVVVVV");

      intervalRef.current = setInterval(mainLoop, 1000);

      // // ==================== old code ====================
      // const currentTask = await _getCurrentTask();
      // setDebug(JSON.stringify(currentTask));
      // if (currentTask) {
      //   // start doing it
      //   const now = new Date();
      //   const taskEnd = new Date();
      //   taskEnd.setHours(
      //     currentTask.time_hours,
      //     currentTask.time_minutes,
      //     0,
      //     0
      //   );
      //   taskEnd.setMinutes(taskEnd.getMinutes() + currentTask.duration);
      //   setDebug(parseInt((taskEnd - now) / 1000));
      //   const startingTimeLeft = parseInt((taskEnd - now) / 1000);
      //   setState({ timeLeft: startingTimeLeft });
      //   intervalRef.current = setInterval(() => {
      //     setState((oldState) => {
      //       const newTimeLeft = oldState.timeLeft - 1;
      //       if (newTimeLeft <= 0) {
      //         clearInterval(intervalRef.current);
      //       }
      //       console.log(
      //         typeof oldState.timeLeft,
      //         " ",
      //         oldState.timeLeft,
      //         " ",
      //         newTimeLeft
      //       );
      //       console.log("time left: ", newTimeLeft);
      //       return { timeLeft: newTimeLeft };
      //     });
      //   }, 1000);
      // } else {
      //   const currentTask = await _getNextTask();
      //   if (currentTask) {
      //     // allow to be doing it
      //   } else {
      //     // no tasks left
      //   }
      // }
      // console.log(currentTask);
    }
    console.log("Running task useEffect");
    DoAsyncStuff();

    return () => {
      console.log("clearing Running task useEffect interval");
      clearInterval(intervalRef.current);
    };
  }, [setState, dbState, currentTaskIndex, currentTaskStart, currentTaskEnd]);

  // React.useEffect(() => {
  //   const time = 10;

  //   setState({ timeLeft: time });

  //   intervalRef.current = setInterval(() => {
  //     setState((state) => {
  //       const newTimeLeft = state.timeLeft - 1;

  //       if (newTimeLeft <= 0) {
  //         clearInterval(intervalRef.current);
  //       }

  //       return { timeLeft: newTimeLeft };
  //     });
  //   }, 1000);

  //   console.log("useEffect");

  //   return () => clearInterval(intervalRef.current);
  // }, [setState]);

  const [state, setState] = React.useState({
    timeLeft: 0,
    noTasksLeft: false,
  });
  // tasks.push({ name, time_hours, time_minutes, duration, done });

  return (
    <View style={styles.container}>
      <View>
        {/* <Text style={{ fontSize: 24 }}>{testVariable}</Text> */}
        <CountDown
          until={state.timeLeft}
          onFinish={() => alert("finished")}
          onPress={() => alert("hello")}
          size={40}
          running={false}
          timeToShow={state.timeLeft > 3600 ? ["H", "M", "S"] : ["M", "S"]}
        />
        {/* <Text style={{ fontSize: 24 }}>
          {!state.noTasksLeft ? "lol" : dbState[currentTaskIndex].name}
        </Text> */}
        <Text>
          timeLeft: {typeof state.timeLeft} {JSON.stringify(state.timeLeft)}
        </Text>
        <Text> Debug text: {debug}</Text>
        <Button
          title="Stop intervalRef.current"
          onPress={() => clearInterval(intervalRef.current)}
        />
        <Button
          title="Task List"
          onPress={() => navigation.navigate("Task List", { name: "Jane" })}
        />
        <Button title="console log" onPress={() => console.log("hello")} />
        <Text>noTasksLeft: {state.noTasksLeft.toString()}</Text>
        <Text>isRunning: {isRunning.toString()}</Text>
        <Text>{new Date().toString()}</Text>
      </View>

      <TouchableOpacity
        style={styles.taskListButton}
        onPress={() => navigation.navigate("Task List", { name: "Jane" })}
      >
        <Text style={styles.buttonText}>Task List</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    flexDirection: "column",
    justifyContent: "space-between",
    margin: 0,
    padding: 0,
  },
  taskListButton: {
    backgroundColor: "#1a73e8",
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
