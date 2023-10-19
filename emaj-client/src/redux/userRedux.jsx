import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
  },
  reducers: {
    reducerUserLogin: (state, action) => {
      state.currentUser = action.payload;
    },
    reducerUserLogout: (state) => {
      state.currentUser = null;
    },
  },
});

export const { reducerUserLogin, reducerUserLogout } = userSlice.actions;
export default userSlice.reducer;