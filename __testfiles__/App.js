import React from "react";
import { Button, Text } from "react-native";

export default function App() {
  return (
    <>
      <Text>App, hehe</Text>
      <Button title="console log" onPress={() => console.log("hello")} />
    </>
  );
}
