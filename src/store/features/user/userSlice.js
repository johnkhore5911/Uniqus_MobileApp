import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  email: "",
  userRole: "",
  name: "",
  joinRequests: [],
  classRoomsArray: [],
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      const { _id, email, userRole, name, joinRequests, classRoomsArray, token } = action.payload;
      state._id = _id;
      state.email = email;
      state.userRole = userRole;
      state.name = name;
      state.joinRequests = joinRequests;
      state.classRoomsArray = classRoomsArray;
      state.token = token;
    },
    resetUserData: (state) => {
      state = initialState;
    },
    // will add other reducers here
  },
});

export const { setUserData, resetUserData } = userSlice.actions;
export default userSlice.reducer;
