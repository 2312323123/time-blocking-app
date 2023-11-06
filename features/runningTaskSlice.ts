import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ParsedNoDaysNoNullTask {
  name: string;
  startTime: Date;
  endTime: Date;
  done: boolean;
}

interface SetTaskState {
  runningTaskId: number;
  runningTaskStartTime: Date;
  runningTaskTask: ParsedNoDaysNoNullTask;
  timeRemaining: number;
}

/* unsetTaskState stuff */

interface UnsetTaskStatePart1 {
  runningTaskTask: null;
  timeRemaining: null;
}

interface UnsetTaskStatePart2 {
  runningTaskTask: ParsedNoDaysNoNullTask;
  timeRemaining: number;
}

type UnsetTaskStatePart1_2Combined = UnsetTaskStatePart1 | UnsetTaskStatePart2;

type UnsetTaskState = UnsetTaskStatePart1_2Combined & {
  runningTaskId: null;
  runningTaskStartTime: null;
};

/* result similar to:
interface UnsetTaskState {
  runningTaskId: null;
  runningTaskStartTime: null;
  // task when have next task already
  runningTaskTask: null | ParsedNoDaysNoNullTask;
  // number when have time for next task already
  timeRemaining: null | number;
}
*/

/* ----- */

export type RunningTaskState = SetTaskState | UnsetTaskState;

const initialState: RunningTaskState = {
  runningTaskId: null,
  runningTaskStartTime: null,
  runningTaskTask: null,
  timeRemaining: null,
};

const runningTaskSlice = createSlice({
  name: "database",
  initialState,
  reducers: {
    setRunningTask(state, action: PayloadAction<SetTaskState>) {
      state.runningTaskId = action.payload.runningTaskId;
      state.runningTaskTask = action.payload.runningTaskTask;
      state.runningTaskStartTime = action.payload.runningTaskStartTime;
      state.timeRemaining = action.payload.timeRemaining;
    },
    unsetRunningTask(state, action: PayloadAction<UnsetTaskState>) {
      state.runningTaskId = null;
      state.runningTaskStartTime = null;
      state.runningTaskTask = action.payload.runningTaskTask;
      state.timeRemaining = action.payload.timeRemaining;
    },
    updateTimeRemaining(state, action: PayloadAction<number>) {
      state.timeRemaining = action.payload;
    },
    // fetchDataSuccess(state, action: PayloadAction<any[]>) {
    //   state.loading = false;
    //   state.data = action.payload;
    // },
  },
});

export const { setRunningTask, unsetRunningTask, updateTimeRemaining } =
  runningTaskSlice.actions;

export default runningTaskSlice.reducer;
