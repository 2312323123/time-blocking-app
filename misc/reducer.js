export const initialState = {
  alive: false,
  testVariable: "not hehe",
  // from refactor:
  noTasksLeftForToday: false,
  isRunning: false,
  dbState: undefined,
  currentTaskIndex: undefined,
  currentTaskStart: undefined,
  currentTaskEnd: undefined,
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
    case "SET_NO_TASKS_LEFT_FOR_TODAY":
      return {
        ...state,
        noTasksLeftForToday: true,
      };

    default:
      return state;
  }
};
