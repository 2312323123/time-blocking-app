import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { _retrieveTaskList, _toTimeString } from "../misc/dbAPI";
import { TaskListList } from "../components/TaskListList";
import { useMyAppState } from "../misc/MyAppProvider";
import { useFocusEffect } from "@react-navigation/native";

export const TaskList = ({ navigation, route }) => {
  const {
    MyAppState: { taskList },
  } = useMyAppState();

  dbState = taskList;

  useFocusEffect(() => {
    console.log("tasklist focused");

    return () => {
      console.log("tasklist unfocused");
    };
  });

  return (
    <>
      <Text>This is {route.params.name}'s profile</Text>

      <TaskListList tasklist={dbState} navigation={navigation} />

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
