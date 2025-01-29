import { createAction, props } from '@ngrx/store';
import { CreateRolUsuario, CreateUser, LoadEntityRequest, UpdateUser } from 'src/app/dtos';
import { Page } from 'src/app/interfaces/types';
import { UserAPI, UserCSVValidate } from 'src/app/models';


export const savingUser = createAction(
  '[Users] Saving User',
  props<CreateUser>()
);

export const updatingUser = createAction(
  '[Users] Updating User',
  props<UpdateUser>()
);

export const deletingUser = createAction(
  '[Users] Deleting User',
  props<{id: number}>()
);

export const uploadingUsersFromCSV = createAction(
  '[Users] Uploading Users From CSV',
  props<{data: FormData}>()
);

export const uploadUsersFromCSVSuccess = createAction(
  '[Users] Upload Users From CSV Success',
  props<{ response: UserCSVValidate }>()
);

export const clearResponseUploadUsers = createAction(
  '[Users] Clean Response Upload From CSV',
);

export const uploadUsersFromCSVFailure = createAction(
  '[Users] Upload Users From CSV Failure',
  props<{error: string}>()
);

export const savingRolUser = createAction(
  '[Users] Saving Rol User',
  props<CreateRolUsuario>()
);

export const savingUserSuccess = createAction(
  '[Users] Saving User Success'
);

export const deletingUserSuccess = createAction(
  '[Users] Deleting User Success',
  props<{id: number}>()
);

export const savingUserFailure = createAction(
  '[Users] Saving User Failure',
  props<{ error: string }>()
);

export const loadUserRequest = createAction(
  '[Users] Loading Users',
  props<LoadEntityRequest>()
);

export const loadUserById = createAction(
  '[Users] Loading User By ID',
  props<{ id: number }>()
);

export const loadUserByIdSuccess = createAction(
  '[Users] Loading User By ID success',
  props<UserAPI>()
);

export const loadUserSuccess = createAction(
  '[Users] Loading Success',
  props<{ usuarios: UserAPI[], pages: Page }>()
);

export const loadsUserFailure = createAction(
  '[Users] Login Failure',
  props<{ error: string }>()
);

export const cleanErrorMessageUsuarios = createAction(
  '[Users] Clean Error Message',
)