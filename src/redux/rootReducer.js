import { combineReducers } from "@reduxjs/toolkit";
import counterReducer from "../../src/redux/features/counterSlice";
import userReducer from "../../src/redux/features/userSlice";
import packageReducer from "../../src/redux/features/packageSlice";
export const rootReducer = combineReducers({
  counter: counterReducer,
  user: userReducer,
  package: packageReducer,
});
