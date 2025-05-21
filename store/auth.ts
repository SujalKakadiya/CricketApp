import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUserAction, registerUserAction, updateUserProfileAction } from '@/store/actions/authstore';


export interface User {
  fullname: string;
  username: string;
  password: string;
  dob: Date;
  email?: string;
  photo?: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  users: [],
  currentUser: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      const matchedUser = state.users.find(
        (u) =>
          u.username === action.payload.username &&
          u.password === action.payload.password
      );

      if (matchedUser) {
        state.isLoggedIn = true;
        state.currentUser = matchedUser;
        state.error = null;
      } else {
        state.users.push(action.payload);
        state.isLoggedIn = false;
        state.currentUser = null;
        state.error = "Invalid credentials";
      }
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.currentUser = null;
      state.error = null;
    },
    register: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(
        (user) => user.username !== action.payload
      );
    },
    updateUserProfile: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(
        (user) => user.username === action.payload.username
      );
      if (index !== -1) {
        state.users[index] = action.payload;
        state.currentUser = action.payload;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUserAction.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(loginUserAction.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.error = action.error.message ?? "Login failed";
      })
      .addCase(registerUserAction.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUserProfileAction.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        const index = state.users.findIndex(user => user.username === action.payload.username);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      });
  }
});

export const { login, logout, register, deleteUser, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectLoggedUser = (state: { auth: AuthState }) => state.auth.users;
export const selectUserByUsername =
  (username: string) => (state: { auth: AuthState }) =>
    state.auth.users.find((user) => user.username === username);
