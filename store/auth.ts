import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUserAction, registerUserAction } from "./actions/authstore";

interface user {
  fullname: string;
  username: string;
  password: string;
  dob: Date;
}
export interface AuthState {
  isLoggedIn: boolean;
  users: user[];
  currentUser: user | null;
  loading: boolean;
  error: string | null;
}
export interface FormData {
  fullname: string;
  username: string;
  password: string;
  dob: Date;
}

export const initialState: AuthState = {
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
    login: (state, action: PayloadAction<user>) => {
      const matchedUser = state.users.find(
        (u) =>
          u.username === action.payload.username &&
          u.password === action.payload.password
      );

      if (matchedUser) {
        console.log("Login successful");
        state.isLoggedIn = true;
        state.error = null;
      } else {
        console.log("Login failed");
        state.isLoggedIn = false;
        state.error = "Invalid credentials";
      }
    },

    logout: (state: AuthState) => {
      state.isLoggedIn = false;
      state.users = [];
      state.currentUser = null;
      state.loading = false;
    },
    register: (state: AuthState, action: PayloadAction<user>) => {
      console.log("action.payload", action.payload);
      state.users.push(action.payload);
    },
    deleteUser: (state: AuthState, action: PayloadAction<string>) => {
      state.users = state.users.filter(
        (user: user) => user.username !== action.payload
      );
    },
  },

  // extraReducers: (builder) => {
  //   builder
  //     // .addCase(loginUserAction.pending, (state) => {
  //     //   state.loading = true;
  //     //   state.error = null;
  //     // })
  //     .addCase(loginUserAction.rejected, (state, action) => {
  //       state.loading = false;
  //       state.error = action.error.message || "Login failed";
  //     })
  //     .addCase(
  //       loginUserAction.fulfilled,
  //       (state, action) => {
  //         state.loading = false;
  //         const loggedInUser = action.payload.data.user;
  //         state.users = [loggedInUser];
  //         state.currentUser = loggedInUser;
  //         state.isLoggedIn = true;
  //       }
  //     )
  //     .addCase(registerUserAction.pending, (state) => {
  //       state.loading = true;
  //       state.error = null;
  //     })
  //     .addCase(registerUserAction.rejected, (state, action: any) => {
  //       state.loading = false;
  //       state.error = action.error.message || "Registration failed";
  //     })
  //     .addCase(
  //       registerUserAction.fulfilled,
  //       (state, action) => {
  //         state.loading = false;
  //         const newUser = action.payload.data.user;
  //         state.users.push(newUser);
  //         state.isLoggedIn = true;
  //       }
  //     );
  // },
});

export const { login, logout, register, deleteUser } = authSlice.actions;
export default authSlice.reducer;
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectLoggedUser = (state: { auth: AuthState }) =>
  state.auth.users;
export const selectUserByUsername =
  (username: string) => (state: { auth: AuthState }) =>
    state.auth.users?.find((user: user) => user.username === username);
