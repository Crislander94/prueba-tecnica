import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { LoginResponse } from '../models';
import { WITH_TOKEN } from '../interceptors/context.interceptors';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = "http://localhost:8080/api/auth"
  http = inject(HttpClient);

  login(userNameOrEmail: string, password: string, rol: number): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiURL}/login`, { userNameOrEmail, password, rol },{
        context: new HttpContext().set(WITH_TOKEN, false)
      }

    )
  }

  checkAuth(): Observable<LoginResponse> {
    return this.http.get<LoginResponse>(`${ this.apiURL }/me`);
  }

  refreshToken(): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${ this.apiURL }/refresh-token`, {});
  }

  // private handleError(error: HttpErrorResponse) {
  //   if (error.status === 403) {
  //     // Manejo del error 403
  //     console.error('Acceso no autorizado', error);
  //   } else {
  //     // Manejo de otros errores
  //     console.error('Error de red', error);
  //   }

  //   return throwError(() => new Error('Hubo un problema con la solicitud; por favor, inténtelo nuevamente más tarde.'));
  // }
}