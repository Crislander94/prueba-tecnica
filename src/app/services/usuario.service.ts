import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PaginateData, ROlUsuarioAPI, UserAPI, UserCSVValidate } from '../models';
import { CreateRolUsuario, CreateUser, UpdateUser } from '../dtos';
import { updatingUser } from '../store/usuarios/usuarios.actions';
import { ResponseAPI } from '../models/api/response.api.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiURL = 'http://localhost:8080/api/usuarios'; // URL de tu endpoint
  http = inject( HttpClient );

  getUsers(page: number, size: number, termino: string = ""): Observable<PaginateData<UserAPI>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('termino', termino.trim());
    return this.http.get<PaginateData<UserAPI>>(
      this.apiURL, { params, withCredentials: true }
    )
  }

  getUserByID(id: number): Observable<UserAPI> {
    return this.http.get<UserAPI>(`${this.apiURL}/${id}`, 
      { withCredentials: true }
    );
  }

  savingUser( createUserRequest: CreateUser ){
    return this.http.post<UserAPI>(this.apiURL,
      createUserRequest,
      { withCredentials: true }
    );
  }

  updatingUser( updatingUser: UpdateUser ){
    return this.http.put<UserAPI>(`${this.apiURL}/update`,
      updatingUser,
      { withCredentials: true }
    );
  }

  addRole( createRolUser: CreateRolUsuario): Observable<ROlUsuarioAPI>{
    return this.http.post<ROlUsuarioAPI>( `${this.apiURL}/addRol`, 
      createRolUser,
      { withCredentials: true }
    );
  }

  deleteUser( id: number ){
    return this.http.delete<void>( `${this.apiURL}/${ id}`)
  }

  uploadUserFromCSV( data: FormData): Observable<ResponseAPI<UserCSVValidate>>{
    return this.http.post<ResponseAPI<UserCSVValidate>>(`${ this.apiURL }/importCSV`, data );
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