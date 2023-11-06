import React, { useRef, useEffect, useState } from "react";
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

export const NewRunningTaskView = ({ navigation }) => {
  const { MyAppState, runTask, taskFinished, nextTaskObsolete } =
    useMyAppState();

  interface AppState {
    taskList: any;
    noTasksLeftForToday: boolean;
    isRunning: boolean;
    currentTaskIndex: number | undefined;
    currentTaskStart: Date | undefined;
    currentTaskEnd: Date | undefined;
  }

  const {
    taskList,
    noTasksLeftForToday,
    isRunning,
    currentTaskIndex,
    currentTaskStart,
    currentTaskEnd,
  }: AppState = MyAppState;

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
          `show running screen with ${
            (currentTaskEnd.getTime() - new Date().getTime()) / 1000
          } seconds left`,
          Math.random()
        );
        return;
      }
    }

    console.log("hehe0");
    if (currentTaskIndex) {
      console.log("hehe1");
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
    mainLoop();

    timerRef.current = setInterval(() => {
      if (typeof currentTaskEnd !== "undefined" || currentTaskEnd !== null) {
        // setTimeLeft(parseInt((currentTaskEnd - new Date()) / 1000));
      }
      mainLoop();
    }, 240);

    return () => {
      clearInterval(timerRef.current);
    };
  });

  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <CountDown
            until={timeLeft}
            onFinish={() => alert("finished")}
            onPress={() => alert("hello")}
            size={40}
            running={false}
            timeToShow={timeLeft > 3600 ? ["H", "M", "S"] : ["M", "S"]}
          />
          {/* <Text>timeLeft: {JSON.stringify(state.timeLeft)}</Text>
        <Text>noTasksLeft: {state.noTasksLeft.toString()}</Text>
        <Text>isRunning: {isRunning.toString()}</Text> */}
        </View>

        <Button title="console log" onPress={() => console.log("hello")} />

        <Text>taskList:</Text>
        <Text>{JSON.stringify(taskList)}</Text>

        <Text>noTasksLeftForToday:</Text>
        <Text>{JSON.stringify(noTasksLeftForToday)}</Text>

        <Text>isRunning:</Text>
        <Text>{JSON.stringify(isRunning)}</Text>

        <Text>currentTaskIndex:</Text>
        <Text>{JSON.stringify(currentTaskIndex)}</Text>

        <Text>currentTaskStart:</Text>
        <Text>{JSON.stringify(currentTaskStart)}</Text>

        <Text>currentTaskEnd:</Text>
        <Text>{JSON.stringify(currentTaskEnd)}</Text>

        <Text>new Date():</Text>
        <Text>{JSON.stringify(new Date())}</Text>

        <Text>parseInt((currentTaskEnd - new Date()) / 1000):</Text>
        <Text>
          {JSON.stringify(
            (currentTaskEnd.getTime() - new Date().getTime()) / 1000
          )}
        </Text>

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
