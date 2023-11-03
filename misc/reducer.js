export const initialState = {
  alive: false,
  // from another refactor:
  taskList: undefined, // :Array of Objects
  noTasksLeftForToday: false, // :Bool
  isRunning: true, // :Bool
  currentTaskIndex: undefined, // :Int
  currentTaskStart: undefined, // :Date
  currentTaskEnd: undefined, // :Date
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_ALIVE":
      return {
        ...state,
        alive: true,
      };
    case "DED":
      return {
        ...state,
        alive: false,
      };
    case "UPDATE_TEST_VARIABLE":
      return {
        ...state,
        testVariable: "hehe",
      };
    case "SET_TEST_VARIABLE":
      return {
        ...state,
        testVariable: action.payload,
      };

    case "RERENDER_DB_STATE":
      return {
        ...state,
        dbState: state.dbState,
      };
    // from refactor:
    case "UPDATE_DB_STATE":
      console.log("reducer UPDATE_DB_STATE");
      return {
        ...state,
        dbState: action.payload,
      };
    case "UPDATE_CURRENT_TASK":
      const currentTaskInfo = action.payload;

      let index, start_hours, start_minutes, end_hours, end_minutes;

      if (typeof currentTaskInfo !== "undefined" && currentTaskInfo !== null) {
        ({ index, start_hours, start_minutes, end_hours, end_minutes } =
          currentTaskInfo);
      }

      if (typeof index !== "undefined" && index !== null) {
        const start = new Date();
        start.setHours(start_hours);
        start.setMinutes(start_minutes);

        const end = new Date();
        end.setHours(end_hours, end_minutes, 0, 0);

        return {
          ...state,
          currentTaskIndex: index,
          currentTaskStart: start,
          currentTaskEnd: end,
        };
      } else {
        return {
          ...state,
          currentTaskIndex: undefined,
          currentTaskStart: undefined,
          currentTaskEnd: undefined,
        };
      }
    case "UPDATE_IS_RUNNING":
      return {
        ...state,
        isRunning: action.payload,
      };

    // newer
    case "SET_RUNNING_TASK":
      return {
        ...state,
        isRunning: true,
        currentTaskIndex: action.payload.currentTaskIndex,
        currentTaskStart: action.payload.currentTaskStart,
        currentTaskEnd: action.payload.currentTaskEnd,
      };
    case "SET_NEXT_TASK":
      return {
        ...state,
        isRunning: false,
        currentTaskIndex: action.payload.currentTaskIndex,
        currentTaskStart: action.payload.currentTaskStart,
        currentTaskEnd: action.payload.currentTaskEnd,
      };
    case "UNSET_RUNNING_TASK":
      return {
        ...state,
        isRunning: false,
        currentTaskIndex: undefined,
        currentTaskStart: undefined,
        currentTaskEnd: undefined,
      };

    // newest
    case "INITIAL_LOAD":
      return {
        ...state,
        alive: true,
        taskList: action.payload.taskList,
        noTasksLeftForToday: action.payload.noTasksLeftForToday,
        isRunning: action.payload.isRunning,
      };
    case "RUN_TASK":
      if (action.payload.taskListChanged) {
        return {
          ...state,
          taskList: action.payload.taskList,
          noTasksLeftForToday: false,
          isRunning: true,
        };
      } else {
        return {
          ...state,
          noTasksLeftForToday: false,
          isRunning: true,
        };
      }
    case "TASK_FINISHED":
      return {
        ...state,
        taskList: action.payload.taskList,
        noTasksLeftForToday: action.payload.noTasksLeftForToday,
        isRunning: action.payload.isRunning,
      };
    case "RUN_NEXT_TASK":
      if (action.payload.movePermanently) {
        return {
          ...state,
          taskList: action.payload.taskList,
          noTasksLeftForToday: false,
          isRunning: true,
        };
      } else {
        return {
          ...state,
          noTasksLeftForToday: false,
          isRunning: true,
        };
      }
    case "NEXT_TASK_OBSOLETE":
      return {
        ...state,
        noTasksLeftForToday: action.payload.noTasksLeftForToday,
        isRunning: action.payload.isRunning,
      };
    case "TASK_CREATED":
      if (action.payload.newNextTask) {
        return {
          ...state,
          taskList: action.payload.taskList,
          noTasksLeftForToday: false,
        };
      } else {
        return {
          ...state,
          taskList: action.payload.taskList,
        };
      }
    case "TASK_EDITED": {
      const { taskList, isRunning, noTasksLeftForToday } = action.payload;

      return {
        ...state,
        taskList,
        isRunning,
        noTasksLeftForToday,
      };
    }
    case "TASK_DELETED": {
      const { taskList, isRunning, noTasksLeftForToday } = action.payload;

      return {
        ...state,
        taskList: taskList,
        isRunning:
          typeof isRunning !== "undefined" && isRunning !== null
            ? isRunning
            : state.isRunning,
        noTasksLeftForToday:
          typeof noTasksLeftForToday !== "undefined" &&
          noTasksLeftForToday !== null
            ? noTasksLeftForToday
            : state.noTasksLeftForToday,
      };
    }

    default:
      return state;
  }
};
