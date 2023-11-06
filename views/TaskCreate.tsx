import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
// import { _createTask } from "../misc/dbAPI";
import { useMyAppState } from "../misc/MyAppProvider";
import { useFocusEffect } from "@react-navigation/native";

export const TaskCreate = ({ navigation }) => {
  const { createTask } = useMyAppState();

  // text input stuff
  const [text, setText] = useState("");

  const handleInputChange = (inputText) => {
    setText(inputText.toString());
  };

  // duration input stuff
  const [duration, setDuration] = useState();

  const handleDurationInputChange = (number) => {
    setDuration(number);
  };

  useFocusEffect(() => {
    console.log("TaskCreate focused");
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
      console.log("TaskCreate unfocused");
      // clearInterval(timerRef.current);
    };
  });

  // date input stuff
  const [date, setDate] = useState(new Date("2023-10-01T12:00:00"));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showTimepicker = () => {
    showMode("time");
  };

  // creating the task
  const handleSubmit = async () => {
    let parsedDuration = parseInt(duration);
    if (
      typeof text !== "undefined" &&
      text !== "" &&
      typeof date !== "undefined" &&
      typeof parsedDuration !== "undefined"
    ) {
      if (parsedDuration <= 0) {
        Alert.alert("Duration must be a positive integer");
        return;
      }

      const endDate = new Date(date);
      endDate.setMinutes(endDate.getMinutes() + parsedDuration);
      if (
        date.getDate() !== endDate.getDate() ||
        date.getMonth() !== endDate.getMonth() ||
        date.getFullYear() !== endDate.getFullYear()
      ) {
        Alert.alert("Task must end on the same day it starts");
        return;
      }

      // await _createTask(
      //   text,
      //   date.getHours(),
      //   date.getMinutes(),
      //   parseInt(duration)
      // );

      const task = {
        name: text,
        time_hours: date.getHours(),
        time_minutes: date.getMinutes(),
        duration: parsedDuration,
        done: false,
      };

      await createTask(task);

      // navigation.navigate("Task List");
      navigation.navigate("Task List", {
        name: "Jane",
      });
    } else {
      Alert.alert("Please fill out all fields");
    }
  };

  return (
    <SafeAreaView>
      <Text style={styles.label}>name:</Text>
      <TextInput
        style={styles.input}
        placeholder="i.e. clean the room"
        onChangeText={handleInputChange}
        value={text}
      />
      <Text style={styles.label}>start time:</Text>
      <Button
        onPress={showTimepicker}
        title={
          date
            ? date.getHours() +
              ":" +
              date.getMinutes().toString().padStart(2, "0")
            : "Show time picker!"
        }
      />
      {/* <Text>selected: {date.toLocaleString()}</Text> */}

      <Text style={styles.label}>duration (minutes):</Text>
      <TextInput
        style={[styles.input, styles.lastInput]}
        placeholder="i.e. 10"
        keyboardType="numeric"
        onChangeText={handleDurationInputChange}
        value={duration ? duration.toString() : ""}
      />

      <Button title="Create" onPress={handleSubmit} />
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    margin: 10,
    padding: 2,
    borderWidth: 1,
    fontSize: 20,
    backgroundColor: "lightblue",
  },
  label: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 5,
    borderTopWidth: 1,
  },
  lastInput: {
    marginBottom: 20,
  },
});
