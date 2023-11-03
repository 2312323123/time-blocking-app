import AsyncStorage from "@react-native-async-storage/async-storage";

const _isDaySet = async () => {
  try {
    const value = await AsyncStorage.getItem("DAY");
    if (typeof value !== undefined && value !== null) {
      // We have data!!
      return true;
    } else {
      return false;
    }
  } catch (error) {
    // Error retrieving data
    console.log("_isDaySet error");
  }
};

const _setDay = async (day) => {
  try {
    await AsyncStorage.setItem("DAY", day.toString());
  } catch (error) {
    // Error saving data
    console.log("_setDay error");
  }
};

const _getDay = async () => {
  try {
    const value = await AsyncStorage.getItem("DAY");
    if (typeof value !== undefined && value !== null) {
      // We have data!!
      return parseInt(value);
    } else {
      return null;
    }
  } catch (error) {
    // Error retrieving data
    console.log("_getDay error");
  }
};

const _deleteDay = async () => {
  try {
    await AsyncStorage.removeItem("DAY");
  } catch (error) {
    // Error saving data
    console.log("_deleteDay error");
  }
};

const _deleteTask = async (index) => {
  try {
    const tasks = await _retrieveTaskList();
    console.log("tasks before splice: ", tasks);
    tasks.splice(index, 1);
    console.log("tasks after splice: ", tasks);
    await AsyncStorage.setItem("TASKS", JSON.stringify(tasks));
  } catch (error) {
    // Error saving data
    console.log("_deleteTask error");
  }
};

const _getTaskByIndex = async (index) => {
  try {
    const tasks = await _retrieveTaskList();
    return tasks[index];
  } catch (error) {
    // Error saving data
    console.log("_getTaskByIndex error");
  }
};

// const _editTask = async (
//   index,
//   newName,
//   time_hours,
//   time_minutes,
//   duration,
//   done
// ) => {
//   try {
//     const tasks = await _retrieveTaskList();
//     if (typeof time_hours !== "number") {
//       time_hours = 0;
//     }
//     if (typeof time_minutes !== "number") {
//       time_minutes = 0;
//     }
//     if (typeof duration !== "number") {
//       duration = 0;
//     }
//     if (time_hours < 0 || time_hours > 23) {
//       time_hours = 0;
//     }
//     if (time_minutes < 0 || time_minutes > 59) {
//       time_minutes = 0;
//     }
//     if (typeof done !== "boolean") {
//       done = false;
//     }

//     const myTask = tasks[index];
//     if (typeof myTask !== "undefined" && myTask !== null) {
//       myTask.name = newName;
//       myTask.time_hours = time_hours;
//       myTask.time_minutes = time_minutes;
//       myTask.duration = duration;
//       myTask.done = done;
//     }

//     await _sortTaskList();

//     await AsyncStorage.setItem("TASKS", JSON.stringify(tasks));
//   } catch (error) {
//     // Error saving data
//     console.log("_editTask error");
//   }
// };

// const _createTask = async (
//   name,
//   time_hours,
//   time_minutes,
//   duration,
//   done = false
// ) => {
//   try {
//     const tasks = await _retrieveTaskList();
//     if (typeof time_hours !== "number") {
//       time_hours = 0;
//     }
//     if (typeof time_minutes !== "number") {
//       time_minutes = 0;
//     }
//     if (typeof duration !== "number") {
//       duration = 0;
//     }
//     if (time_hours < 0 || time_hours > 23) {
//       time_hours = 0;
//     }
//     if (time_minutes < 0 || time_minutes > 59) {
//       time_minutes = 0;
//     }
//     if (typeof done !== "boolean") {
//       done = false;
//     }
//     tasks.push({ name, time_hours, time_minutes, duration, done });

//     await AsyncStorage.setItem("TASKS", JSON.stringify(tasks));

//     await _sortTaskList();
//   } catch (error) {
//     // Error saving data
//     console.log("_createTask error");
//   }
// };

const _retrieveTaskList = async (fromNewDayStarted = false) => {
  if (!fromNewDayStarted) {
    // to prevent infinite loop
    const day = await _getDay();

    if (day !== new Date().getDate()) {
      await _newDayStarted();
    }
  }

  try {
    const value = await AsyncStorage.getItem("TASKS");
    if (typeof value !== undefined && value !== null) {
      const tasks = JSON.parse(value);
      // array of objects like [{name: 'task1', time_hours: 1, time_minutes: 30, duration: 30, done: false}, ...]
      return tasks;
    } else {
      return [];
    }
  } catch (error) {
    // Error retrieving data
    console.log("_retrieveTaskList error");
    return [];
  }
};

const _deleteTaskList = async () => {
  try {
    await AsyncStorage.removeItem("TASKS");
  } catch (error) {
    // Error saving data
    console.log("_deleteTaskList error");
  }
};

