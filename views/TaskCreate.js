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
import { _createTask } from "../misc/dbAPI";
import { useMyAppState } from "../misc/MyAppProvider";

export const TaskCreate = ({ navigation }) => {
  // rerendering related stuff
  const { updateDbState } = useMyAppState();

  // text input stuff
  const [text, setText] = useState("");

  const handleInputChange = (inputText) => {
    setText(inputText.toString());
  };

  // duration input stuff
  const [duration, setDuration] = useState(0);

  const handleDurationInputChange = (number) => {
    setDuration(number);
  };

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
    // Do something with the input text, for example, send it to an API or perform an action
    if (text && date && duration) {
      // console.log("Input Text:", text);
      // console.log("Input Start time:", date);
      // console.log("Input Duration:", duration);

      if (duration <= 0) {
        Alert.alert("Duration must be a positive integer");
        return;
      }

      const endDate = new Date(date);
      endDate.setMinutes(endDate.getMinutes() + duration);
      if (
        date.getDate() !== endDate.getDate() ||
        date.getMonth() !== endDate.getMonth() ||
        date.getFullYear() !== endDate.getFullYear()
      ) {
        Alert.alert("Task must end on the same day it starts");
        return;
      }

      await _createTask(
        text,
        date.getHours(),
        date.getMinutes(),
        parseInt(duration)
      );

      await updateDbState(); // rerendering-related

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

      <Button style={styles.submit} title="Create" onPress={handleSubmit} />
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
