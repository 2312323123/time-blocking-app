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

export const NextTaskView = () => {
  //{ timeLeft }) => {
  const {
    MyAppState: {
      taskList,
      noTasksLeftForToday,
      isRunning,
      currentTaskIndex,
      currentTaskStart,
      currentTaskEnd,
    },
  } = useMyAppState();

  useFocusEffect(() => {
    console.log("NextTaskView focused");
    // mainLoop();

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
      console.log("NextTaskView unfocused");
      // clearInterval(timerRef.current);
    };
  });

  // const [showScreen, setShowScreen] = useState(false);

  // useLayoutEffect(() => {
  //   if (typeof currentTaskIndex !== "undefined" && currentTaskIndex !== null) {
  //     setShowScreen(true);
  //   } else {
  //     setShowScreen(false);
  //   }
  // }, [currentTaskIndex]);

  const timeLeft = 10;

  return (
    <ScrollView>
      {/* {showScreen && ( */}
      <>
        <Text>I am NextTaskView</Text>
        <View style={styles.container}>
          <Text>Next Task starts in:</Text>
          <View>
            {/* <CountDown
              until={timeLeft}
              onFinish={() => alert("finished")}
              onPress={() => alert("hello")}
              size={40}
              running={false}
              timeToShow={timeLeft > 3600 ? ["H", "M", "S"] : ["M", "S"]}
            /> */}
            <Text>timeLeft: {JSON.stringify(timeLeft)}</Text>
            <Text>isRunning: {isRunning.toString()}</Text>
          </View>

          <Button title="console log" onPress={() => console.log("hello")} />

          {/* <Text>taskList:</Text>
          <Text>{JSON.stringify(taskList)}</Text> */}

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
        </View>
      </>
      {/* )} */}
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