const _sortTaskList = async () => {
  try {
    const tasks = await _retrieveTaskList();
    tasks.sort((a, b) => {
      if (a.time_hours < b.time_hours) {
        return -1;
      } else if (a.time_hours > b.time_hours) {
        return 1;
      } else {
        if (a.time_minutes < b.time_minutes) {
          return -1;
        } else if (a.time_minutes > b.time_minutes) {
          return 1;
        } else {
          return 0;
        }
      }
    });
    await AsyncStorage.setItem("TASKS", JSON.stringify(tasks));
  } catch (error) {
    // Error saving data
    console.log("_sortTaskList error");
  }
};

const _newDayStarted = async () => {
  try {
    const tasks = await _retrieveTaskList(true);
    const newTasks = tasks.map((task) => {
      task.done = false;
      return task;
    });
    await AsyncStorage.setItem("TASKS", JSON.stringify(newTasks));
    await _deleteCurrentTaskInfo();
    await _setDay(new Date().getDate());
  } catch (error) {
    // Error saving data
    console.log("_newDayStarted error");
  }
};

const _getCurrentTask = async () => {
  // returns false if done for the day, otherwise returns the current task
  try {
    const tasks = await _retrieveTaskList();

    // return tasks;
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
  } catch (error) {
    // Error saving data
    console.log("_getCurrentTask error");
  }
};

const _getNextTask = async () => {
  // returns false if done for the day, otherwise returns the next task
  try {
    const tasks = await _retrieveTaskList();
    const now = new Date();
    const compareStart = new Date();

    const nextTaskIndex = tasks.findIndex((task) => {
      compareStart.setHours(task.time_hours, task.time_minutes, 0, 0);
      return now < compareStart && !task.done;
    });

    if (nextTaskIndex === -1) {
      return undefined;
    } else {
      const formattedTask = {};
      formattedTask.name = tasks[nextTaskIndex].name;

      const nextTask = { ...tasks[nextTaskIndex], index: nextTaskIndex };
      return nextTask;
    }
  } catch (error) {
    // Error saving data
    console.log("_getNextTask error");
  }
};

const _toTimeString = (task) => {
  const hours = task.time_hours.toString().padStart(2, "0");
  const minutes = task.time_minutes.toString().padStart(2, "0");
  const endHours = (
    Math.floor(task.time_hours + (task.time_minutes + task.duration) / 60) % 24
  )
    .toString()
    .padStart(2, "0");
  const endMinutes = ((task.time_minutes + task.duration) % 60)
    .toString()
    .padStart(2, "0");

  return `${hours}:${minutes} - ${endHours}:${endMinutes}`;
};

const _setCurrentTaskInfo = async (
  index,
  start_hours,
  start_minutes,
  end_hours,
  end_minutes
) => {
  try {
    await Promise.all([
      AsyncStorage.setItem("CURRENT_TASK_INDEX", index.toString()),
      AsyncStorage.setItem("CURRENT_TASK_START_HOURS", start_hours.toString()),
      AsyncStorage.setItem(
        "CURRENT_TASK_START_MINUTES",
        start_minutes.toString()
      ),
      AsyncStorage.setItem("CURRENT_TASK_END_HOURS", end_hours.toString()),
      AsyncStorage.setItem("CURRENT_TASK_END_MINUTES", end_minutes.toString()),
    ]);
  } catch (error) {
    console.log("index: ", index);
    console.log("start_hours: ", start_hours);
    console.log("start_minutes: ", start_minutes);
    console.log("end_hours: ", end_hours);
    console.log("end_minutes: ", end_minutes);
    // Error saving data
    console.log("_setCurrentTaskInfo error");
  }
};

const _getCurrentTaskInfo = async () => {
  try {
    let [index, start_hours, start_minutes, end_hours, end_minutes] =
      await Promise.all([
        AsyncStorage.getItem("CURRENT_TASK_INDEX"),
        AsyncStorage.getItem("CURRENT_TASK_START_HOURS"),
        AsyncStorage.getItem("CURRENT_TASK_START_MINUTES"),
        AsyncStorage.getItem("CURRENT_TASK_END_HOURS"),
        AsyncStorage.getItem("CURRENT_TASK_END_MINUTES"),
      ]);

    [index, start_hours, start_minutes, end_hours, end_minutes] = [
      parseInt(index),
      parseInt(start_hours),
      parseInt(start_minutes),
      parseInt(end_hours),
      parseInt(end_minutes),
    ];

    if (!isNaN(index)) {
      return {
        index,
        start_hours,
        start_minutes,
        end_hours,
        end_minutes,
      };
    } else {
      return undefined;
    }
  } catch (error) {
    // Error retrieving data
    console.log("_getCurrentTaskIndex error");
  }
};

const _deleteCurrentTaskInfo = async () => {
  try {
    await Promise.all([
      AsyncStorage.removeItem("CURRENT_TASK_INDEX"),
      AsyncStorage.removeItem("CURRENT_TASK_START_HOURS"),
      AsyncStorage.removeItem("CURRENT_TASK_START_MINUTES"),
      AsyncStorage.removeItem("CURRENT_TASK_END_HOURS"),
      AsyncStorage.removeItem("CURRENT_TASK_END_MINUTES"),
    ]);
  } catch (error) {
    // Error saving data
    console.log("_resetCurrentTaskIndex error");
  }
};

