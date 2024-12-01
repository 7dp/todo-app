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
  },
});

// #region Selectors
const selectTasks = (state: CurrentRootState) => state.task.tasks;
// #endregion

const taskReducer = taskSlice.reducer;
const taskActions = taskSlice.actions;

export { taskActions, taskReducer, taskSlice };
