import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginateData, ProductAPI } from '../models';
import { SaveProduct } from '../dtos';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiURL = 'http://localhost:8080/api/products'; // URL de tu endpoint
    http = inject( HttpClient );
  
    getProducts(page: number, size: number, termino = ""): Observable<PaginateData<ProductAPI>> {
      const params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
        .set('termino', termino.trim());
        return this.http.get<PaginateData<ProductAPI>>(
        this.apiURL, { params, withCredentials: true }
      )
    }
  
    getProductByID(id: number): Observable<ProductAPI> {
      return this.http.get<ProductAPI>(`${this.apiURL}/${id}`, 
        { withCredentials: true }
      );
    }
  
    savingProduct( createProduct: Omit<SaveProduct, "id"> ): Observable<ProductAPI>{
      return this.http.post<ProductAPI>(this.apiURL,
        createProduct,
        { withCredentials: true }
      );
    }
  
    updatingProduct( updateProduct: SaveProduct ): Observable<ProductAPI>{
      return this.http.put<ProductAPI>(`${this.apiURL}/update`,
        updateProduct,
        { withCredentials: true }
      );
    }
  
    deleteProduct( id: number ){
      return this.http.delete<void>( `${this.apiURL}/${ id}`)
    }

  
}