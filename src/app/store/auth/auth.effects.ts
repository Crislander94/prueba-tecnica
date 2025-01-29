import { inject, PLATFORM_ID } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loginRequest, loginSuccess, loginFailure, checkAuth, checkAuthFailure, checkAuthSuccess, logout, cleanErrorMessage } from './auth.actions';
import { 
    asyncScheduler,
    catchError,
    concatMap,
    exhaustMap,
    map,
    of,
    scheduled,
    timer } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

const handleErrorResponse = ( errorResponse: HttpErrorResponse ) => {
    const { status, error } = errorResponse;
    
    if(status === 403 ){
        return "No tienes permisos necesarios"
    }else{
        return  error?.message || "Credenciales incorrectas"
    }
}

export const startLogin = createEffect(
    (actions$ = inject(Actions), authService = inject( AuthService )) => {
        return actions$.pipe(
            ofType(loginRequest),
            exhaustMap(({ userNameOrEmail, password, rol }) =>
                authService.login(userNameOrEmail, password, rol).pipe(
                    map(( loginResponse ) =>
                        loginSuccess( loginResponse )
                    ),
                    catchError(
                        (errorResponse: HttpErrorResponse) =>{
                            let errorMessage = handleErrorResponse( errorResponse );
                            return scheduled( [
                                loginFailure({ error: errorMessage })
                            ], asyncScheduler )
                        }
                    )
                )
            )
        )
    },
    { functional: true }
);

export const cleanErrorEffect = createEffect(
    () => 
        inject(Actions).pipe(
            ofType( loginFailure ),
            concatMap( () => 
                timer(
                3000).pipe(
                    map( () => cleanErrorMessage() )
                )
            )
        )
    , { functional: true }
);

export const onLoginSuccess = createEffect(
    (router = inject(Router), isBrowser = isPlatformBrowser(inject(PLATFORM_ID)) ) =>
        inject(Actions).pipe(
            ofType(loginSuccess),
            map((action) => {
                // Guardar el token en localStorage
                if( isBrowser ){
                    localStorage.setItem('token', action.token );
                }
                router.navigate(['/dashboard']);
            })
        ),
    { functional: true  ,dispatch: false } // Este efecto no despacha una acción
);

export const onLogout = createEffect(
    ( router = inject(Router), isBrowser = isPlatformBrowser( inject(PLATFORM_ID) )) => 
    inject(Actions).pipe(
        ofType(logout),
        map((_) => {
            // Remover el token en localStorage
            if( isBrowser ){
                localStorage.clear();
                router.navigate(['/login']);
            }
        }),
    ),
    { functional: true, dispatch: false } // Este efecto no despacha una acción
);

// Exportar como objeto
export const authEffects = {
    startLogin,
    cleanErrorEffect,
    onLoginSuccess,
    onLogout,
};