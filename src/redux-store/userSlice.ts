import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  name: string | null;
  email: string | null;
  isAllowed: boolean;
}

const initialState: UserState = {
  name: null,
  email: null,
  isAllowed: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ name: string; email: string; isAllowed: boolean }>
    ) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.isAllowed = action.payload.isAllowed;
<<<<<<< HEAD
      return state;
=======
>>>>>>> 7941f6d (new system)
    },
    logout: (state) => {
      state.name = null;
      state.email = null;
      state.isAllowed = false;
<<<<<<< HEAD
      return state;
    },
    setAllowance: (state, action: PayloadAction<{ isAllowed: boolean }>) => {
      state.isAllowed = action.payload.isAllowed;
      return state;
=======
    },
    setAllowance: (state, action: PayloadAction<{ isAllowed: boolean }>) => {
      state.isAllowed = action.payload.isAllowed;
>>>>>>> 7941f6d (new system)
    },
  },
});

export const { login, logout, setAllowance } = userSlice.actions;
export default userSlice.reducer;
