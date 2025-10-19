import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CurrentProjectFileState = string | null;

const initialState = null satisfies CurrentProjectFileState as CurrentProjectFileState;

const slice = createSlice({
  name: "currentProjectFile",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<string>) => {
      return action.payload;
    },
    clear: (state) => {
      return null;
    },
  },
});

export const { set: setCurrentProjectFileAction, clear: clearCurrentProjectFileAction } =
  slice.actions;

export default slice.reducer;
