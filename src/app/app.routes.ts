import { Routes } from '@angular/router';
import { authPublicGuard } from './guards/auth-public.guard';
import { authProtectedGuard } from './guards/auth-protected.guard';
import { provideEffects } from '@ngrx/effects';
import { usersEffect } from './store/usuarios/usuarios.effects';
import { provideState } from '@ngrx/store';
import { productsEffect, productsFeature, usersFeature } from './store';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
    },
    {
        path: 'dashboard',
        loadComponent: () => 
        import("./pages/dashboard/dashboard.component").then(
            (m) => m.DashboardComponent
        ),
        canActivate: [authProtectedGuard], // Solo usuarios autenticados pueden acceder
        providers: [
            provideState( usersFeature ),
            provideState( productsFeature )
        ],
        children: [
            {
                path: '',
                loadComponent: () => 
                    import("./pages/dashboard/components/home-component/home-component.component")
                    .then( (m) => m.HomeComponentComponent )
            },
            {
                path: 'usuarios',
                loadComponent: () =>
                    import("./pages/usuarios/list-usuarios/list-usuarios.component")
                    .then( m => m.ListUsuariosComponent ),
                providers: [
                    provideEffects( usersEffect )
                ]
            },
            {
                path: 'usuarios/addEdit/:id',
                loadComponent: () =>
                    import('./pages/usuarios/add-edit-usuario/add-edit-usuario.component')
                    .then( m => m.AddEditUsuarioComponent ),
                providers: [
                    provideEffects( usersEffect )
                ]

            },
            {
                path: 'products',
                loadComponent: () =>
                    import("./pages/products/list-products/list-products.component")
                    .then( m => m.ListProductsComponent ),
                providers: [
                    provideEffects( productsEffect )
                ]
            },
            {
                path: 'products/addEdit/:id',
                loadComponent: () =>
                    import('./pages/products/add-edit-product/add-edit-product.component')
                    .then( m => m.AddEditProductComponent ),
                providers: [
                    provideEffects( productsEffect )
                ]
            },
        ]
    },
    {
        path: 'login',
        //component: AuthComponent,
        loadComponent: () =>
            import('./pages/auth/auth.component').then(
                (m) => m.AuthComponent
            ),
        canActivate: [authPublicGuard], // Usuarios autenticados no pueden acceder al login
    },  
];