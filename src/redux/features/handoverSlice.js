
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  handoverId: null, // Khởi tạo với giá trị mặc định là null
  orderCode: "",
  packageNo: "",
  handoverDescription: "",
  handoverStatus: "IN PROGRESS",
  handoverDate: null,
  handoverBy: "",
};

const handoverSlice = createSlice({
  name: "handover",
  initialState,
  reducers: {
    setHandoverId: (state, action) => {
      state.handoverId = action.payload;
    },
    setOrderCode: (state,action)=>{
      state.orderCode = action.payload;
    }, 
    setPackageNo: (state,action)=>{
      state.packageNo = action.payload;
    },  
    setHandoverDescription: (state, action) => {
      state.phandoverDescription = action.payload;
    },
    setHandoverStatus: (state, action) => {
      state.handoverStatus = action.payload;
    },
    resetHandover: () => initialState, 
  },
});

export const {
  setHandoverId,
  setOrderCode,
  setPackageNo,
  setHandoverDescription,
  setHandoverStatus,
  resetHandover,
} = handoverSlice.actions;

export default handoverSlice.reducer;
