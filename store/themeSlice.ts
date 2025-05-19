import { createSlice } from '@reduxjs/toolkit';
import { lightTheme, darkTheme } from '../constants/theme';

export interface ThemeState {
  isDarkMode: boolean;
  theme: typeof lightTheme;
}

const initialState: ThemeState = {
  isDarkMode: false,
  theme: lightTheme,
};

const themeSlice = createSlice({
  name: 'themeSlice',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      state.theme = state.isDarkMode ? darkTheme : lightTheme;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
