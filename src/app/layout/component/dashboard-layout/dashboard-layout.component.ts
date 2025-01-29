import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { logout } from '../../../store/auth/auth.actions';
import { authFeature } from 'src/app/store/auth/auth.state';
import { UserAPI } from 'src/app/models';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    ToolbarModule,
    ButtonModule,
    DrawerModule,
    CommonModule,
    Menu,
    RouterLink
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardLayoutComponent implements OnInit {
  visible = false;
  items: MenuItem[] | undefined;
  readonly store = inject( Store );
  userAuth$: Observable<UserAPI | null > = this.store.select( authFeature.selectUsuario );
  
  ngOnInit(): void {
    
    this.items = [
      {
        label: '',
        items:[
          {
            label: 'Home',
            icon: 'pi pi-home',
            routerLink: "/dashboard/"
          }
        ]
      },
      {
        label: 'Usuario',
        items: [
            {
              label: 'Search',
              icon: 'pi pi-search',
              routerLink: "/dashboard/usuarios"
            },
            {
              label: 'Nuevo',
              icon: 'pi pi-plus',
              routerLink: "/dashboard/usuarios/addEdit/0"
            },
        ]
      },
      {
        label: 'Producto',
        items: [
            {
              label: 'Search',
              icon: 'pi pi-search',
              routerLink: "/dashboard/products"
            },
            {
              label: 'Nuevo',
              icon: 'pi pi-plus',
              routerLink: "/dashboard/products/addEdit/0"
            },
        ]
      }
    ];
  }

  onLogout(){
    this.store.dispatch( logout() );
  }
}