export interface Rol {
  id: string;
  name: string;
}

// STORE
export interface Page {
    last: boolean,
    totalPages: number,
    totalElements: number,
    currentPage: number,
}