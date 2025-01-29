import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, concatMap, exhaustMap, map, of, switchMap, timer } from 'rxjs';
import { 
    cleanErrorMessageProduct,
    deletingProduct,
    deletingProductSuccess,
    loadsProductFailure,
    loadProductById,
    loadProductByIdSuccess,
    loadProductRequest,
    loadProductSuccess,
    savingProduct,
    savingProductFailure,
    savingProductSuccess, 
    updatingProduct} from './products.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from 'src/app/services/product.service';
import { Page } from 'src/app/interfaces/types';

export const startLoadProduct = createEffect(
    (
        actions$ = inject( Actions ),
        productService = inject( ProductService )
    ) => {
        return actions$.pipe(
            ofType( loadProductRequest ),
            exhaustMap( ( {  page, size, termino }) =>
                productService.getProducts( page, size, termino ).pipe(
                    map( ( { content, ...rest } ) =>{
                        const { last, totalPages, totalElements, number  } = rest;
                        const pages: Page = {
                            last,
                            totalPages,
                            totalElements,
                            currentPage: number
                        }
                        return loadProductSuccess( { products: content, pages });
                    }),
                    catchError(
                        (errorResponse: HttpErrorResponse) =>{
                            // console.log( errorResponse );
                            return of(loadsProductFailure({ error: "error"}));
                        }
                    )
                )
            )
        )
    },
    { functional: true }
)

export const startSavingProduct = createEffect( 
    (
        actions$ = inject( Actions ),
        productService = inject( ProductService )
    ) =>
    actions$.pipe(
        ofType(savingProduct),
        switchMap(( createProduct ) =>
            productService.savingProduct(  createProduct ).pipe(
                map(( response) => {
                    // console.log( response );
                    return savingProductSuccess();
                }),
                catchError(( error) => {
                    // console.log( error?.error?.message );
                    return of( savingProductFailure( { error: error.error?.message || 'No se pude crear el producto' } ))
                })
            )
        )
    ),
    { functional: true }
);

export const startUpdatingProduct = createEffect( 
    (
        actions$ = inject( Actions ),
        productService = inject( ProductService )
    ) =>
    actions$.pipe(
        ofType( updatingProduct ),
        switchMap(( updateProduct ) =>
            productService.updatingProduct( updateProduct ).pipe(
                map(( response) => {
                    // console.log( response );
                    return savingProductSuccess();
                }),
                catchError(( error) => {
                    // console.log( error?.error?.message );
                    return of( savingProductFailure( { error: error.error?.message || 'No se pude editar el producto' } ))
                })
            )
        )
    ),
    { functional: true }
);

export const startDeletingProduct = createEffect( 
    (
        actions$ = inject( Actions ),
        productService = inject( ProductService )
    ) =>
    actions$.pipe(
        ofType( deletingProduct ),
        switchMap(( {id: idProduct } ) =>
            productService.deleteProduct( idProduct ).pipe(
                map(( response ) => {
                    // console.log( response );
                    return deletingProductSuccess( { id: idProduct } );
                }),
                catchError(( error) => {
                    // console.log( error?.error?.message );
                    return of( savingProductFailure( { error: error.error?.message || 'No se pude eliminar el producto' } ))
                })
            )
        )
    ),
    { functional: true }
);

export const cleanMessagesProductEffect = createEffect(
    () => 
        inject(Actions).pipe(
            ofType( savingProductFailure, savingProductSuccess, loadsProductFailure, deletingProductSuccess ),
            concatMap( () => 
                timer(
                3000).pipe(
                    map( () => cleanErrorMessageProduct() )
                )
            )
        )
    , { functional: true }
);

export const loadingProductByID = createEffect( 
    (
        actions$ = inject( Actions ),
        productService = inject( ProductService )
    ) =>
    actions$.pipe(
        ofType(loadProductById ),
        switchMap(( { id }) =>
            productService.getProductByID( id ).pipe(
                map(( response) => {
                    // console.log(response);
                    return loadProductByIdSuccess( response );
                }),
                catchError(( error) => {
                    // console.log( error?.error?.message );
                    return of( loadsProductFailure( { error: error.error?.message || 'No se pude cargar el producto' } ))
                })
            )
        )
    ),
    { functional: true }
);

export const productsEffect = {
    startLoadProduct,
    startSavingProduct,
    startUpdatingProduct,
    startDeletingProduct,
    cleanMessagesProductEffect,
    loadingProductByID,
}