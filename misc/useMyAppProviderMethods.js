import { useReducer } from "react";
import {
  _setNewDay,
  _isNewDay,
  _setTaskList,
  _getTaskList,
  _setRunningTask,
  _getRunningTask,
} from "./dbAPI";
import { Alert } from "react-native";
import { initialState, reducer } from "./reducer";

/*
taskList format: [{ name, time_hours, time_minutes, duration, done }, ...]

DB variables:
TIME_BLOCKING_APP_TASKS
TIME_BLOCKING_APP_RUNNING_TASK (includes { index, start_hours, start_minutes }), also can be set to undefined
TIME_BLOCKING_APP_DAY

DB methods:
1. _setNewDay (no arguments) sets to (new Date()).toISOString().substring(0, 10)
2. _isNewDay:Boolean
3. _setTaskList (Object)
4. _getTaskList:Object
5. _setRunningTask ( {index: :Int, start_hours: :Int, start_minutes: :Int} or undefined)
6. _getRunningTask:Object {index: :Int, start_hours: :Int, start_minutes: :Int}

reducer variables:
  taskList: undefined, // :Array of Objects
  noTasksLeftForToday: false, // :Bool
  isRunning: true, // :Bool
  currentTaskIndex: undefined, // :Int
  currentTaskStart: undefined, // :Date
  currentTaskEnd: undefined, // :Date
*/

