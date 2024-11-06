// redux/slices/packageSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  packageId: null, // Khởi tạo với giá trị mặc định là null
  packageDescription: "",
  packageStatus: "UNPACKED",
  packageDate: null,
  packageBy: "",
};

const packageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {
    setPackageId: (state, action) => {
      state.packageId = action.payload;
    },
    setPackageDescription: (state, action) => {
      state.packageDescription = action.payload;
    },
    setPackageStatus: (state, action) => {
      state.packageStatus = action.payload;
    },
    setPackageDate: (state, action) => {
      state.packageDate = action.payload;
    },
    setPackageBy: (state, action) => {
      state.packageBy = action.payload;
    },
    resetPackage: () => initialState, // Reset lại state của package
  },
});

export const {
  setPackageId,
  setPackageDescription,
  setPackageStatus,
  setPackageDate,
  setPackageBy,
  resetPackage,
} = packageSlice.actions;

export default packageSlice.reducer;
