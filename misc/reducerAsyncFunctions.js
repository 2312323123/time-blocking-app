import { _retrieveTaskList, _getCurrentTaskInfo } from "./dbAPI";

export const _updateDbState = async (dispatch) => {
  const tasks = await _retrieveTaskList();
  dispatch({ type: "UPDATE_DBSTATE", payload: tasks });
};

export const _updateCurrentTask = async (dispatch) => {
  const currentTaskInfo = await _getCurrentTaskInfo();
  dispatch({ type: "UPDATE_CURRENTTASK", payload: currentTaskInfo });
};
