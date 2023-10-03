import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  TextInput,
  Platform,
  SafeAreaView,
} from "react-native";
// import {
//   DatePickerIOS,
//   DatePickerAndroid,
// } from "@react-native-community/datetimepicker";
import { StatusBar } from "expo-status-bar";
import { _retrieveTaskList, _toTimeString } from "../misc/dbAPI";
import { TaskListList } from "../components/TaskListList";
import { useDb } from "../misc/dbAPIContext";

export const TaskList = ({ navigation, route }) => {
  const { dbState } = useDb();

  const [tasklist, setTasklist] = React.useState([]);

  React.useEffect(() => {
    async function DoAsyncStuff() {
      const tasks = await _retrieveTaskList();
      setTasklist(tasks);
    }
    DoAsyncStuff();
  }, [dbState]);

  const addTask = () => {
    console.log("addTask has been called");
  };

  return (
    <>
      <Text>This is {route.params.name}'s profile</Text>

      <TaskListList tasklist={tasklist} navigation={navigation} />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate("New Task", {
            name: "Jane",
          })
        }
      >
        <Text style={styles.buttonText}>New Task</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  addButton: {
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
