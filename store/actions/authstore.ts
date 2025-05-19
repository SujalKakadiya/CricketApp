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
