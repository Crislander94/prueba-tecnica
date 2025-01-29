import { createAction, props } from '@ngrx/store';
import { CreateRolUsuario, CreateUser, LoadEntityRequest, SaveProduct, UpdateUser } from 'src/app/dtos';
import { Page } from 'src/app/interfaces/types';
import { ProductAPI, UserAPI } from 'src/app/models';

export const savingProduct = createAction(
  '[Products] Saving Product',
  props<Omit<SaveProduct, "id">>()
);

export const updatingProduct = createAction(
  '[Products] Updating Product',
  props<SaveProduct>()
);

export const deletingProduct = createAction(
  '[Products] Deleting Product',
  props<{id: number}>()
);


export const savingProductSuccess = createAction(
  '[Products] Saving Product Success'
);

export const deletingProductSuccess = createAction(
  '[Products] Deleting Product Success',
  props<{id: number}>()
);

export const savingProductFailure = createAction(
  '[Products] Saving Product Failure',
  props<{ error: string }>()
);

export const loadProductRequest = createAction(
  '[Products] Loading Products',
  props<LoadEntityRequest>()
);

export const loadProductById = createAction(
  '[Products] Loading Product By ID',
  props<{ id: number }>()
);

export const loadProductByIdSuccess = createAction(
  '[Products] Loading Product By ID success',
  props<ProductAPI>()
);

export const loadProductSuccess = createAction(
  '[Products] Loading Success',
  props<{ products: ProductAPI[], pages: Page }>()
);

export const loadsProductFailure = createAction(
  '[Products] Login Failure',
  props<{ error: string }>()
);

export const cleanErrorMessageProduct = createAction(
  '[Products] Clean Error Message',
)