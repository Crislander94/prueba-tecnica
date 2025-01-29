import { createAction, props } from '@ngrx/store';
import { LoginResponse } from 'src/app/models';

export const checkAuth = createAction('[Auth] Check Auth');

export const checkAuthSuccess = createAction(
  '[Auth] Check Auth Success',
  props<LoginResponse>()
);

export const checkAuthFailure = createAction(
  '[Auth] Check Auth Failure',
  props<{ error: string }>()
);

export const loginRequest = createAction(
  '[Auth] Login Request',
  props<{ userNameOrEmail: string; password: string, rol: number }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<LoginResponse>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const cleanErrorMessage = createAction(
    '[Auth] Clean Error Message',
);

export const logout = createAction('[Auth] Logout');