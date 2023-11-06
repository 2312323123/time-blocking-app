import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RunningTask } from "./views/RunningTask";
import { TaskList } from "./views/TaskList";
import { TaskCreate } from "./views/TaskCreate";
import { TaskEdit } from "./views/TaskEdit";
import { MyAppProvider } from "./misc/MyAppProvider";
import { NewRunningTask } from "./views/NewRunningTask";

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
            <Stack.Screen name="New Running Task" component={NewRunningTask} />
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
