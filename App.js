import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { _retrieveTaskList, _getCurrentTaskInfo } from "./misc/dbAPI";
import { RunningTask } from "./views/RunningTask";
import { TaskList } from "./views/TaskList";
import { TaskCreate } from "./views/TaskCreate";
import { TaskEdit } from "./views/TaskEdit";
import { MyAppProvider } from "./misc/MyAppProvider";

const Stack = createNativeStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "gray",
  },
};

export default function App() {
  return (
    <MyAppProvider>
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator>
          <Stack.Group
            screenOptions={{ headerStyle: { backgroundColor: "darkgreen" } }}
          >
            <Stack.Screen
              name="Home"
              component={RunningTask}
              options={{
                title: "Current Task",
              }}
            />
            <Stack.Screen name="Task List" component={TaskList} />
            <Stack.Screen name="New Task" component={TaskCreate} />
            <Stack.Screen name="Edit Task" component={TaskEdit} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </MyAppProvider>
  );
}
