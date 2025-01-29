import { UserAPI } from "src/app/models";

export interface AuthState {
    isAuthenticated: boolean;
    usuario: UserAPI | null;
    error: string | null;
    isLoading: boolean; // Indicador de carga
    isSaving: boolean; // Indicador de carga
}

// Estado inicial
export const initialAuthState: AuthState = {
    isAuthenticated: false,
    usuario: null,
    error: null,
    isLoading: false,
    isSaving: false,
};