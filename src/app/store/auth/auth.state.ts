import { createFeature } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from './auth.models';
import * as AuthActions from './auth.actions';

export const authFeature = createFeature({
  name: "auth",
  reducer: createReducer(
    initialAuthState,
    // Acción para iniciar la verificación de sesión
    on(AuthActions.checkAuth, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
  
    // Acción para checkAuth exitoso
    on(AuthActions.checkAuthSuccess, (state, { usuario } ) => ({
      ...state,
      isAuthenticated: true,
      usuario: { ...usuario },
      isLoading: false,
      error: null,
    })),
  
    // Acción para checkAuth fallido
    on(AuthActions.checkAuthFailure, (state, { error }) => ({
      ...state,
      isAuthenticated: false,
      usuario: null,
      isLoading: false,
      error,
    })),
    
    on(AuthActions.loginRequest, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(AuthActions.cleanErrorMessage, (state) => ({
      ...state,
      isLoading: false,
      error: null,
    })),
    on(AuthActions.loginSuccess, (state, { usuario }) => ({
      ...state,
      isAuthenticated: true,
      isLoading: false,
      usuario: { ...usuario },
      error: null,
    })),
    on(AuthActions.loginFailure, (state, { error }) => ({
      ...state,
      isAuthenticated: false,
      isLoading: false,
      error,
    })),
    on(AuthActions.logout, () => initialAuthState)
  )
});