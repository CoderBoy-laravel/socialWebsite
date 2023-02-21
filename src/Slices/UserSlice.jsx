import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: localStorage.getItem("user") ? localStorage.getItem("user") : null,
  },
  reducers: {
    userUpdate: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { userUpdate } = userSlice.actions;

export default userSlice.reducer;
