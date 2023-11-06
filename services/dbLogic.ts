import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";

interface InsertTask {
  name: string;
  startTime: string;
  endTime: string;
  done: boolean;
  days: boolean[];
}

interface NoDaysNoNullIdTask {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  done: boolean;
}

type NoDaysTask = NoDaysNoNullIdTask | null;

interface FullTask extends NoDaysTask {
  days: boolean[];
}

type Task = FullTask | null;

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

export const db = openDatabase();

function dbReset(): void {
  db.transaction(
    (tx) => {
      tx.executeSql(`drop table if exists Task`, []);
      tx.executeSql(`drop table if exists RepeatSchedule`, []);
    },
    null,
    () => {
      console.log("dbReset successfull");
      dbInit(() => console.log("init from dbReset finished"));
    }
  );

  return;
}

function dbInit(callback: () => void): void {
  db.transaction(
    (tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS Task (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, startTime TIME NOT NULL, endTime TIME NOT NULL, done BOOLEAN DEFAULT 0);"
      );
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS RepeatSchedule (id INTEGER PRIMARY KEY AUTOINCREMENT, taskId INTEGER, dayOfWeek INTEGER, FOREIGN KEY (taskId) REFERENCES Task(id));"
      );
    },
    null,
    callback
  );

  return;
}

function insertTasks(tasks: InsertTask[]): void {
  db.transaction((tx) => {
    for (const task of tasks) {
      tx.executeSql(
        "INSERT INTO Task (name, startTime, endTime, done) VALUES(?, ?, ?, ?);",
        [task.name, task.startTime, task.endTime, Number(task.done)],
        (_, { insertId }) => {
          task.days.forEach((day, index) => {
            if (day) {
              tx.executeSql(
                "INSERT INTO RepeatSchedule (taskId, dayOfWeek) VALUES(?, ?);",
                [insertId, index]
              );
              tx.executeSql("select * from RepeatSchedule", [], (_, { rows }) =>
                console.log(JSON.stringify(rows))
              );
            }
          });
        }
      );
    }
  });

  return;
}

const parseTimeStringToDate = (timeString: string) => {
  const [hours, minutes, seconds] = timeString.split(":");
  const date = new Date();
  date.setHours(Number(hours));
  date.setMinutes(Number(minutes));
  date.setSeconds(Number(seconds));
  return date;
};

function getTimeLeft(
  id: number,
  start: Date,
  callback: (arg0: number, arg1: NoDaysTask) => void
) {
  db.transaction((tx) => {
    tx.executeSql("select * from Task where id=?", [id], (_, { rows }) => {
      console.log(JSON.stringify(rows), "hi");
      const { startTime, endTime } = rows.item(0);
      const parsedStartTime = parseTimeStringToDate(startTime);
      const parsedEndTime = parseTimeStringToDate(endTime);
      const durationMillis =
        parsedEndTime.getTime() - parsedStartTime.getTime();
      callback(
        // seemed weird after some time:
        // Math.round(
        //   (durationMillis - (start.getTime() - parsedStartTime.getTime())) /
        //     1000
        // ),
        Math.round((start.getTime() + durationMillis - Date.now()) / 1000),
        rows.item(0)
      );
    });
    // tx.executeSql(
    //   "CREATE TABLE IF NOT EXISTS RepeatSchedule (id INTEGER PRIMARY KEY AUTOINCREMENT, taskId INTEGER, dayOfWeek INTEGER, FOREIGN KEY (taskId) REFERENCES Task(id));"
    // );
  });
}

function getTimeUntilNextTask(
  callback: (arg0: number, arg1: NoDaysTask) => void
) {
  // returns arg0: -1 if no tasks left
  // returns arg0: 0 if task is currently active
  // returns arg0: positive number of seconds if task is in the future

  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM Task WHERE endTime > strftime('%H:%M:%S', 'now', 'localtime') ORDER BY endTime ASC LIMIT 1;",
      [],
      (_, { rows }) => {
        console.log(JSON.stringify(rows), "Hi");

        if (
          typeof rows.item(0) !== "undefined" &&
          rows.item(0).startTime !== null
        ) {
          if (
            parseTimeStringToDate(rows.item(0).startTime).getTime() >
            new Date().getTime()
          ) {
            callback(
              Math.round(
                (parseTimeStringToDate(rows.item(0).startTime).getTime() -
                  Date.now()) /
                  1000
              ),
              rows.item(0)
            );
          } else {
            callback(0, rows.item(0));
          }
        } else {
          callback(-1, null);
        }
      }
    );
  });
}

export {
  parseTimeStringToDate,
  getTimeLeft,
  getTimeUntilNextTask,
  dbReset,
  dbInit,
  insertTasks,
};
