import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CurrentRootState } from "../types";

import { scheduleNotification, unscheduleNotification } from "@/services";
import { Task } from "@/types";
import dayjs from "dayjs";

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
        unscheduleNotification(payload.id);
      }
    },
    setReminder: (state, { payload }: PayloadAction<Task>) => {
      const target = state.tasks.find((item) => item.id === payload.id);
      if (!target) {
        return;
      }
      target.remindAt = payload.remindAt;
      const reminder = dayjs(payload.remindAt);
      const now = dayjs();
      if (target.isCompleted || reminder.isBefore(now)) {
        unscheduleNotification(target.id);
        return;
      }
      scheduleNotification(target);
    },
    removeReminder: (state, { payload }: PayloadAction<Task>) => {
      const target = state.tasks.find((item) => item.id === payload.id);
      if (!target) {
        return;
      }
      target.remindAt = "";
      unscheduleNotification(target.id);
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
        unscheduleNotification(target.id);
        return;
      }

      const reminder = dayjs(target.remindAt);
      const now = dayjs();
      if (!target.isCompleted && reminder.isAfter(now)) {
        scheduleNotification(target);
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
