import React, { useRef, useEffect } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import CountDown from "react-native-countdown-component";
import { useMyAppState } from "../misc/MyAppProvider";

export const RunningTask = ({ navigation }) => {
  const {
    MyAppState,
    dispatch,
    runTask,
    taskFinished,
    runNextTask,
    nextTaskObsolete,
    createTask,
    updateTask,
    deleteTask,
  } = useMyAppState();
  const {
    taskList,
    noTasksLeftForToday,
    isRunning,
    currentTaskIndex,
    currentTaskStart,
    currentTaskEnd,
  } = MyAppState;

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

  let intervalRef = React.useRef(null);

  const mainLoop = async () => {
    // convenient in here, but could be called once before setInterval
    let currentTask;
    if (typeof currentTaskIndex !== "undefined" && currentTaskIndex !== null) {
      // currentTask = dbState[currentTaskIndex];
    }

    if (
      typeof currentTaskIndex !== "undefined" &&
      currentTaskIndex !== null &&
      new Date() >= currentTaskStart &&
      new Date() < currentTaskEnd
    ) {
      const now = new Date();
      const timeLeft = (currentTaskEnd.getTime() - now.getTime()) / 1000;

      setState({ ...state, timeLeft: timeLeft });
    } else if (
      typeof currentTaskEnd !== "undefined" &&
      currentTaskEnd !== null &&
      new Date() >= currentTaskEnd
    ) {
      // await _editTask(
      //   currentTaskIndex,
      //   currentTask.name,
      //   currentTask.time_hours,
      //   currentTask.time_minutes,
      //   currentTask.duration,
      //   true
      // );
      // await _deleteCurrentTaskInfo();
      // TODO: check if it works: make sure isRunning is set to true
      setState({
        ...state,
        timeLeft: undefined,
      });
      if (isRunning) {
        dispatch({ type: "SET_IS_RUNNING", payload: false });
      }
    } else if (new Date() < currentTaskStart) {
      // in this case we just want the next task (not running) screen to be displayed
      // TODO: make sure isRunning is set to false
      if (isRunning) {
        dispatch({ type: "SET_IS_RUNNING", payload: false });
      }
    } else if (
      typeof currentTaskIndex === "undefined" ||
      currentTaskIndex === null
    ) {
      // let nextCurrentTask = await _getCurrentTask();
      if (!nextCurrentTask) {
        // nextCurrentTask = await _getNextTask();
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

        // await _setCurrentTaskInfo(
        //   nextCurrentTask.index,
        //   nextCurrentTask.time_hours,
        //   nextCurrentTask.time_minutes,
        //   end_time.getHours(),
        //   end_time.getMinutes()
        // );
      } else {
        setState({ ...state, noTasksLeft: true });
      }
    } else {
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

  const [state, setState] = React.useState({
    timeLeft: 0,
    noTasksLeft: false,
  });

  React.useEffect(() => {
    async function DoAsyncStuff() {
      // intervalRef.current = setInterval(mainLoop, 1000);
    }
    console.log("Running task useEffect");
    DoAsyncStuff();

    return () => {
      console.log("clearing Running task useEffect interval");
      clearInterval(intervalRef.current);
    };
  }, [
    setState,
    // dbState,
    currentTaskIndex,
    currentTaskStart,
    currentTaskEnd,
    taskList,
  ]);

  return (
    <View style={styles.container}>
      <View>
        <CountDown
          until={state.timeLeft}
          onFinish={() => alert("finished")}
          onPress={() => alert("hello")}
          size={40}
          running={false}
          timeToShow={state.timeLeft > 3600 ? ["H", "M", "S"] : ["M", "S"]}
        />
        <Text>timeLeft: {JSON.stringify(state.timeLeft)}</Text>
        <Text>noTasksLeft: {state.noTasksLeft.toString()}</Text>
        <Text>isRunning: {isRunning.toString()}</Text>
      </View>

      <Button title="console log" onPress={() => console.log("hello")} />
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
