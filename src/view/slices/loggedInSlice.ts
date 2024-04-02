import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoggedInState {
  isLoggedIn: boolean;
  username: string;
  email: string;
}

const initialState: LoggedInState = {
  isLoggedIn: false,
  username: '',
  email: '',
};

const loggedInSlice = createSlice({
  name: 'isLoggedIn',
  initialState,
  reducers: {
    logIn: (
      state,
      action: PayloadAction<{ username: string; email: string }>
    ) => {
      state.isLoggedIn = true;
      state.username = action.payload.username;
      state.email = action.payload.email;
    },
    logOut: state => {
      state.isLoggedIn = true;
      state.username = '';
      state.email = '';
    },
  },
});

export const { logIn, logOut } = loggedInSlice.actions;
export default loggedInSlice.reducer;
