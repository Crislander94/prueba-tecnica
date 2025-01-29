export interface LoginResponse{
    usuario: UserAPI,
    token: string
}

export interface UserAPI{
    id: number,
    username: string,
    mail: string,
    password?: string,
    estado?: 1 | 0,
    rol?: string,
    roles?: RolAPI[],
    iat?: number,
    exp?: number
}

export interface RolAPI{
    id: number,
    name: string
}

export interface ROlUsuarioAPI{
    id: number,
    idUsuario: number,
    idRol: number
}

// CSV
export interface UserCSVValidate {
    countSuccess: number;
	countFailure: number;
	usuariosSuccess: UserAPI[],
	usuariosFailure: UsuarioErrorCsv[];
}

export interface UsuarioErrorCsv{
    errorsMessage: string[],
    usuarioFailure: UserAPI
}