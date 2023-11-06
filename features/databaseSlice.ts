import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DatabaseState {
  loaded: boolean;
}

const initialState: DatabaseState = {
  loaded: false,
};

const databaseSlice = createSlice({
  name: "database",
  initialState,
  reducers: {
    initialized(state) {
      state.loaded = true;
    },
    // fetchDataSuccess(state, action: PayloadAction<any[]>) {
    //   state.loading = false;
    //   state.data = action.payload;
    // },
  },
});

export const { initialized } = databaseSlice.actions;

export default databaseSlice.reducer;
