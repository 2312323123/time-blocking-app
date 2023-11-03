import React, { useEffect, useState } from "react";
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
import {
  // _editTask,
  _getTaskByIndex,
  // _deleteTask,
  _deleteCurrentTaskInfo,
} from "../misc/dbAPI";
import { useMyAppState } from "../misc/MyAppProvider";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useFocusEffect } from "@react-navigation/native";

export const TaskEdit = ({ navigation, route }) => {
  const { MyAppState, updateTask, deleteTask } = useMyAppState();
  const { isRunning } = MyAppState;

  useFocusEffect(() => {
    console.log("TaskEdit focused");
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
      console.log("TaskEdit unfocused");
      // clearInterval(timerRef.current);
    };
  });

  const { index, ...task } = route.params;

  // text input stuff
  const [text, setText] = useState(task.name);

  const handleInputChange = (inputText) => {
    setText(inputText.toString());
  };

  // duration input stuff
  const [duration, setDuration] = useState(task.duration);

  const handleDurationInputChange = (number) => {
    setDuration(number);
  };

  // date input stuff
  const [date, setDate] = useState(
    new Date(2023, 10, 1, task.time_hours, task.time_minutes)
  );
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

  // completed checkbox stuff
  const [completed, setCompleted] = useState(task.done);

  // creating the task
  const handleSubmit = async () => {
    let parsedDuration = parseInt(duration);
    if (
      typeof text !== "undefined" &&
      text !== "" &&
      typeof date !== "undefined" &&
      typeof parsedDuration !== "undefined"
    ) {
      // console.log("Input Text:", text);
      // console.log("Input Start time:", date);
      // console.log("Input Duration:", duration);

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

      // await _editTask(
      //   parseInt(index),
      //   text,
      //   date.getHours(),
      //   date.getMinutes(),
      //   parseInt(duration),
      //   completed
      // );

      // // if better than the current task, update current task (isRunning is false, and it's viable)
      // const compareDate = new Date();
      // compareDate.setHours(date.getHours(), date.getMinutes(), 0, 0);
      // if (!completed && isRunning === false && compareDate < new Date()) {
      //   compareDate.setMinutes(compareDate.getMinutes() + parseInt(duration));
      //   if (compareDate > new Date()) {
      //     await _deleteCurrentTaskInfo();
      //   }
      // }

      const updatedTask = {
        index: parseInt(index),
        newName: text,
        time_hours: date.getHours(),
        time_minutes: date.getMinutes(),
        duration: parsedDuration,
        done: completed,
      };

      await updateTask(updatedTask);

      // navigation.navigate("Task List");
      navigation.navigate("Task List", {
        name: "Jane",
      }); // way to make it refresh
    } else {
      Alert.alert("Please fill out all fields");
    }
  };

  const handleDeleteTaskSubmit = async () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            // Perform deletion logic here

            // await _deleteTask(parseInt(index));
            await deleteTask(parseInt(index));

            navigation.navigate("Task List", {
              name: "Jane",
            });
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <>
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

        <BouncyCheckbox
          textStyle={{
            textDecorationLine: "none",
            color: "black",
            fontSize: 20,
          }}
          fillColor="blue"
          style={{ marginTop: 16 }}
          ref={(ref) => (bouncyCheckboxRef = ref)}
          isChecked={completed}
          text="done?"
          disableBuiltInState
          onPress={() => setCompleted(!completed)}
        />

        <TouchableOpacity
          style={[styles.actionButton, styles.confirmButton]}
          onPress={handleSubmit}
        >
          <Text style={styles.deleteButtonText}>Confirm changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDeleteTaskSubmit}
        >
          <Text style={styles.deleteButtonText}>Delete task</Text>
          <Text style={styles.deleteButtonText}>Index: {index}</Text>
        </TouchableOpacity>

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
    </>
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
  actionButton: {
    marginVertical: 32,
    padding: 10,
    borderRadius: 5,
  },
  confirmButton: {
    backgroundColor: "green",
    marginTop: 16,
  },
  deleteButton: {
    backgroundColor: "red",
  },
  deleteButtonText: { color: "white", textAlign: "center" },
});
