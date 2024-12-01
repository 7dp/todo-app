import notifee from "@notifee/react-native";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CurrentRootState } from "../types";

import { Task } from "@/types";

type InitialState = {
  tasks: Task[];
};

const initialState: InitialState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    removeTask: (state, { payload }: PayloadAction<Task>) => {
      const targetIndex = state.tasks.findIndex(
        (item) => item.id === payload.id
      );
      if (targetIndex > -1) {
        state.tasks.splice(targetIndex, 1);
        notifee.cancelNotification(payload.id);
      }
    },
    setReminder: (state, { payload }: PayloadAction<Task>) => {
      const target = state.tasks.find((item) => item.id === payload.id);
      if (!target) {
        return;
      }
      target.remindAt = payload.remindAt;
    },
    removeReminder: (state, { payload }: PayloadAction<Task>) => {
      const target = state.tasks.find((item) => item.id === payload.id);
      if (!target) {
        return;
      }
      target.remindAt = "";
      notifee.cancelNotification(target.id);
    },
    setName: (state, { payload }: PayloadAction<Task>) => {
      const target = state.tasks.find((item) => item.id === payload.id);
      if (!target) {
        return;
      }
      target.name = payload.name;
    },
    toggleTaskStatus: (state, { payload }: PayloadAction<Task>) => {
      const target = state.tasks.find((item) => item.id === payload.id);
      if (!target) {
        return;
      }
      target.isCompleted = !target.isCompleted;
      if (target.isCompleted) {
        notifee.cancelNotification(target.id);
      }
    },
  },
});

// #region Selectors
const selectTasks = (state: CurrentRootState) => state.task.tasks;
// #endregion

const taskReducer = taskSlice.reducer;
const taskActions = taskSlice.actions;

export { selectTasks, taskActions, taskReducer, taskSlice };
