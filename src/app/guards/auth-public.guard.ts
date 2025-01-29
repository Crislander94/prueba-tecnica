import { CanActivateFn } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

export const authPublicGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService );
  
  if( !isPlatformBrowser( inject(PLATFORM_ID ))) return false;
  
  return authService.checkAuth().pipe(
    map(() => {
      router.navigate(['/dashboard']);
      return false;
    }),
    catchError( () => {
      return of(true)
    } )
  );
};