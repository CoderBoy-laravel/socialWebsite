import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slices/UserSlice";

export default configureStore({
  reducer: {
    userInfo: userSlice,
  },
});
