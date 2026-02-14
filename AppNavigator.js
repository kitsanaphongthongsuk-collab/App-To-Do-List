import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import AddTaskScreen from "../screens/AddTaskScreen";
import DeleteScreen from "../screens/DeleteScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tasks" component={HomeScreen} />
      <Stack.Screen name="Add Task" component={AddTaskScreen} />
      <Stack.Screen name="Delete Tasks" component={DeleteScreen} />
    </Stack.Navigator>
  );
}
