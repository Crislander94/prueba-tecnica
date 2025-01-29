import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WITH_TOKEN } from '../interceptors/context.interceptors';
import { Rol } from '../interfaces/types';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private apiURL = "http://localhost:8080/api/rol"
  constructor(private http: HttpClient) { }
  
  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.apiURL}`, {
      context: new HttpContext().set(WITH_TOKEN, false)
    });
  }
}