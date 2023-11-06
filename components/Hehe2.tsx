import { Text, Button } from "react-native";
import { RootState } from "../store";

import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "../features/counterSlice";

function Hehe2() {
  const counter = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <>
      <Text>hehe213414 {counter} </Text>
      <Button title="hehe" onPress={() => dispatch(increment())} />
      <Button title="hehe" onPress={() => dispatch(decrement())} />
    </>
  );
}

export { Hehe2 };
