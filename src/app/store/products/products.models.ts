import { Page } from "src/app/interfaces/types";
import { ProductAPI } from "src/app/models";

export interface ProductsState {
    product: ProductAPI | null;
    products: ProductAPI[] | null;
    error: string | null;
    isLoading: boolean; // Indicador de carga
    isSaving: boolean; // Indicador de posteo
    saveSuccess: boolean;
    pages: Page
}

// Estado inicial
export const initialProductState: ProductsState = {
    product: null,
    products: null,
    error: null,
    isLoading: false,
    isSaving: false,
    saveSuccess: false,
    pages: {
        last: true,
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
    }
};