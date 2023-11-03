import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Button,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import CountDown from "react-native-countdown-component";
import { useMyAppState } from "../misc/MyAppProvider";
import { NextTaskView } from "../components/NextTaskView";

export const NewRunningTask = ({ navigation }) => {
  const {
    MyAppState: {
      taskList,
      noTasksLeftForToday,
      isRunning,
      currentTaskIndex,
      currentTaskStart,
      currentTaskEnd,
    },
    dispatch,
    runTask,
    taskFinished,
    runNextTask,
    nextTaskObsolete,
    createTask,
    updateTask,
    deleteTask,
  } = useMyAppState();

  const timerRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(0);

  function mainLoop() {
    /*
        if noTasksLeftForToday then showscreen return

        if isRunning
          if finished then taskFinished(?, currentTaskIndex)
          else show running screen return

        if currentTaskIndex
          if eligible 
            if is now then runTask(?, currentTaskIndex, false) return
            else return
          else nextTaskObsolete(?) return

        error
      */
    if (noTasksLeftForToday) {
      console.log("noTasksLeftForToday", Math.random());
      return;
    }

    if (isRunning) {
      if (currentTaskEnd <= new Date()) {
        taskFinished(null, currentTaskIndex);
        return;
      } else {
        console.log(
          `show running screen with ${parseInt(
            (currentTaskEnd - new Date()) / 1000
          )} seconds left`,
          Math.random()
        );
        return;
      }
    }

    if (typeof currentTaskIndex === "number") {
      if (currentTaskEnd > new Date()) {
        if (currentTaskStart < new Date()) {
          runTask(null, currentTaskIndex, false);
        }
      } else {
        nextTaskObsolete(null);
      }
      return;
    }

    console.log("error");
    console.log("noTasksLeftForToday:", noTasksLeftForToday);
    console.log("isRunning:", isRunning);
    console.log("currentTaskIndex:", currentTaskIndex);
  }

  // useEffect(() => {
  //   mainLoop();

  //   timerRef.current = setInterval(() => {
  //     if (typeof currentTaskEnd !== "undefined" || currentTaskEnd !== null) {
  //       // setTimeLeft(parseInt((currentTaskEnd - new Date()) / 1000));
  //     }
  //     mainLoop();
  //   }, 240);

  //   return () => {
  //     clearInterval(timerRef.current);
  //   };
  // }, [
  //   noTasksLeftForToday,
  //   isRunning,
  //   currentTaskEnd,
  //   taskFinished,
  //   currentTaskIndex,
  //   currentTaskStart,
  //   runTask,
  //   nextTaskObsolete,
  // ]);

  useFocusEffect(() => {
    console.log("NewRunningTask focused");
    mainLoop();

    // timerRef.current = setInterval(() => {
    //   if (typeof currentTaskEnd !== "undefined" || currentTaskEnd !== null) {
    //     if (isRunning) {
    //       setTimeLeft(parseInt((currentTaskEnd - new Date()) / 1000));
    //     } else {
    //       if (!noTasksLeftForToday) {
    //         setTimeLeft(parseInt((currentTaskStart - new Date()) / 1000));
    //       }
    //     }
    //   }
    //   mainLoop();
    // }, 240);

    return () => {
      console.log("NewRunningTask unfocused");
      // clearInterval(timerRef.current);
    };
  });

  const returnScreen = () => {
    // return <Text>"hehe"</Text>;
    if (isRunning) {
      // to not throw error after change, before switching to different screen
      // if (
      //   typeof taskList !== "undefined" &&
      //   typeof currentTaskIndex !== "undefined" &&
      //   typeof currentTaskStart !== "undefined" &&
      //   typeof currentTaskEnd !== "undefined"
      // )
      return (
        <>
          <Text>Task is running:</Text>
          {/* <Text>{JSON.stringify(taskList[1])}</Text>
          <Text>{JSON.stringify(currentTaskIndex)}</Text>
          <CountDown
            until={parseInt((currentTaskEnd - new Date()) / 1000)}
            onFinish={() => alert("finished")}
            onPress={() => alert("hello")}
            size={40}
            running={false}
            timeToShow={
              parseInt((currentTaskEnd - new Date()) / 1000) > 3600
                ? ["H", "M", "S"]
                : ["M", "S"]
            }
          />
          <Text>
            timeLeft:{" "}
            {JSON.stringify(parseInt((currentTaskEnd - new Date()) / 1000))}
          </Text>
          <Text>noTasksLeft: {noTasksLeftForToday.toString()}</Text>
          <Text>isRunning: {isRunning.toString()}</Text>
          <Text>Task start: {JSON.stringify(currentTaskStart)}</Text>
          <Text>Task end: {JSON.stringify(currentTaskEnd)}</Text> */}
        </>
      );
    } else {
      if (!noTasksLeftForToday) {
        return <NextTaskView timeLeft={timeLeft} />;
      } else {
        return <Text>noTasksLeft</Text>;
      }
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {returnScreen()}

        <TouchableOpacity
          style={styles.taskListButton}
          onPress={() => navigation.navigate("Task List", { name: "Jane" })}
        >
          <Text style={styles.buttonText}>Task List</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
