import { Injectable, inject } from '@angular/core';
import { ProductAPI, ResponseAPI, UserAPI } from "../models";
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
})
export class DashboardService{
    private apiURL = "http://localhost:8080/api"
    http = inject(HttpClient);

    getLastFiveProducts(): Observable<ResponseAPI<ProductAPI[]>>{        
        return this.http.get<ResponseAPI<ProductAPI[]>>(
            `${this.apiURL}/products/ultimosCinco`
        )
    }

    getLastFiveUser(): Observable<ResponseAPI<UserAPI[]>>{
        return this.http.get<ResponseAPI<UserAPI[]>>(
            `${this.apiURL}/usuarios/ultimosCinco`
        )
    }

}