import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index'; 

export const selectAuth = (state: RootState) => state.auth ?? {};

export const selectLoggedUser = createSelector(
  [selectAuth],
  (auth) => auth.users ?? null
);

export const selectUsers = createSelector(
  [selectAuth],
  (auth) => auth.users ?? []
);
