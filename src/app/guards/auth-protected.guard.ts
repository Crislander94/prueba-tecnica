import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { checkAuthSuccess, logout } from '../store/auth/auth.actions';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';

export const authProtectedGuard: CanActivateFn = () => {
  const store = inject( Store );
  const authService = inject(AuthService );
  return authService.checkAuth().pipe(
    map(({ usuario, token }) => {
      store.dispatch( checkAuthSuccess({ usuario, token }) )
      return true;
    }),
    catchError( ( error: HttpErrorResponse ) =>{
      // TODO: validar si existe refresh-token
      if( error.status === 403 || error.status === 401 ){
        store.dispatch( logout() );
      }
      return of(false)
    })
  );
};