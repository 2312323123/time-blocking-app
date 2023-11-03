import React, { useState } from "react";
import { Button, Text } from "react-native";

export default UpdateTask = (props) => {
  // const {
  //   initialState: {
  //     taskList,
  //     noTasksLeftForToday,
  //     isRunning,
  //     currentTaskIndex,
  //     currentTaskStart,
  //     currentTaskEnd,
  //   },
  // } = props;

  // const [MyAppState, setState] = useState({
  //   taskList,
  //   noTasksLeftForToday,
  //   isRunning,
  //   currentTaskIndex,
  //   currentTaskStart,
  //   currentTaskEnd,
  // });

  const [MyAppState, setState] = useState(props.initialState);

  function getCurrentTask(tasks) {
    const now = new Date();
    const compareStart = new Date();
    const compareEnd = new Date();

    const currentTaskIndex = tasks.findLastIndex((task) => {
      // findLast in case there are multiple tasks at the same time, probably the interrupting one will be shorter
      compareStart.setHours(task.time_hours, task.time_minutes, 0, 0);
      compareEnd.setHours(
        task.time_hours,
        task.time_minutes + task.duration,
        0,
        0
      );
      return now >= compareStart && now < compareEnd && !task.done;
    });

    if (currentTaskIndex === -1) {
      return undefined;
    } else {
      const currentTask = {
        ...tasks[currentTaskIndex],
        index: currentTaskIndex,
      };
      return currentTask;
    }
  }

  function getNextTask(tasks) {
    // returns undefined if done for the day, otherwise returns the next task
    const now = new Date();
    const compareStart = new Date();

    const nextTaskIndex = tasks.findIndex((task) => {
      compareStart.setHours(task.time_hours, task.time_minutes, 0, 0);
      return now < compareStart && !task.done;
    });

    if (nextTaskIndex === -1) {
      return undefined;
    } else {
      const nextTask = { ...tasks[nextTaskIndex], index: nextTaskIndex };
      return nextTask;
    }
  }

  function lookForNextTaskAndReturnSomeValues(taskList) {
    let noTasksLeftForToday,
      couldAutoRun,
      currentTaskIndex,
      currentTaskStart,
      currentTaskEnd;

    let currentTask = getCurrentTask(taskList);

    if (typeof currentTask !== "undefined") {
      couldAutoRun = true;
      noTasksLeftForToday = false;
      currentTaskIndex = currentTask.index;
      currentTaskStart = new Date();
      currentTaskStart.setHours(
        currentTask.time_hours,
        currentTask.time_minutes,
        0,
        0
      );
      currentTaskEnd = new Date(currentTaskStart);
      currentTaskEnd.setMinutes(
        currentTaskEnd.getMinutes() + currentTask.duration
      );
    } else {
      couldAutoRun = false;

      let nextTask = getNextTask(taskList);

      if (typeof nextTask !== "undefined") {
        noTasksLeftForToday = false;
        currentTaskIndex = nextTask.index;
        currentTaskStart = new Date();
        currentTaskStart.setHours(
          nextTask.time_hours,
          nextTask.time_minutes,
          0,
          0
        );
        currentTaskEnd = new Date(currentTaskStart);
        currentTaskEnd.setMinutes(
          currentTaskEnd.getMinutes() + nextTask.duration
        );
      } else {
        noTasksLeftForToday = true;
        currentTaskIndex = undefined;
        currentTaskStart = undefined;
        currentTaskEnd = undefined;
      }
    }

    return {
      noTasksLeftForToday,
      couldAutoRun,
      currentTaskIndex,
      currentTaskStart,
      currentTaskEnd,
    };
  }

  function calculateInsertionIndex(taskList, task) {
    const index = taskList.findIndex((listTask) => {
      return (
        task.time_hours < listTask.time_hours ||
        (task.time_hours === listTask.time_hours &&
          task.time_minutes < listTask.time_minutes)
      );
    });

    if (index === -1) {
      return taskList.length;
    } else {
      return index;
    }
  }

  // needed in below in order not to forget to update both state and db
  async function setRunningTask(
    isRunning,
    taskList,
    currentTaskIndex,
    currentTaskStart,
    currentTaskEnd
  ) {
    if (isRunning) {
      // await _setRunningTask({
      //   index: currentTaskIndex,
      //   start_hours: taskList[currentTaskIndex].time_hours,
      //   start_minutes: taskList[currentTaskIndex].time_minutes,
      // });
    } else {
      await unsetRunningTask();
    }
    if (isRunning) {
      // dispatch({
      //   type: "SET_RUNNING_TASK",
      //   payload: { currentTaskIndex, currentTaskStart, currentTaskEnd },
      // });
      setState((state) => ({
        ...state,
        isRunning: true,
        currentTaskIndex,
        currentTaskStart,
        currentTaskEnd,
      }));
    } else {
      // dispatch({
      //   type: "SET_NEXT_TASK",
      //   payload: { currentTaskIndex, currentTaskStart, currentTaskEnd },
      // });
      setState((state) => ({
        ...state,
        isRunning: false,
        currentTaskIndex,
        currentTaskStart,
        currentTaskEnd,
      }));
    }
  }

  async function unsetRunningTask() {
    setState((state) => ({
      ...state,
      isRunning: false,
      currentTaskIndex: undefined,
      currentTaskStart: undefined,
      currentTaskEnd: undefined,
    }));
  }

  function taskCanBeRunning(task) {
    const now = new Date();
    const compareStart = new Date();
    const compareEnd = new Date();

    compareStart.setHours(task.time_hours, task.time_minutes, 0, 0);
    compareEnd.setHours(
      task.time_hours,
      task.time_minutes + task.duration,
      0,
      0
    );

    return now >= compareStart && now < compareEnd && !task.done;
  }

  async function updateTask({
    index,
    newName,
    time_hours,
    time_minutes,
    duration,
    done,
  }) {
    let updatedTask, newIndex, taskList;
    let isRunning = MyAppState.isRunning;

    if (typeof time_hours !== "number") {
      time_hours = 0;
    }
    if (typeof time_minutes !== "number") {
      time_minutes = 0;
    }
    if (typeof duration !== "number") {
      duration = 0;
    }
    if (time_hours < 0 || time_hours > 23) {
      time_hours = 0;
    }
    if (time_minutes < 0 || time_minutes > 59) {
      time_minutes = 0;
    }
    if (typeof done !== "boolean") {
      done = false;
    }

    updatedTask = {
      name: newName,
      time_hours,
      time_minutes,
      duration,
      done,
    };
    newIndex = calculateInsertionIndex(MyAppState.taskList, updatedTask);
    if (newIndex > index) {
      newIndex--; // since calculated on old taskList
    }

    taskList = [...MyAppState.taskList];
    taskList.splice(index, 1);
    taskList.splice(newIndex, 0, updatedTask);

    let {
      noTasksLeftForToday,
      couldAutoRun,
      currentTaskIndex,
      currentTaskStart,
      currentTaskEnd,
    } = lookForNextTaskAndReturnSomeValues(taskList);

    /* when running task is updated */
    if (MyAppState.currentTaskIndex === index && MyAppState.isRunning) {
      if (taskCanBeRunning(updatedTask)) {
        let newCurrentTaskStart = new Date();
        newCurrentTaskStart.setHours(time_hours, time_minutes, 0, 0);

        let newCurrentTaskEnd = new Date(newCurrentTaskStart);
        newCurrentTaskEnd.setMinutes(newCurrentTaskEnd.getMinutes() + duration);

        setRunningTask(
          true,
          taskList,
          newIndex,
          newCurrentTaskStart,
          newCurrentTaskEnd
        );
      } else {
        isRunning = false;
        updatedTask.done = true;

        setRunningTask(
          false,
          taskList,
          currentTaskIndex,
          currentTaskStart,
          currentTaskEnd
        );
      }
    } else {
      /* set next task if running task is not updated */
      setRunningTask(
        false,
        taskList,
        currentTaskIndex,
        currentTaskStart,
        currentTaskEnd
      );
    }
    /* --------- */

    // dispatch({
    //   type: "TASK_EDITED",
    //   payload: {
    //     taskList,
    //     isRunning: false,
    //     noTasksLeftForToday,
    //   },
    // });
    setState((state) => ({
      ...state,
      taskList,
      isRunning,
      noTasksLeftForToday,
    }));
  }

  return (
    <>
      <Text>UpdateTask</Text>
      <Text>
        taskList:{" "}
        {MyAppState.taskList.map((task, index) => {
          return "task " + index + ": " + JSON.stringify(task) + "\n";
        })}
      </Text>
      <Text>
        noTasksLeftForToday:{" "}
        {typeof MyAppState.noTasksLeftForToday === "undefined"
          ? "undefined"
          : JSON.stringify(MyAppState.noTasksLeftForToday)}
      </Text>
      <Text>
        isRunning:{" "}
        {typeof MyAppState.isRunning === "undefined"
          ? "undefined"
          : JSON.stringify(MyAppState.isRunning)}
      </Text>
      <Text>
        currentTaskIndex:{" "}
        {typeof MyAppState.currentTaskIndex === "undefined"
          ? "undefined"
          : JSON.stringify(MyAppState.currentTaskIndex)}
      </Text>
      <Text>
        currentTaskStart:{" "}
        {typeof MyAppState.currentTaskStart === "undefined"
          ? "undefined"
          : JSON.stringify(MyAppState.currentTaskStart)}
      </Text>
      <Text>
        currentTaskEnd:{" "}
        {typeof MyAppState.currentTaskEnd === "undefined"
          ? "undefined"
          : JSON.stringify(MyAppState.currentTaskEnd)}
      </Text>

      <Button
        title="console log"
        onPress={async () => await updateTask(props.updateData)}
      />
    </>
  );
};
