import React from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import TaskItem from "./TaskItem";

const tasks = [
  { id: "1", time: "10:00 AM", name: "Task 1", done: false },
  { id: "2", time: "1:30 PM", name: "Task 2", done: true },
  { id: "3", time: "4:45 PM", name: "Task 3", done: false },
];

// name, time_hours, time_minutes, duration, done

export const TaskListList = ({ tasklist, navigation }) => {
  return (
    // <View>
    //   <Text>hehe</Text>
    // </View>
    <View style={styles.container}>
      <FlatList
        data={tasklist}
        keyExtractor={(_, index) => index}
        renderItem={({ item, index }) => (
          <TaskItem task={item} index={index} navigation={navigation} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
