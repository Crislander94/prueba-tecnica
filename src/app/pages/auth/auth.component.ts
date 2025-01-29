import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MessageModule } from 'primeng/message';
import { Select } from 'primeng/select';

import * as AuthActions from '../../store/auth/auth.actions';
import { Store } from '@ngrx/store';
import {  AsyncPipe } from '@angular/common';
import { RolService } from '../../services/rol.service';
import { Rol } from '../../interfaces/types';
import { authFeature } from 'src/app/store/auth/auth.state';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-auth',
  imports: [
    ButtonModule,
    AsyncPipe,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    MessageModule,
    Select,
    ReactiveFormsModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent implements OnInit{
  loginForm: FormGroup;
  private store = inject(Store);
  isLoading$ = this.store.select( authFeature.selectIsLoading );
  error$ = this.store.select( authFeature.selectError );

  roles: Rol[] | undefined;
  rolService = inject(RolService);
  selectedRol: Rol | undefined;
  loginFormSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      userNameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rol: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    this.obtenerRoles();
  }

  obtenerRoles(): void {
    this.rolService.getRoles().subscribe({
      next: (data) => {
        this.roles = data; // Asignamos los roles a la lista
      },
      error: (err) => {
        console.error('Error al obtener los roles:', err);
      }
    });
  }

  onSubmit() {
    this.loginFormSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    const { userNameOrEmail, password, rol } = this.loginForm.value;
    this.store.dispatch(AuthActions.loginRequest({ userNameOrEmail, password, rol: rol.id }));
  }
}