import { createFeature, createReducer, on } from "@ngrx/store";
import { initialUsuarioState } from "./usuarios.models";
import * as UsuariosActions from './usuarios.actions';

export const usersFeature =  createFeature({
    name: "user",
    reducer: createReducer(
        initialUsuarioState,
        on(UsuariosActions.savingUser, ( state ) => ({
            ...state,
            isSaving: true,
            saveSuccess: false,
            error: null, 
        })),
        on(UsuariosActions.updatingUser, ( state ) => ({
            ...state,
            isSaving: true,
            saveSuccess: false,
            error: null, 
        })),
        on(UsuariosActions.deletingUser, ( state ) => ({
            ...state,
            isSaving: true,
            saveSuccess: false,
            error: null, 
        })),
        on(UsuariosActions.deletingUserSuccess, ( state, { id } ) => ({
            ...state,
            isSaving: false,
            saveSuccess: true,
            usuarios: [ ...state.usuarios?.filter( u => u.id !== id ) || []  ],
            error: null, 
        })),
        on(UsuariosActions.uploadingUsersFromCSV, ( state ) => ({
            ...state,
            isSaving: true,
            saveSuccess: false,
            error: null, 
        })),
        on(UsuariosActions.uploadUsersFromCSVSuccess, ( state, { response } ) => ({
            ...state,
            isSaving: false,
            responseUploadFile: response,
            error: null, 
        })),
        on(UsuariosActions.clearResponseUploadUsers, ( state ) => ({
            ...state,
            responseUploadFile: null,
        })),
        on(UsuariosActions.uploadUsersFromCSVFailure, ( state, { error } ) => ({
            ...state,
            isSaving: false,
            saveSuccess: false,
            responseUploadFile: null,
            error, 
        })),
        on(UsuariosActions.savingRolUser, ( state ) => ({
            ...state,
            isSaving: true,
            saveSuccess: false,
            error: null,
        })),
        on(UsuariosActions.savingUserSuccess, (state) => ({
            ...state,
            isSaving: false,
            saveSuccess: true,
            error: null,
        })),
        on(UsuariosActions.savingUserFailure, (state, { error }) => ({
            ...state,
            isSaving: false,
            saveSuccess: false,
            error,
        })),
        on(UsuariosActions.loadUserRequest, (state) => ({
            ...state,
            isLoading: true,
            error: null,
        })),
        on(UsuariosActions.loadUserById, (state) => ({
            ...state,
            isLoading: true,
            usuario: null,
            error: null,
        })),
        on(UsuariosActions.loadUserByIdSuccess, (state, usuario ) => ({
            ...state,
            isLoading: true,
            usuario,
            error: null,
        })),
        on(UsuariosActions.cleanErrorMessageUsuarios, (state) => ({
            ...state,
            isLoading: false,
            error: null,
            saveSuccess: false,
        })),
        on(UsuariosActions.loadUserSuccess, (state, { usuarios, pages} ) => ({
            ...state,
            usuarios,
            pages,
            usuario: null,
            isLoading: false,
            error: null,
        })),
        on(UsuariosActions.loadsUserFailure, (state, { error }) => ({
            ...state,
            isLoading: false,
            usuarios: null,
            pages: {
                last: true,
                totalPages: 0,
                totalElements: 0,
                currentPage: 0,
            },
            error,
        })),
    )
})