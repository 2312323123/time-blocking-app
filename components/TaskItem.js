import React from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Button,
} from "react-native";
import { _toTimeString } from "../misc/dbAPI";
import { useDb } from "../misc/dbAPIContext";

const TaskItem = ({ task, index, navigation }) => {
  const { currentTaskIndex, isRunning } = useDb();

  return (
    <View style={styles.task}>
      <Text style={styles.taskTime}>{_toTimeString(task)}</Text>
      <Text style={[styles.taskName, task.done ? styles.strikeThrough : ""]}>
        {task.name}
      </Text>
      {currentTaskIndex === index && isRunning ? (
        // <ActivityIndicator size="small" color="#00cc00" />
        <Text style={{ marginRight: 6 }}>⏳</Text>
      ) : (
        <Text
          style={[
            styles.taskStatus,
            task.done ? styles.taskStatusDone : styles.taskStatusNotDone,
          ]}
        >
          {task.done ? "✔" : "✘"}

          {/* <ActivityIndicator /> */}
        </Text>
      )}

      <Button
        title="✎"
        onPress={() =>
          navigation.navigate("Edit Task", {
            ...task,
            index,
          })
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  task: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    backgroundColor: "#999",
  },
  taskTime: {
    flex: 1,
    marginRight: 10,
    fontWeight: "bold",
    // whiteSpace: "nowrap",
  },
  taskName: {
    flex: 2,
    marginRight: 10,
  },
  taskStatus: {
    marginRight: 5,
  },
  taskStatusDone: {
    fontSize: 20,
    color: "green",
  },
  taskStatusNotDone: {
    fontSize: 20,
    color: "red",
  },
  strikeThrough: {
    textDecorationLine: "line-through",
  },
});

export default TaskItem;
