import { Button, StyleSheet, View, Text } from "react-native";
import { Hehe2 } from "./components/Hehe2";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  dbInit,
  dbReset,
  getTimeLeft,
  getTimeUntilNextTask,
  insertTasks,
} from "./services/dbLogic";
import {
  RunningTaskState,
  unsetRunningTask,
  updateTimeRemaining,
} from "./features/runningTaskSlice";
import { setRunningTask } from "./features/runningTaskSlice";
import { parseTimeStringToDate } from "./services/dbLogic";

type selectorRunningTaskState = {
  runningTask: RunningTaskState;
};

export default function Main() {
  const dispatch = useDispatch();
  const {
    runningTaskId,
    runningTaskStartTime,
    runningTaskTask,
    timeRemaining,
  } = useSelector((state: selectorRunningTaskState) => state.runningTask);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dbInit(() => setLoading(false));
  }, []);

  function getNextTaskAndSetEverythingAccordingly() {
    getTimeUntilNextTask((number, task) => {
      if (number > 0) {
        // task is in the future
        const parsedTask = {
          ...task,
          startTime: parseTimeStringToDate(task.startTime),
          endTime: parseTimeStringToDate(task.endTime),
        };
        dispatch(
          unsetRunningTask({
            runningTaskId: null,
            runningTaskStartTime: null,
            runningTaskTask: parsedTask,
            timeRemaining: number,
          })
        );
      } else if (number === 0) {
        // next task is running
        const parsedTask = {
          ...task,
          startTime: parseTimeStringToDate(task.startTime),
          endTime: parseTimeStringToDate(task.endTime),
        };
        dispatch(
          setRunningTask({
            runningTaskId: task.id,
            runningTaskStartTime: parsedTask.startTime,
            runningTaskTask: parsedTask,
            // probably ok:
            timeRemaining: Math.round(
              (parsedTask.endTime.getTime() - Date.now()) / 1000
            ),
          })
        );
      } else {
        // no tasks left for today
        dispatch(
          unsetRunningTask({
            runningTaskId: null,
            runningTaskStartTime: null,
            runningTaskTask: null,
            timeRemaining: null,
          })
        );
      }
    });
  }

  const mainLoop = () => {
    if (runningTaskId !== null) {
      // calculate getTimeLeft
      getTimeLeft(runningTaskId, runningTaskStartTime, (timeLeft, task) => {
        if (timeLeft < 0) {
          getNextTaskAndSetEverythingAccordingly();
        } else {
          // just update running task time
          const durationMillis =
            runningTaskTask.endTime.getTime() -
            runningTaskTask.startTime.getTime();
          const timeRemainingMillis =
            runningTaskStartTime.getTime() + durationMillis - Date.now();
          dispatch(updateTimeRemaining(Math.round(timeRemainingMillis / 1000)));
        }
      });
    } else {
      // no running task
      // calculate getTimeUntilNextTask, if === 0 then set it as running task
      getNextTaskAndSetEverythingAccordingly();
    }
  };

  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(mainLoop, 1000);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  const countDown = loading ? (
    <Text>
      loading: runningTaskId {JSON.stringify(runningTaskId)} runningTaskTask{" "}
      {JSON.stringify(runningTaskTask)}
    </Text>
  ) : runningTaskTask === null ? (
    <>
      <Text>runningTaskTask === null, so no tasks left for today</Text>
      <Text>
        runningTaskId {JSON.stringify(runningTaskId)} runningTaskTask{" "}
        {JSON.stringify(runningTaskTask)}
      </Text>
    </>
  ) : runningTaskId === null ? (
    <>
      <Text>I am next task countDown View</Text>
      <Text>runningTaskId === {runningTaskId}</Text>
      <Text>time remaining: {timeRemaining}</Text>
    </>
  ) : (
    <>
      <Text>I am running task countDown View</Text>
      <Text>runningTaskId === {runningTaskId}</Text>
      <Text>time remaining: {timeRemaining}</Text>
    </>
  );

  return (
    <View style={styles.container}>
      <Hehe2 />
      <Button title="Add" onPress={() => dbReset()} />
      <Button
        title="console log"
        onPress={() => console.log("log,", Math.random())}
      />
      <Button
        title="db init"
        onPress={() => dbInit(() => console.log("init from button finished"))}
      />
      <Button title="db reset" onPress={() => dbReset()} />
      <Button
        title="insert tasks"
        onPress={() =>
          insertTasks([
            {
              name: "test name",
              startTime: "03:58:00",
              endTime: "23:58:00",
              days: [true, true, true, true, true, true, true],
              done: false,
            },
          ])
        }
      />
      <Button
        title="getTimeLeft(1, new Date())"
        onPress={() =>
          getTimeLeft(1, new Date(), (timeLeft, task) => {
            console.log("timeLeft:", timeLeft);
            console.log("timeLeft task:", task);
          })
        }
      />
      <Button
        title="getTimeUntilNextTask(() => console.log('hehehehe'))"
        onPress={() =>
          getTimeUntilNextTask((number, task) => {
            console.log("getTimeUntilNextTask:", number);
            console.log("getTimeUntilNextTask task:", task);

            if (number === 0) {
              console.log("setting next task as running task...");
              const parsedTask = {
                ...task,
                startTime: parseTimeStringToDate(task.startTime),
                endTime: parseTimeStringToDate(task.endTime),
              };
              dispatch(
                setRunningTask({
                  runningTaskId: task.id,
                  runningTaskStartTime: parsedTask.startTime,
                  runningTaskTask: parsedTask,
                  timeRemaining: Math.round(
                    (Date.now() - parsedTask.endTime.getTime()) / 1000
                  ),
                })
              );
            }
          })
        }
      />
      {countDown}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
});
