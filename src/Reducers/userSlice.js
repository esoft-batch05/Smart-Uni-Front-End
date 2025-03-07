import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "67c952f2daccb0e6af194b8d",
  name: "sahan Kumarage",
  email: "kavishkasahandj@gmail.com",
  role: "lecturer",
  phone: "0767138960",
  dob: "2025-03-01T18:30:00.000Z",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetUser: () => initialState,
  },
});

export const { updateUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
