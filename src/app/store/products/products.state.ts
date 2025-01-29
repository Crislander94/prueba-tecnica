import { createFeature, createReducer, on } from "@ngrx/store";
import * as ProductsActions from './products.actions';
import { initialProductState } from "./products.models";

export const productsFeature =  createFeature({
    name: "product",
    reducer: createReducer(
        initialProductState,
        on(ProductsActions.savingProduct, ( state ) => ({
            ...state,
            isSaving: true,
            saveSuccess: false,
            error: null, 
        })),
        on(ProductsActions.updatingProduct, ( state ) => ({
            ...state,
            isSaving: true,
            saveSuccess: false,
            error: null, 
        })),
        on(ProductsActions.deletingProduct, ( state ) => ({
            ...state,
            isSaving: true,
            saveSuccess: false,
            error: null, 
        })),
        on(ProductsActions.deletingProductSuccess, ( state, { id } ) => ({
            ...state,
            isSaving: false,
            saveSuccess: true,
            products: [ ...state.products?.filter( p => p.id !== id ) || []  ],
            error: null, 
        })),
        on(ProductsActions.savingProductSuccess, (state) => ({
            ...state,
            isSaving: false,
            saveSuccess: true,
            error: null,
        })),
        on(ProductsActions.savingProductFailure, (state, { error }) => ({
            ...state,
            isSaving: false,
            saveSuccess: false,
            error,
        })),
        on(ProductsActions.loadProductRequest, (state) => ({
            ...state,
            isLoading: true,
            error: null,
        })),
        on(ProductsActions.loadProductById, (state) => ({
            ...state,
            isLoading: true,
            usuario: null,
            error: null,
        })),
        on(ProductsActions.loadProductByIdSuccess, (state, product ) => ({
            ...state,
            isLoading: true,
            product,
            error: null,
        })),
        on(ProductsActions.cleanErrorMessageProduct, (state) => ({
            ...state,
            isLoading: false,
            error: null,
            saveSuccess: false,
        })),
        on(ProductsActions.loadProductSuccess, (state, { products, pages} ) => ({
            ...state,
            products,
            pages,
            usuario: null,
            isLoading: false,
            error: null,
        })),
        on(ProductsActions.loadsProductFailure, (state, { error }) => ({
            ...state,
            isLoading: false,
            usuarios: null,
            pages: {
                last: true,
                totalPages: 0,
                totalElements: 0,
                currentPage: 0,
            },
            error,
        })),
    )
})