export const useMyAppProviderMethods = () => {
  const [MyAppState, dispatch] = useReducer(reducer, initialState);

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

  function makeTasksNotDoneButDontChangeStateNorDb(tasks) {
    return tasks.map((task) => {
      return { ...task, done: false };
    });
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

  // needed in below in order not to forget to update both state and db
  async function setRunningTask(
    isRunning,
    taskList,
    currentTaskIndex,
    currentTaskStart,
    currentTaskEnd
  ) {
    if (isRunning) {
      await _setRunningTask({
        index: currentTaskIndex,
        start_hours: taskList[currentTaskIndex].time_hours,
        start_minutes: taskList[currentTaskIndex].time_minutes,
      });
    } else {
      await unsetRunningTask();
    }
    if (isRunning) {
      dispatch({
        type: "SET_RUNNING_TASK",
        payload: { currentTaskIndex, currentTaskStart, currentTaskEnd },
      });
    } else {
      dispatch({
        type: "SET_NEXT_TASK",
        payload: { currentTaskIndex, currentTaskStart, currentTaskEnd },
      });
    }
  }

  async function unsetRunningTask() {
    await _setRunningTask(undefined);
    dispatch({ type: "UNSET_RUNNING_TASK" });
  }

  async function _runTask(index, finishCurrentTask) {
    let taskList, currentTaskIndex, currentTaskStart, currentTaskEnd;
    console.log("_runTask has been run\n.");

    taskList = MyAppState.taskList;

    let taskListChanged = false;
    // if (currentTaskIndex && isRunning && finishCurrentTask) -> edit current task to done
    if (
      typeof currentTaskIndex !== "undefined" &&
      MyAppState.isRunning &&
      finishCurrentTask
    ) {
      taskList[currentTaskIndex].done = true;
      taskListChanged = true;
    }

    if (index < 0 || index >= taskList.length) {
      throw "new task index out of bound in _runTask";
    }
    currentTaskIndex = index;
    currentTaskStart = new Date();
    currentTaskEnd = new Date(currentTaskStart);
    currentTaskEnd.setMinutes(
      currentTaskEnd.getMinutes() + taskList[currentTaskIndex].duration
    );

    // deal with running task first:
    await setRunningTask(
      true,
      taskList,
      currentTaskIndex,
      currentTaskStart,
      currentTaskEnd
    );

    // set reducer variables (dispatch):
    dispatch({
      type: "RUN_TASK",
      payload: { taskListChanged, taskList },
    });

    // preserve what necessary in db:
    if (taskListChanged) {
      _setTaskList(taskList);
    }
  }

  async function _taskFinished(index) {
    let taskList,
      noTasksLeftForToday,
      couldAutoRun,
      currentTaskIndex,
      currentTaskStart,
      currentTaskEnd;

    taskList = MyAppState.taskList;
    taskList[MyAppState.currentTaskIndex].done = true;

    ({
      noTasksLeftForToday,
      couldAutoRun,
      currentTaskIndex,
      currentTaskStart,
      currentTaskEnd,
    } = lookForNextTaskAndReturnSomeValues(taskList));

    // deal with running task first:
    // if (isRunning) {
    //   await setRunningTask(currentTaskIndex, currentTaskStart, currentTaskEnd);
    // } else {
    //   await unsetRunningTask();
    // }
    if (typeof currentTaskIndex !== "undefined") {
      await setRunningTask(
        couldAutoRun, // ?
        taskList,
        currentTaskIndex,
        currentTaskStart,
        currentTaskEnd
      );
    } else {
      await unsetRunningTask();
    }
    // await setRunningTask(
    //   taskList,
    //   currentTaskIndex,
    //   currentTaskStart,
    //   currentTaskEnd
    // );

    // preserve what necessary in db:
    await _setTaskList(taskList);

    // set reducer variables (dispatch):
    dispatch({
      type: "TASK_FINISHED",
      payload: {
        taskList,
        noTasksLeftForToday,
        isRunning: couldAutoRun,
      },
    });

    /*
    2. timer dobiega do 0:
    (na co zmieniamy)
      noTasksLeftForToday: wyliczamy czy true czy false,
      isRunning: jeśli jest następny task teraz i jesteśmy w RunningScreen to true, jeśli któreś nie to false
      currentTaskIndex: jeśli jest następny task for today to tego taska, jeśli nie to undefined
      currentTaskStart: jeśli jest następny task for today to tego taska, jeśli nie to undefined
      currentTaskEnd: jeśli jest następny task for today to tego taska wyliczone z duration, jeśli nie to undefined
  */
  }

  async function _runNextTask(movePermanently) {
    let taskList,
      noTasksLeftForToday,
      isRunning,
      currentTaskIndex,
      currentTaskStart,
      currentTaskEnd;

    // if (!MyAppState.isRunning) {

    // }

    if (typeof MyAppState.currentTaskIndex !== "undefined") {
      taskList = MyAppState.taskList;
      noTasksLeftForToday = false;
      isRunning = true;
      currentTaskStart = new Date();
      currentTaskEnd = new Date(currentTaskStart);
      currentTaskEnd.setMinutes(
        currentTaskEnd.getMinutes() +
          taskList[MyAppState.currentTaskIndex].duration
      );

      if (movePermanently) {
        taskList[MyAppState.currentTaskIndex].time_hours =
          new Date().getHours();
        taskList[MyAppState.currentTaskIndex].time_minutes =
          new Date().getMinutes();
      }
    } else {
      throw "no current task in _runNextTask";
    }

    // deal with running task first:
    await setRunningTask(
      true,
      taskList,
      currentTaskIndex,
      currentTaskStart,
      currentTaskEnd
    );

    // preserve what necessary in db:
    if (movePermanently) {
      await _setTaskList(taskList);
    }

    // set reducer variables (dispatch):
    dispatch({
      type: "RUN_NEXT_TASK",
      payload: { movePermanently, taskList },
    });
  }

  async function _nextTaskObsolete() {
    let taskList,
      noTasksLeftForToday,
      couldAutoRun,
      currentTaskIndex,
      currentTaskStart,
      currentTaskEnd;

    ({
      noTasksLeftForToday,
      couldAutoRun,
      currentTaskIndex,
      currentTaskStart,
      currentTaskEnd,
    } = lookForNextTaskAndReturnSomeValues(taskList));

    // deal with running task first:
    // if (isRunning) {
    //   await setRunningTask(currentTaskIndex, currentTaskStart, currentTaskEnd);
    // } else {
    //   await unsetRunningTask();
    // }
    if (typeof currentTaskIndex !== "undefined") {
      await setRunningTask(
        isRunning,
        taskList,
        currentTaskIndex,
        currentTaskStart,
        currentTaskEnd
      );
    } else {
      await unsetRunningTask();
    }
    // await setRunningTask(
    //   taskList,
    //   currentTaskIndex,
    //   currentTaskStart,
    //   currentTaskEnd
    // );

    // preserve what necessary in db:
    await _setTaskList(taskList);

    // set reducer variables (dispatch):
    dispatch({
      type: "NEXT_TASK_OBSOLETE",
      payload: {
        noTasksLeftForToday,
        isRunning: couldAutoRun,
      },
    });
  }

  async function checkIfNewDayAndPrepareEverythingAccordingly() {
    let taskList,
      noTasksLeftForToday,
      couldAutoRun,
      currentTaskIndex,
      currentTaskStart,
      currentTaskEnd;

    let oldRunningTaskStillActive = false;

    const isNewDay = await _isNewDay();
    taskList = await _getTaskList();
    if (isNewDay) {
      taskList = makeTasksNotDoneButDontChangeStateNorDb(taskList);
    } else {
      const oldRunningTask = await _getRunningTask();
      if (typeof oldRunningTask !== "undefined") {
        const oldRunningTaskListInfo = taskList[oldRunningTask.index];
        // if time finished, just mark as done, else it's the current task acutally
        const oldRunningTaskEnd = new Date();
        oldRunningTaskEnd.setHours(
          oldRunningTaskListInfo.time_hours,
          oldRunningTaskListInfo.time_minutes + oldRunningTaskListInfo.duration,
          0,
          0
        );
        if (oldRunningTaskEnd < new Date()) {
          taskList[oldRunningTask.index].done = true;
        } else {
          oldRunningTaskStillActive = true;
          noTasksLeftForToday = false;
          couldAutoRun = true;
          currentTaskIndex = oldRunningTask.index;
          const oldRunningTaskStart = new Date();
          oldRunningTaskStart.setHours(
            oldRunningTaskListInfo.time_hours,
            oldRunningTaskListInfo.time_minutes,
            0,
            0
          );
          currentTaskStart = oldRunningTaskStart;
          currentTaskEnd = oldRunningTaskEnd;
        }
      }
    }

    if (!oldRunningTaskStillActive) {
      ({
        noTasksLeftForToday,
        couldAutoRun,
        currentTaskIndex,
        currentTaskStart,
        currentTaskEnd,
      } = lookForNextTaskAndReturnSomeValues(taskList));
    }

    // deal with running task first:

    // if (isRunning) {
    //   await setRunningTask(
    //     taskList,
    //     currentTaskIndex,
    //     currentTaskStart,
    //     currentTaskEnd
    //   );
    // } else {
    //   await unsetRunningTask();
    // }
    if (typeof currentTaskIndex !== "undefined") {
      await setRunningTask(
        couldAutoRun,
        taskList,
        currentTaskIndex,
        currentTaskStart,
        currentTaskEnd
      );
    } else {
      await unsetRunningTask();
    }
    // await setRunningTask(
    //   taskList,
    //   currentTaskIndex,
    //   currentTaskStart,
    //   currentTaskEnd
    // );

    // preserve what necessary in db:
    if (isNewDay) {
      await _setNewDay();
      await _setTaskList(taskList); // done: false for all
      await unsetRunningTask();
    }

    // set reducer variables (dispatch):
    dispatch({
      type: "INITIAL_LOAD",
      payload: {
        taskList,
        noTasksLeftForToday,
        isRunning: couldAutoRun,
      },
    });
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

  async function createTask({
    name,
    time_hours,
    time_minutes,
    duration,
    done = false,
  }) {
    let newNextTask = false;
    let increaseCurrentNextTaskIndex = false;
    let leaveRunningTaskAsIs = false;

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
    const insertionIndex = calculateInsertionIndex(MyAppState.taskList, {
      name,
      time_hours,
      time_minutes,
      duration,
      done,
    });

    const startDate = new Date();
    startDate.setHours(time_hours, time_minutes, 0, 0);
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + duration);

    if (!MyAppState.isRunning) {
      if (typeof MyAppState.currentTaskIndex === "undefined") {
        // const endDate = new Date(startDate);
        // endDate.setMinutes(endDate.getMinutes() + duration);
        if (startDate > new Date()) {
          // && endDate > new Date()) {
          // setRunningTask(taskList)
          newNextTask = true;
          /*
    taskList,
    currentTaskIndex,
    currentTaskStart,
    currentTaskEnd
    */
        } else {
          leaveRunningTaskAsIs = true;
        }
      } else if (insertionIndex < MyAppState.currentTaskIndex) {
        if (startDate > new Date()) {
          newNextTask = true;
        } else {
          increaseCurrentNextTaskIndex = true;
        }
      }
    } else {
      leaveRunningTaskAsIs = true;
    }

    // update local instance of taskList
    let taskList = [...MyAppState.taskList];
    taskList.splice(insertionIndex, 0, {
      name,
      time_hours,
      time_minutes,
      duration,
      done,
    });

    // deal with running task first:
    if (!leaveRunningTaskAsIs) {
      if (newNextTask) {
        await setRunningTask(
          false,
          taskList,
          insertionIndex,
          startDate,
          endDate
        );
      } else if (increaseCurrentNextTaskIndex) {
        await setRunningTask(
          false,
          taskList,
          MyAppState.currentTaskIndex + 1,
          MyAppState.currentTaskStart,
          MyAppState.currentTaskEnd
        );
      }
    }

    // preserve what necessary in db:
    await _setTaskList(taskList);

    // set reducer variables (dispatch):
    dispatch({
      type: "TASK_CREATED",
      payload: {
        taskList,
        newNextTask,
      },
    });
  }

  function isEligible(task) {
    const now = new Date();
    const compareEnd = new Date();
    compareEnd.setHours(
      task.time_hours,
      task.time_minutes + task.duration,
      0,
      0
    );

    return now < compareEnd && !task.done;
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

    // preserve what necessary in db:
    await _setTaskList(taskList);

    // set reducer variables (dispatch):
    dispatch({
      type: "TASK_EDITED",
      payload: {
        taskList,
        isRunning,
        noTasksLeftForToday,
      },
    });
  }

  async function deleteTask(index) {
    const taskList = [...MyAppState.taskList];
    taskList.splice(index, 1);

    if (
      typeof MyAppState.currentTaskIndex === "undefined" ||
      (typeof MyAppState.currentTaskIndex !== "undefined" &&
        index !== MyAppState.currentTaskIndex)
    ) {
      // deal with running task first:
      if (
        typeof MyAppState.currentTaskIndex !== "undefined" &&
        index < MyAppState.currentTaskIndex
      ) {
        await setRunningTask(
          MyAppState.isRunning,
          taskList,
          MyAppState.currentTaskIndex - 1,
          MyAppState.currentTaskStart,
          MyAppState.currentTaskEnd
        );
      }

      // preserve what necessary in db:
      await _setTaskList(taskList);

      // set reducer variables (dispatch):
      dispatch({
        type: "TASK_DELETED",
        payload: { taskList },
      });
    } else {
      let {
        noTasksLeftForToday,
        couldAutoRun,
        currentTaskIndex,
        currentTaskStart,
        currentTaskEnd,
      } = lookForNextTaskAndReturnSomeValues(taskList);

      // deal with running task first:
      if (typeof currentTaskIndex !== "undefined") {
        await setRunningTask(
          false, // ?
          taskList,
          currentTaskIndex,
          currentTaskStart,
          currentTaskEnd
        );
      } else {
        await unsetRunningTask();
      }

      // preserve what necessary in db:
      await _setTaskList(taskList);

      // set reducer variables (dispatch):
      dispatch({
        type: "TASK_DELETED",
        payload: { noTasksLeftForToday, isRunning: false },
      });
    }
  }

  return {
    MyAppState,
    dispatch,
    _runTask,
    _taskFinished,
    _runNextTask,
    _nextTaskObsolete,
    checkIfNewDayAndPrepareEverythingAccordingly,
    createTask,
    updateTask,
    deleteTask,
  };
};
