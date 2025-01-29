import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, concatMap, exhaustMap, map, of, switchMap, timer } from 'rxjs';
import { UsuarioService } from '../../services/usuario.service';
import { 
    cleanErrorMessageUsuarios,
    deletingUser,
    deletingUserSuccess,
    loadsUserFailure,
    loadUserById,
    loadUserByIdSuccess,
    loadUserRequest,
    loadUserSuccess,
    savingRolUser,
    savingUser,
    savingUserFailure,
    savingUserSuccess, 
    updatingUser,
    uploadingUsersFromCSV,
    uploadUsersFromCSVFailure,
    uploadUsersFromCSVSuccess} from './usuarios.actions';

import { HttpErrorResponse } from '@angular/common/http';
import { Page } from 'src/app/interfaces/types';

export const startLoadUser = createEffect(
    (
        actions$ = inject( Actions ),
        usuarioService = inject( UsuarioService ) 
    ) => {
        return actions$.pipe(
            ofType( loadUserRequest ),
            exhaustMap( ( {  page, size, termino }) => 
                usuarioService.getUsers( page, size, termino ).pipe(
                    map( ( { content, ...rest } ) =>{
                        const { last, totalPages, totalElements, number  } = rest;
                        const pages: Page = {
                            last,
                            totalPages,
                            totalElements,
                            currentPage: number
                        }
                        return loadUserSuccess( { usuarios: content, pages });
                    }),
                    catchError(
                        (errorResponse: HttpErrorResponse) =>{
                            // console.log( errorResponse );
                            return of(loadsUserFailure({ error: "error"}));
                        }
                    )
                )
            )
        )
    },
    { functional: true }
)

export const startSavingUser = createEffect( 
    (
        actions$ = inject( Actions ),
        usuarioService = inject( UsuarioService )
    ) =>
    actions$.pipe(
        ofType(savingUser),
        switchMap(( createUser ) =>
            usuarioService.savingUser(  createUser ).pipe(
                map(( response) => {
                    // console.log( response );
                    return savingUserSuccess();
                }),
                catchError(( error) => {
                    // console.log( error?.error?.message );
                    return of( savingUserFailure( { error: error.error?.message || 'No se pude crear el usuario' } ))
                })
            )
        )
    ),
    { functional: true }
);

export const startSavingRolUser = createEffect( 
    (
        actions$ = inject( Actions ),
        usuarioService = inject( UsuarioService )
    ) =>
    actions$.pipe(
        ofType( savingRolUser ),
        switchMap(( createRolUser ) =>
            usuarioService.addRole( createRolUser ).pipe(
                map(( response) => {
                    // console.log( response );
                    return savingUserSuccess();
                }),
                catchError(( error) => {
                    // console.log( error?.error?.message );
                    return of( savingUserFailure( { error: error.error?.message || 'No se pude agregar el rol' } ))
                })
            )
        )
    ),
    { functional: true }
);

export const startUpdatingUser = createEffect( 
    (
        actions$ = inject( Actions ),
        usuarioService = inject( UsuarioService )
    ) =>
    actions$.pipe(
        ofType( updatingUser ),
        switchMap(( updateUser ) =>
            usuarioService.updatingUser( updateUser ).pipe(
                map(( response) => {
                    console.log( response );
                    return savingUserSuccess();
                }),
                catchError(( error) => {
                    console.log( error?.error?.message );
                    return of( savingUserFailure( { error: error.error?.message || 'No se pude editar el rol' } ))
                })
            )
        )
    ),
    { functional: true }
);

export const startDeletingUser = createEffect( 
    (
        actions$ = inject( Actions ),
        usuarioService = inject( UsuarioService )
    ) =>
    actions$.pipe(
        ofType( deletingUser ),
        switchMap(( {id: idUser } ) =>
            usuarioService.deleteUser( idUser ).pipe(
                map(( response ) => {
                    // console.log( response );
                    return deletingUserSuccess( { id: idUser } );
                }),
                catchError(( error) => {
                    // console.log( error?.error?.message );
                    return of( savingUserFailure( { error: error.error?.message || 'No se pude eliminar el usuario' } ))
                })
            )
        )
    ),
    { functional: true }
);

export const startUploadUsersFromCSV = createEffect( 
    (
        actions$ = inject( Actions ),
        usuarioService = inject( UsuarioService )
    ) =>
    actions$.pipe(
        ofType( uploadingUsersFromCSV ),
        switchMap(( { data } ) =>
            usuarioService.uploadUserFromCSV( data ).pipe(
                map(( response ) => {
                    // console.log( response );
                    return uploadUsersFromCSVSuccess( { response: response.data } );
                }),
                catchError(( error) => {
                    // console.log( error?.error?.message );
                    return of( uploadUsersFromCSVFailure( { error: error.error?.message || 'No se pudo subir los usuarios' } ))
                })
            )
        )
    ),
    { functional: true }
);

export const cleanMessagesUserEffect = createEffect(
    () => 
        inject(Actions).pipe(
            ofType( savingUserFailure, savingUserSuccess, loadsUserFailure, deletingUserSuccess ),
            concatMap( () => 
                timer(
                3000).pipe(
                    map( () => cleanErrorMessageUsuarios() )
                )
            )
        )
    , { functional: true }
);

export const loadingUserByID = createEffect( 
    (
        actions$ = inject( Actions ),
        usuarioService = inject( UsuarioService )
    ) =>
    actions$.pipe(
        ofType(loadUserById),
        switchMap(( { id }) =>
            usuarioService.getUserByID( id ).pipe(
                map(( response) => {
                    // console.log(response);
                    return loadUserByIdSuccess( response );
                }),
                catchError(( error) => {
                    // console.log( error?.error?.message );
                    return of( loadsUserFailure( { error: error.error?.message || 'No se pude cargar el usuario' } ))
                })
            )
        )
    ),
    { functional: true }
);

export const usersEffect = {
    startLoadUser,
    startSavingUser,
    startSavingRolUser,
    startDeletingUser,
    startUpdatingUser,
    startUploadUsersFromCSV,
    cleanErrorUserEffect: cleanMessagesUserEffect,
    loadingUserByID
}