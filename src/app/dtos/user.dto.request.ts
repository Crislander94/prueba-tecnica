export interface CreateUser{
    username: string,
    mail: string,
    password: string,
    rolId: number
}

export interface UpdateUser{
    id: number,
    username: string,
    mail: string,
    password: string
}



export interface CreateRolUsuario{
    idUsuario: number,
    idRol: number
}