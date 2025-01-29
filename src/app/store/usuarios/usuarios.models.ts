import { Page } from "src/app/interfaces/types";
import { UserAPI, UserCSVValidate } from "src/app/models";

export interface UsuariosState {
    usuario: UserAPI | null;
    usuarios: UserAPI[] | null;
    error: string | null;
    isLoading: boolean; // Indicador de carga
    isSaving: boolean; // Indicador de posteo
    saveSuccess: boolean;
    pages: Page,
    responseUploadFile: UserCSVValidate | null,
}

// Estado inicial
export const initialUsuarioState: UsuariosState = {
    usuario: null,
    usuarios: null,
    error: null,
    isLoading: false,
    isSaving: false,
    saveSuccess: false,
    pages: {
        last: true,
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
    },
    responseUploadFile: null
};