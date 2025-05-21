import { createAsyncThunk } from '@reduxjs/toolkit';
import { withToastForError } from '@/lib/utils/thunk';
import Api from '@/services/api/client';
import { AxiosResponse } from 'axios';

export const loginUserAction = createAsyncThunk(
  'app/loginUser',
  withToastForError(async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    return await Api.post('/app/login', { username, password }).then((res: AxiosResponse) => res.data);
  })
);

export const registerUserAction = createAsyncThunk(
  'app/registerUser',
  withToastForError(async ({
    fullname,
    username,
    password,
    dob
  }: {
    fullname: string;
    username: string;
    password: string;
    dob: Date;
  }) => {
    return await Api.post('/app/register', { fullname, username, password, dob }).then((res: AxiosResponse) => res.data);
  })
);

export const updateUserProfileAction = createAsyncThunk(
  'app/updateUserProfile',
  withToastForError(async ({
    fullname,
    username,
    email,
    photo,
  }: {
    fullname: string;
    username: string;
    email: string;
    photo?: string; // optional
  }) => {
    return await Api.put('/app/profile', { fullname, username, email, photo }).then(
      (res: AxiosResponse) => res.data
    );
  })
);

export const fetchcartAction = createAsyncThunk(
  'app/fetchCart',
  withToastForError(async () => {
    return await Api.get('/app/cart').then((res: AxiosResponse) => res.data);
  })
);

export const syncCartAction = createAsyncThunk(
  'app/syncCart',// action type
  withToastForError(async () => {
    return await Api.post('/app/syncCart').then((res: AxiosResponse) => res.data);
  })
);