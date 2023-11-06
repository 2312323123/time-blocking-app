interface Task {
  name: string;
  time_hours: number;
  time_minutes: number;
  duration: number;
  done: boolean;
}

interface AppRunState {
  noTasksLeftForToday: boolean;
  isRunning: boolean;
  currentTaskIndex: number | undefined;
  currentTaskStart: Date | undefined;
  currentTaskEnd: Date | undefined;
}

interface OverallAppState {
  alive: boolean;
  taskList: Task[] | undefined;
  appRunState: AppRunState;
}

export { Task, AppRunState, OverallAppState };
