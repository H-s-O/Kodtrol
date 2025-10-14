import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CurrentProjectFileState = string | null;

const initialState = null satisfies CurrentProjectFileState as CurrentProjectFileState;

//--------------------------------------------------------------------
// this does NOT works:

const slice = createSlice({
  name: 'currentProjectFile',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<string>) => {
      state = action.payload;
    },
    clear: (state) => {
      state = null;
    },
  }
})

export const {
  set: setCurrentProjectFileAction,
  clear: clearCurrentProjectFileAction,
} = slice.actions

export default slice.reducer

//--------------------------------------------------------------------
// this works:

// export default (state = initialState, { type, payload }) => {
//   switch (type) {
//     case 'set':
//       return payload;
//       break;

//     case 'clear':
//       return null;
//       break;

//     default:
//       return state;
//       break;
//   }
// }

// export const setCurrentProjectFileAction = (payload: string) => ({ type: 'set', payload: payload })
// export const clearCurrentProjectFileAction = () => ({ type: 'clear' })
