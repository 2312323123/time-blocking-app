export const LOAD_DATA_SUCCESS = "LOAD_DATA_SUCCESS";

export const loadDataSuccess = (data) => ({
  type: LOAD_DATA_SUCCESS,
  payload: data,
});

import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("time-blocking-app.db");
  return db;
}

const db = openDatabase();

export const loadDataFromSQLite = () => {
  return (dispatch) => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM YourTable", [], (_, { rows: _array }) => {
        // const data = rows.raw();
        // dispatch(loadDataSuccess(data));
        dispatch(loadDataSuccess(_array));
      });
    });
  };
};
