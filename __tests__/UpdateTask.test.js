import { render, screen, userEvent, act } from "@testing-library/react-native";
import UpdateTask from "../__testfiles__/UpdateTask";
import App from "../__testfiles__/App";

describe("Update test", () => {
  // it("renders UpdateTask component", async () => {
  //   render(
  //     <UpdateTask
  //       initialState={{
  //         taskList: [
  //           {
  //             name: "Long task",
  //             time_hours: 1,
  //             time_minutes: 15,
  //             duration: 10,
  //             done: false,
  //           },
  //           {
  //             name: "Niego",
  //             time_hours: 7,
  //             time_minutes: 12,
  //             duration: 220,
  //             done: false,
  //           },
  //           {
  //             name: "Clean the room",
  //             time_hours: 10,
  //             time_minutes: 0,
  //             duration: 20,
  //             done: false,
  //           },
  //           {
  //             name: "Then",
  //             time_hours: 12,
  //             time_minutes: 0,
  //             duration: 3,
  //             done: false,
  //           },
  //           {
  //             name: "Not",
  //             time_hours: 12,
  //             time_minutes: 0,
  //             duration: 600,
  //             done: false,
  //           },
  //         ],
  //         // {name: , time_hours: , time_minutes: , duration: , done: },
  //         noTasksLeftForToday: false,
  //         isRunning: false,
  //         currentTaskIndex: 4,
  //         currentTaskStart: new Date(
  //           new Date().getFullYear(),
  //           new Date().getMonth(),
  //           new Date().getDate(),
  //           12,
  //           0,
  //           0,
  //           0
  //         ),
  //         currentTaskEnd: new Date(
  //           new Date().getFullYear(),
  //           new Date().getMonth(),
  //           new Date().getDate(),
  //           22,
  //           0,
  //           0,
  //           0
  //         ),
  //       }}
  //       updateData={{
  //         index: 0,
  //         newName: "hehe changed",
  //         time_hours: MyAppState.taskList[0].time_hours,
  //         time_minutes: MyAppState.taskList[0].time_minutes,
  //         duration: MyAppState.taskList[0].duration,
  //         done: MyAppState.taskList[0].done,
  //       }}
  //     />
  //   );

  //   screen.debug();

  //   await userEvent.press(screen.getByRole("button"));

  //   screen.debug();
  // });

  let case_1 = false;
  let case_2 = false;
  let case_3 = false;
  let case_4 = false;
  let case_5 = false;
  let case_6 = false;
  let case_7 = false;
  let case_8 = false;
  let case_70 = false;
  let case_71 = false;
  let case_72 = false;
  let case_73 = true;

  if (case_1)
    it("case 1", async () => {
      const initialState = {
        taskList: [
          {
            name: "Long task",
            time_hours: 1,
            time_minutes: 15,
            duration: 10,
            done: false,
          },
          {
            name: "Niego",
            time_hours: 7,
            time_minutes: 12,
            duration: 220,
            done: false,
          },
          {
            name: "Clean the room",
            time_hours: 10,
            time_minutes: 0,
            duration: 20,
            done: false,
          },
          {
            name: "Then",
            time_hours: 12,
            time_minutes: 0,
            duration: 3,
            done: false,
          },
          {
            name: "Not",
            time_hours: 12,
            time_minutes: 0,
            duration: 600,
            done: false,
          },
        ],
        // {name: , time_hours: , time_minutes: , duration: , done: },
        noTasksLeftForToday: false,
        isRunning: false,
        currentTaskIndex: 4,
        currentTaskStart: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          12,
          0,
          0,
          0
        ),
        currentTaskEnd: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          22,
          0,
          0,
          0
        ),
      };

      const updateData = {
        index: 0,
        newName: "hehe changed 1",
        time_hours: initialState.taskList[0].time_hours,
        time_minutes: initialState.taskList[0].time_minutes,
        duration: initialState.taskList[0].duration,
        done: initialState.taskList[0].done,
      };

      render(
        <UpdateTask initialState={initialState} updateData={updateData} />
      );

      // screen.debug();

      await userEvent.press(screen.getByRole("button"));

      // screen.debug();

      // expect(screen.getByText(/Searches for JavaScript/)).toBeInTheDocument();

      expect(
        screen.getByText(
          /task 0:\s*{"name":"hehe changed 1","time_hours":1,"time_minutes":15,"duration":10,"done":false}/
        )
      ).toBeTruthy();

      expect(screen.getByText(/noTasksLeftForToday:\s*false/)).toBeTruthy();

      expect(screen.getByText(/isRunning:\s*false/)).toBeTruthy();

      expect(screen.getByText(/currentTaskIndex:\s*4/)).toBeTruthy();

      expect(
        screen.getByText(
          new RegExp(
            `currentTaskStart:\\s*${JSON.stringify(
              initialState.currentTaskStart
            )}`
          )
        )
      ).toBeTruthy();

      expect(
        screen.getByText(
          new RegExp(
            `currentTaskEnd:\\s*${JSON.stringify(initialState.currentTaskEnd)}`
          )
        )
      ).toBeTruthy();
    });
  if (case_2)
    it("case 2", async () => {
      const initialState = {
        taskList: [
          {
            name: "Long task",
            time_hours: 0,
            time_minutes: 0,
            duration: 1429,
            done: false,
          },
          {
            name: "Niego",
            time_hours: 7,
            time_minutes: 12,
            duration: 220,
            done: false,
          },
          {
            name: "Clean the room",
            time_hours: 10,
            time_minutes: 0,
            duration: 20,
            done: false,
          },
          {
            name: "Then",
            time_hours: 12,
            time_minutes: 0,
            duration: 3,
            done: false,
          },
          {
            name: "Not",
            time_hours: 12,
            time_minutes: 0,
            duration: 600,
            done: false,
          },
        ],
        // {name: , time_hours: , time_minutes: , duration: , done: },
        noTasksLeftForToday: false,
        isRunning: true,
        currentTaskIndex: 0,
        currentTaskStart: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          0,
          0,
          0,
          0
        ),
        currentTaskEnd: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          23,
          49,
          0,
          0
        ),
      };

      const updateData = {
        index: 0,
        newName: "hehe changed 2",
        time_hours: initialState.taskList[0].time_hours,
        time_minutes: initialState.taskList[0].time_minutes,
        duration: initialState.taskList[0].duration + 1,
        done: initialState.taskList[0].done,
      };

      render(
        <UpdateTask initialState={initialState} updateData={updateData} />
      );

      // screen.debug();

      await userEvent.press(screen.getByRole("button"));

      // screen.debug();

      // expect(screen.getByText(/Searches for JavaScript/)).toBeInTheDocument();

      expect(
        screen.getByText(
          /task 0:\s*{"name":"hehe changed 2","time_hours":0,"time_minutes":0,"duration":1430,"done":false}/
        )
      ).toBeTruthy();

      expect(screen.getByText(/noTasksLeftForToday:\s*false/)).toBeTruthy();

      expect(screen.getByText(/isRunning:\s*true/)).toBeTruthy();

      expect(screen.getByText(/currentTaskIndex:\s*0/)).toBeTruthy();

      expect(
        screen.getByText(
          new RegExp(
            `currentTaskStart:\\s*${JSON.stringify(
              initialState.currentTaskStart
            )}`
          )
        )
      ).toBeTruthy();

      const newCurrentTaskEnd = new Date(initialState.currentTaskEnd);
      newCurrentTaskEnd.setMinutes(newCurrentTaskEnd.getMinutes() + 1);

      expect(
        screen.getByText(
          new RegExp(`currentTaskEnd:\\s*${JSON.stringify(newCurrentTaskEnd)}`)
        )
      ).toBeTruthy();
    });
  if (case_3)
    it("case 3", async () => {
      const initialState = {
        taskList: [
          {
            name: "Long task",
            time_hours: 0,
            time_minutes: 0,
            duration: 1429,
            done: false,
          },
          {
            name: "Niego",
            time_hours: 0,
            time_minutes: 1,
            duration: 2,
            done: false,
          },
          {
            name: "Clean the room",
            time_hours: 23,
            time_minutes: 55,
            duration: 3,
            done: false,
          },
          {
            name: "Then",
            time_hours: 0,
            time_minutes: 1,
            duration: 1,
            done: false,
          },
          {
            name: "Not",
            time_hours: 0,
            time_minutes: 1,
            duration: 1,
            done: false,
          },
        ],
        // {name: , time_hours: , time_minutes: , duration: , done: },
        noTasksLeftForToday: false,
        isRunning: true,
        currentTaskIndex: 0,
        currentTaskStart: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          0,
          0,
          0,
          0
        ),
        currentTaskEnd: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          23,
          49,
          0,
          0
        ),
      };

      const updateData = {
        index: 0,
        newName: "hehe changed 3",
        time_hours: initialState.taskList[0].time_hours,
        time_minutes: initialState.taskList[0].time_minutes,
        duration: 1,
        done: initialState.taskList[0].done,
      };

      render(
        <UpdateTask initialState={initialState} updateData={updateData} />
      );

      // screen.debug();

      await userEvent.press(screen.getByRole("button"));

      // screen.debug();

      // expect(screen.getByText(/Searches for JavaScript/)).toBeInTheDocument();

      expect(
        screen.getByText(
          /task 0:\s*{"name":"hehe changed 3","time_hours":0,"time_minutes":0,"duration":1,"done":true}/
        )
      ).toBeTruthy();

      expect(screen.getByText(/noTasksLeftForToday:\s*false/)).toBeTruthy();

      expect(screen.getByText(/isRunning:\s*false/)).toBeTruthy();

      expect(screen.getByText(/currentTaskIndex:\s*2/)).toBeTruthy();

      expect(
        screen.getByText(
          new RegExp(
            `currentTaskStart:\\s*${JSON.stringify(
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate(),
                23,
                55,
                0,
                0
              )
            )}`
          )
        )
      ).toBeTruthy();

      expect(
        screen.getByText(
          new RegExp(
            `currentTaskEnd:\\s*${JSON.stringify(
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate(),
                23,
                58,
                0,
                0
              )
            )}`
          )
        )
      ).toBeTruthy();
    });
  if (case_4)
    it("case 4", async () => {
      const initialState = {
        taskList: [
          {
            name: "Long task",
            time_hours: 0,
            time_minutes: 0,
            duration: 1429,
            done: false,
          },
          {
            name: "Niego",
            time_hours: 0,
            time_minutes: 1,
            duration: 2,
            done: false,
          },
          {
            name: "Clean the room",
            time_hours: 0,
            time_minutes: 1,
            duration: 1,
            done: false,
          },
          {
            name: "Then",
            time_hours: 0,
            time_minutes: 1,
            duration: 1,
            done: false,
          },
          {
            name: "Not",
            time_hours: 0,
            time_minutes: 1,
            duration: 1,
            done: false,
          },
        ],
        // {name: , time_hours: , time_minutes: , duration: , done: },
        noTasksLeftForToday: false,
        isRunning: true,
        currentTaskIndex: 0,
        currentTaskStart: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          0,
          0,
          0,
          0
        ),
        currentTaskEnd: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          23,
          49,
          0,
          0
        ),
      };

      const updateData = {
        index: 0,
        newName: "hehe changed 4",
        time_hours: initialState.taskList[0].time_hours,
        time_minutes: initialState.taskList[0].time_minutes,
        duration: 1,
        done: initialState.taskList[0].done,
      };

      render(
        <UpdateTask initialState={initialState} updateData={updateData} />
      );

      // screen.debug();

      await userEvent.press(screen.getByRole("button"));

      // screen.debug();

      // expect(screen.getByText(/Searches for JavaScript/)).toBeInTheDocument();

      expect(
        screen.getByText(
          /task 0:\s*{"name":"hehe changed 4","time_hours":0,"time_minutes":0,"duration":1,"done":true}/
        )
      ).toBeTruthy();

      expect(screen.getByText(/noTasksLeftForToday:\s*true/)).toBeTruthy();

      expect(screen.getByText(/isRunning:\s*false/)).toBeTruthy();

      expect(screen.getByText(/currentTaskIndex:\s*undefined/)).toBeTruthy();

      expect(
        screen.getByText(
          new RegExp(`currentTaskStart:\\s*${JSON.stringify(undefined)}`)
        )
      ).toBeTruthy();

      expect(
        screen.getByText(
          new RegExp(`currentTaskEnd:\\s*${JSON.stringify(undefined)}`)
        )
      ).toBeTruthy();
    });
  if (case_5)
    it("case 5", async () => {
      const initialState = {
        taskList: [
          {
            name: "Long task",
            time_hours: 0,
            time_minutes: 0,
            duration: 1429,
            done: false,
          },
          {
            name: "Niego",
            time_hours: 7,
            time_minutes: 12,
            duration: 220,
            done: false,
          },
          {
            name: "Clean the room",
            time_hours: 10,
            time_minutes: 0,
            duration: 20,
            done: false,
          },
          {
            name: "Then",
            time_hours: 12,
            time_minutes: 0,
            duration: 3,
            done: false,
          },
          {
            name: "Not",
            time_hours: 12,
            time_minutes: 0,
            duration: 600,
            done: false,
          },
        ],
        // {name: , time_hours: , time_minutes: , duration: , done: },
        noTasksLeftForToday: false,
        isRunning: true,
        currentTaskIndex: 0,
        currentTaskStart: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          0,
          0,
          0,
          0
        ),
        currentTaskEnd: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          23,
          49,
          0,
          0
        ),
      };

      const updateData = {
        index: 0,
        newName: "hehe changed 5",
        time_hours: 0,
        time_minutes: 1,
        duration: initialState.taskList[0].duration,
        done: initialState.taskList[0].done,
      };

      render(
        <UpdateTask initialState={initialState} updateData={updateData} />
      );

      // screen.debug();

      await userEvent.press(screen.getByRole("button"));

      // screen.debug();

      // expect(screen.getByText(/Searches for JavaScript/)).toBeInTheDocument();

      expect(
        screen.getByText(
          /task 0:\s*{"name":"hehe changed 5","time_hours":0,"time_minutes":1,"duration":1429,"done":false}/
        )
      ).toBeTruthy();

      expect(screen.getByText(/noTasksLeftForToday:\s*false/)).toBeTruthy();

      expect(screen.getByText(/isRunning:\s*true/)).toBeTruthy();

      expect(screen.getByText(/currentTaskIndex:\s*0/)).toBeTruthy();

      expect(
        screen.getByText(
          new RegExp(
            `currentTaskStart:\\s*${JSON.stringify(
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate(),
                0,
                1,
                0,
                0
              )
            )}`
          )
        )
      ).toBeTruthy();

      expect(
        screen.getByText(
          new RegExp(
            `currentTaskEnd:\\s*${JSON.stringify(
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate(),
                23,
                50,
                0,
                0
              )
            )}`
          )
        )
      ).toBeTruthy();
    });
  if (case_6)
    it("case 6", async () => {
      const initialState = {
        taskList: [
          {
            name: "Not",
            time_hours: 0,
            time_minutes: 1,
            duration: 1,
            done: false,
          },
          {
            name: "Long task",
            time_hours: 0,
            time_minutes: 2,
            duration: 1429,
            done: false,
          },
          {
            name: "Niego",
            time_hours: 0,
            time_minutes: 3,
            duration: 1429,
            done: false,
          },
          {
            name: "Clean the room",
            time_hours: 0,
            time_minutes: 4,
            duration: 1429,
            done: false,
          },
          {
            name: "Then",
            time_hours: 12,
            time_minutes: 0,
            duration: 3,
            done: false,
          },
        ],
        // {name: , time_hours: , time_minutes: , duration: , done: },
        noTasksLeftForToday: false,
        isRunning: true,
        currentTaskIndex: 1,
        currentTaskStart: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          0,
          2,
          0,
          0
        ),
        currentTaskEnd: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          23,
          51,
          0,
          0
        ),
      };

      const updateData = {
        index: 1,
        newName: "hehe changed 6",
        time_hours: 0,
        time_minutes: 5,
        duration: initialState.taskList[1].duration,
        done: initialState.taskList[1].done,
      };

      render(
        <UpdateTask initialState={initialState} updateData={updateData} />
      );

      // screen.debug();

      await userEvent.press(screen.getByRole("button"));

      // screen.debug();

      // expect(screen.getByText(/Searches for JavaScript/)).toBeInTheDocument();

      expect(
        screen.getByText(
          /task 3:\s*{"name":"hehe changed 6","time_hours":0,"time_minutes":5,"duration":1429,"done":false}/
        )
      ).toBeTruthy();

      expect(screen.getByText(/noTasksLeftForToday:\s*false/)).toBeTruthy();

      expect(screen.getByText(/isRunning:\s*true/)).toBeTruthy();

      expect(screen.getByText(/currentTaskIndex:\s*3/)).toBeTruthy();

      expect(
        screen.getByText(
          new RegExp(
            `currentTaskStart:\\s*${JSON.stringify(
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate(),
                0,
                5,
                0,
                0
              )
            )}`
          )
        )
      ).toBeTruthy();

      expect(
        screen.getByText(
          new RegExp(
            `currentTaskEnd:\\s*${JSON.stringify(
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate(),
                23,
                54,
                0,
                0
              )
            )}`
          )
        )
      ).toBeTruthy();
    });
  if (case_7)
    it("case 7", async () => {
      const initialState = {
        taskList: [
          {
            name: "Not",
            time_hours: 0,
            time_minutes: 1,
            duration: 1,
            done: false,
          },
          {
            name: "Niego",
            time_hours: 0,
            time_minutes: 3,
            duration: 1429,
            done: false,
          },
          {
            name: "Clean the room",
            time_hours: 0,
            time_minutes: 4,
            duration: 1429,
            done: false,
          },
          {
            name: "Long task",
            time_hours: 0,
            time_minutes: 5,
            duration: 1429,
            done: false,
          },
          {
            name: "Then",
            time_hours: 12,
            time_minutes: 0,
            duration: 3,
            done: false,
          },
        ],
        // {name: , time_hours: , time_minutes: , duration: , done: },
        noTasksLeftForToday: false,
        isRunning: true,
        currentTaskIndex: 3,
        currentTaskStart: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          0,
          5,
          0,
          0
        ),
        currentTaskEnd: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          23,
          54,
          0,
          0
        ),
      };

      const updateData = {
        index: 3,
        newName: "hehe changed 7",
        time_hours: 0,
        time_minutes: 2,
        duration: initialState.taskList[3].duration,
        done: initialState.taskList[3].done,
      };

      render(
        <UpdateTask initialState={initialState} updateData={updateData} />
      );

      // screen.debug();

      await userEvent.press(screen.getByRole("button"));

      // screen.debug();

      // expect(screen.getByText(/Searches for JavaScript/)).toBeInTheDocument();

      expect(
        screen.getByText(
          /task 1:\s*{"name":"hehe changed 7","time_hours":0,"time_minutes":2,"duration":1429,"done":false}/
        )
      ).toBeTruthy();

      expect(screen.getByText(/noTasksLeftForToday:\s*false/)).toBeTruthy();

      expect(screen.getByText(/isRunning:\s*true/)).toBeTruthy();

      expect(screen.getByText(/currentTaskIndex:\s*1/)).toBeTruthy();

      expect(
        screen.getByText(
          new RegExp(
            `currentTaskStart:\\s*${JSON.stringify(
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate(),
                0,
                2,
                0,
                0
              )
            )}`
          )
        )
      ).toBeTruthy();

      expect(
        screen.getByText(
          new RegExp(
            `currentTaskEnd:\\s*${JSON.stringify(
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate(),
                23,
                51,
                0,
                0
              )
            )}`
          )
        )
      ).toBeTruthy();
    });
  if (case_70)
    it("case 70", async () => {
      const initialState = {
        taskList: [
          {
            name: "Long task",
            time_hours: 0,
            time_minutes: 1,
            duration: 1429,
            done: false,
          },
          {
            name: "Not",
            time_hours: 0,
            time_minutes: 2,
            duration: 1,
            done: false,
          },
          {
            name: "Niego",
            time_hours: 0,
            time_minutes: 3,
            duration: 1,
            done: false,
          },
          {
            name: "Then",
            time_hours: 0,
            time_minutes: 5,
            duration: 1,
            done: false,
          },
        ],
        // {name: , time_hours: , time_minutes: , duration: , done: },
        noTasksLeftForToday: true,
        isRunning: false,
        currentTaskIndex: undefined,
        currentTaskStart: undefined,
        currentTaskEnd: undefined,
      };

      const updateData = {
        index: 0,
        newName: "hehe changed 70",
        time_minutes: initialState.taskList[0].time_hours,
        time_minutes: initialState.taskList[0].time_minutes,
        duration: 1429,
        done: initialState.taskList[0].done,
      };

      render(
        <UpdateTask initialState={initialState} updateData={updateData} />
      );

      // screen.debug();

      await userEvent.press(screen.getByRole("button"));

      // screen.debug();

      // expect(screen.getByText(/Searches for JavaScript/)).toBeInTheDocument();

      expect(
        screen.getByText(
          /task 0:\s*{"name":"hehe changed 70","time_hours":0,"time_minutes":1,"duration":1429,"done":false}/
        )
      ).toBeTruthy();

      expect(screen.getByText(/noTasksLeftForToday:\s*false/)).toBeTruthy();

      expect(screen.getByText(/isRunning:\s*false/)).toBeTruthy();

      expect(screen.getByText(/currentTaskIndex:\s*0/)).toBeTruthy();

      expect(
        screen.getByText(
          new RegExp(
            `currentTaskStart:\\s*${JSON.stringify(
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate(),
                initialState.taskList[0].time_hours,
                initialState.taskList[0].time_minutes,
                0,
                0
              )
            )}`
          )
        )
      ).toBeTruthy();

      expect(
        screen.getByText(
          new RegExp(
            `currentTaskEnd:\\s*${JSON.stringify(
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate(),
                initialState.taskList[0].time_hours,
                initialState.taskList[0].time_minutes +
                  initialState.taskList[0].duration,
                0,
                0
              )
            )}`
          )
        )
      ).toBeTruthy();
    });

  if (case_71)
    it("case 71", async () => {
      const initialState = {
        taskList: [
          {
            name: "Long task",
            time_hours: 0,
            time_minutes: 1,
            duration: 1,
            done: true,
          },
          {
            name: "Not",
            time_hours: 0,
            time_minutes: 2,
            duration: 1,
            done: false,
          },
          {
            name: "Niego",
            time_hours: 0,
            time_minutes: 3,
            duration: 1,
            done: false,
          },
          {
            name: "Then",
            time_hours: 0,
            time_minutes: 5,
            duration: 1,
            done: false,
          },
        ],
        noTasksLeftForToday: true,
        isRunning: false,
        currentTaskIndex: undefined,
        currentTaskStart: undefined,
        currentTaskEnd: undefined,
      };

      const updateData = {
        index: 0,
        newName: "hehe changed 71",
        time_minutes: initialState.taskList[0].time_hours,
        time_minutes: initialState.taskList[0].time_minutes,
        duration: 1429,
        done: initialState.taskList[0].done,
      };

      render(
        <UpdateTask initialState={initialState} updateData={updateData} />
      );

      const user = userEvent.setup({ delay: null });
      jest.useFakeTimers();
      await user.press(screen.getByRole("button"));
      act(() => {
        jest.runAllTimers();
      });

      expect(
        screen.getByText(
          /task 0:\s*{"name":"hehe changed 71","time_hours":0,"time_minutes":1,"duration":1429,"done":true}/
        )
      ).toBeTruthy();

      expect(screen.getByText(/noTasksLeftForToday:\s*true/)).toBeTruthy();

      expect(screen.getByText(/isRunning:\s*false/)).toBeTruthy();

      expect(screen.getByText(/currentTaskIndex:\s*undefined/)).toBeTruthy();

      expect(
        screen.getByText(new RegExp(`currentTaskStart:\\s*undefined`))
      ).toBeTruthy();

      expect(
        screen.getByText(new RegExp(`currentTaskEnd:\\s*undefined`))
      ).toBeTruthy();

      jest.useRealTimers();
    });
  if (case_72)
    it("case 72", async () => {
      const initialState = {
        taskList: [
          {
            name: "Long task",
            time_hours: 0,
            time_minutes: 1,
            duration: 1,
            done: false,
          },
          {
            name: "Not",
            time_hours: 0,
            time_minutes: 2,
            duration: 1,
            done: false,
          },
          {
            name: "Niego",
            time_hours: 0,
            time_minutes: 3,
            duration: 1,
            done: false,
          },
          {
            name: "Then",
            time_hours: 0,
            time_minutes: 5,
            duration: 1,
            done: false,
          },
        ],
        noTasksLeftForToday: true,
        isRunning: false,
        currentTaskIndex: undefined,
        currentTaskStart: undefined,
        currentTaskEnd: undefined,
      };

      const updateData = {
        index: 0,
        newName: "hehe changed 72",
        time_minutes: initialState.taskList[0].time_hours,
        time_minutes: initialState.taskList[0].time_minutes,
        duration: 1429,
        done: initialState.taskList[0].done,
      };

      render(
        <UpdateTask initialState={initialState} updateData={updateData} />
      );

      const user = userEvent.setup({ delay: null });
      jest.useFakeTimers();
      await user.press(screen.getByRole("button"));
      act(() => {
        jest.runAllTimers();
      });

      expect(
        screen.getByText(
          /task 0:\s*{"name":"hehe changed 72","time_hours":0,"time_minutes":1,"duration":1429,"done":false}/
        )
      ).toBeTruthy();

      expect(screen.getByText(/noTasksLeftForToday:\s*false/)).toBeTruthy();

      expect(screen.getByText(/isRunning:\s*false/)).toBeTruthy();

      expect(screen.getByText(/currentTaskIndex:\s*0/)).toBeTruthy();

      expect(
        screen.getByText(
          new RegExp(
            `currentTaskStart:\\s*${JSON.stringify(
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate(),
                initialState.taskList[0].time_hours,
                initialState.taskList[0].time_minutes,
                0,
                0
              )
            )}`
          )
        )
      ).toBeTruthy();

      expect(
        screen.getByText(
          new RegExp(
            `currentTaskEnd:\\s*${JSON.stringify(
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate(),
                initialState.taskList[0].time_hours,
                initialState.taskList[0].time_minutes + updateData.duration,
                0,
                0
              )
            )}`
          )
        )
      ).toBeTruthy();

      jest.useRealTimers();
    });
  if (case_73)
    it("case 73", async () => {
      const initialState = {
        taskList: [
          {
            name: "Long task",
            time_hours: 0,
            time_minutes: 1,
            duration: 1429,
            done: true,
          },
          {
            name: "Not",
            time_hours: 0,
            time_minutes: 2,
            duration: 1,
            done: false,
          },
          {
            name: "Niego",
            time_hours: 0,
            time_minutes: 3,
            duration: 1,
            done: false,
          },
          {
            name: "Then",
            time_hours: 0,
            time_minutes: 5,
            duration: 1,
            done: false,
          },
        ],
        noTasksLeftForToday: true,
        isRunning: false,
        currentTaskIndex: undefined,
        currentTaskStart: undefined,
        currentTaskEnd: undefined,
      };

      const updateData = {
        index: 0,
        newName: "hehe changed 73",
        time_minutes: initialState.taskList[0].time_hours,
        time_minutes: initialState.taskList[0].time_minutes,
        duration: initialState.taskList[0].duration,
        done: false,
      };

      render(
        <UpdateTask initialState={initialState} updateData={updateData} />
      );

      const user = userEvent.setup({ delay: null });
      jest.useFakeTimers();
      await user.press(screen.getByRole("button"));
      act(() => {
        jest.runAllTimers();
      });

      expect(
        screen.getByText(
          /task 0:\s*{"name":"hehe changed 73","time_hours":0,"time_minutes":1,"duration":1429,"done":false}/
        )
      ).toBeTruthy();

      expect(screen.getByText(/noTasksLeftForToday:\s*false/)).toBeTruthy();

      expect(screen.getByText(/isRunning:\s*false/)).toBeTruthy();

      expect(screen.getByText(/currentTaskIndex:\s*0/)).toBeTruthy();

      expect(
        screen.getByText(
          new RegExp(
            `currentTaskStart:\\s*${JSON.stringify(
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate(),
                initialState.taskList[0].time_hours,
                initialState.taskList[0].time_minutes,
                0,
                0
              )
            )}`
          )
        )
      ).toBeTruthy();

      expect(
        screen.getByText(
          new RegExp(
            `currentTaskEnd:\\s*${JSON.stringify(
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate(),
                initialState.taskList[0].time_hours,
                initialState.taskList[0].time_minutes +
                  initialState.taskList[0].duration,
                0,
                0
              )
            )}`
          )
        )
      ).toBeTruthy();

      jest.useRealTimers();
    });
});