// refactor:
const _setNewDay = async () => {
  try {
    await AsyncStorage.setItem(
      "TIME_BLOCKING_APP_DAY",
      new Date().toISOString().substring(0, 10)
    );
  } catch (error) {
    // Error saving data
    console.log("_setNewDay error");
  }
};

const _isNewDay = async () => {
  try {
    const value = await AsyncStorage.getItem("TIME_BLOCKING_APP_DAY");
    if (typeof value !== undefined && value !== null) {
      const today = new Date().toISOString().substring(0, 10);
      return value !== today;
    } else {
      return true;
    }
  } catch (error) {
    // Error retrieving data
    console.log("_isNewDay error");
  }
};

const _setTaskList = async (taskList) => {
  try {
    await AsyncStorage.setItem(
      "TIME_BLOCKING_APP_TASKS",
      JSON.stringify(taskList)
    );
  } catch (error) {
    // Error saving data
    console.log("_setTaskList error");
  }
};

const _getTaskList = async () => {
  try {
    const value = await AsyncStorage.getItem("TIME_BLOCKING_APP_TASKS");
    if (typeof value !== undefined && value !== null) {
      return JSON.parse(value);
      // return [
      //   {
      //     name: "proof of concept, dbAPI.js 440",
      //     time_hours: 12,
      //     time_minutes: 1,
      //     duration: 5,
      //     done: false,
      //   },
      //   {
      //     name: "proof of concept 2, dbAPI.js 440",
      //     time_hours: 12,
      //     time_minutes: 1,
      //     duration: 5,
      //     done: false,
      //   },
      // ];
    } else {
      return [];
    }
  } catch (error) {
    // Error retrieving data
    console.log("_getTaskList error");
  }
};

const _setRunningTask = async (runningTaskInfo) => {
  // runningTaskInfo: {index: Int, start_hours: Int, start_minutes: Int} or undefined
  try {
    if (typeof runningTaskInfo === "undefined" || runningTaskInfo === null) {
      await AsyncStorage.removeItem("TIME_BLOCKING_APP_RUNNING_TASK");
      return;
    }

    const { index, start_hours, start_minutes } = runningTaskInfo;

    if (
      typeof index !== "number" ||
      typeof start_hours !== "number" ||
      typeof start_minutes !== "number"
    ) {
      console.log(JSON.stringify(runningTaskInfo));
      throw "index, start_hours, and start_minutes must be numbers";
    }
    await AsyncStorage.setItem(
      "TIME_BLOCKING_APP_RUNNING_TASK",
      JSON.stringify(runningTaskInfo)
    );
  } catch (error) {
    // Error saving data
    console.log("_setRunningTask error");
  }
};

const _getRunningTask = async () => {
  // returns {index, start_hours, start_minutes} or undefined
  try {
    const value = await AsyncStorage.getItem("TIME_BLOCKING_APP_RUNNING_TASK");
    if (typeof value !== undefined && value !== null) {
      return JSON.parse(value);
    } else {
      return undefined;
    }
  } catch (error) {
    // Error retrieving data
    console.log("_getRunningTask error");
  }
};

// const _createTask = async (
//   taskList,
//   name,
//   time_hours,
//   time_minutes,
//   duration,
//   done = false,
//   atIndex
// ) => {
//   try {
//     const theTaskList = structuredClone(taskList);

//     theTaskList.splice(atIndex, 0, {
//       name,
//       time_hours,
//       time_minutes,
//       duration,
//       done,
//     });

//     await _setTaskList(theTaskList);
//   } catch (error) {
//     // Error saving data
//     console.log("_createTask error");
//   }
// };

const _editTask = async (
  index,
  newName,
  time_hours,
  time_minutes,
  duration,
  done
) => {
  try {
    const tasks = await _retrieveTaskList();
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

    const myTask = tasks[index];
    if (typeof myTask !== "undefined" && myTask !== null) {
      myTask.name = newName;
      myTask.time_hours = time_hours;
      myTask.time_minutes = time_minutes;
      myTask.duration = duration;
      myTask.done = done;
    }

    // await _sortTaskList();

    await AsyncStorage.setItem("TASKS", JSON.stringify(tasks));
  } catch (error) {
    // Error saving data
    console.log("_editTask error");
  }
};

export {
  // _isDaySet,
  // _setDay,
  // _getDay,
  // _deleteDay,
  // _deleteTask,
  // _getTaskByIndex,
  // // _editTask,
  // // _createTask,
  // _retrieveTaskList,
  // _deleteTaskList,
  // _sortTaskList,
  // _newDayStarted, // any sense to export this?, called automatically from _retrieveTaskList
  // _getCurrentTask,
  // _getNextTask,
  _toTimeString,
  // _setCurrentTaskInfo,
  // _getCurrentTaskInfo,
  // _deleteCurrentTaskInfo,
  // refactor:
  _setNewDay,
  _isNewDay,
  _setTaskList,
  _getTaskList,
  _setRunningTask,
  _getRunningTask,
  // _createTask,
  _editTask,
};
