import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
  Signal,
  SimpleChanges} from '@angular/core';

import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { Rol } from '../../../interfaces/types';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { 
  loadUserById,
  savingRolUser,
  savingUser,
  savingUserFailure,
  updatingUser,
  usersFeature } from '../../../store';
import { filter, firstValueFrom, Observable, Subject, take, takeUntil } from 'rxjs';
import { RolService } from '../../../services/rol.service';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { AsyncPipe } from '@angular/common';
import { UserAPI } from 'src/app/models';

interface UserForm{
  username: FormControl<string>,
  mail: FormControl<string>,
  password: FormControl<string>,
}

interface addUserForm extends UserForm {
  rol: FormControl<Rol | null>
}

interface AddRoleForm{
  rol: FormControl<Rol | null>
}

@Component({
  selector: 'app-add-usuario',
  imports: [
    InputTextModule,
    SelectModule,
    ButtonModule,
    ToastModule,
    AsyncPipe,
    MessageModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-edit-usuario.component.html',
  styleUrl: './add-edit-usuario.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditUsuarioComponent implements OnInit {
  destroy$ = new Subject<void>();
  id = input<number>();
  roles = signal<Rol[]>([]);
  readonly store = inject( Store );
  isSaving$: Observable<boolean> = this.store.select( usersFeature.selectIsSaving );
  error$: Observable<string | null > = this.store.select( usersFeature.selectError );
  saveSuccess$: Observable<boolean> = this.store.select( usersFeature.selectSaveSuccess );
  usuarioByID$ : Observable<UserAPI | null > = this.store.select( usersFeature.selectUsuario );
  rolService = inject( RolService );
  private userForm: UserForm = {
    username: new FormControl<string>( '', {
      nonNullable: true,
      validators: [ Validators.required ]
    } ),
    mail: new FormControl<string>('' , {
      nonNullable: true,
      validators: [
        Validators.required, 
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
      ]
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{1,8}$/),
      ]
    })
  }
  
  private rolInput = {
    rol: new FormControl<Rol | null>( null, {
      nonNullable: true,
      validators: [ Validators.required ]
    })
  }

  private addUserForm: addUserForm = {
    ...this.userForm,
    ...this.rolInput
  }

  addEditUserForm: Signal<FormGroup<UserForm | addUserForm >> = computed(
    () => 
      new FormGroup<UserForm | addUserForm>( this.id()?.toString() !== "0" ? { ...this.userForm } : { ...this.addUserForm } )
  );

  addRolForm: Signal<FormGroup<AddRoleForm>> = computed(
    () =>
      new FormGroup<AddRoleForm>({ ...this.rolInput })
  );

  constructor(){
    effect(() =>{
      if(this.id()?.toString() === "0"){
        this.addEditUserForm().reset();
      }
    } );
  }
  
  async ngOnInit() {
    await this.obtenerRoles();
    

    if(this.id()?.toString() === "0"){
      this.saveSuccess$
      .pipe( takeUntil( this.destroy$ ))
      .subscribe(success => {
        if (success) {
          this.addEditUserForm().reset(); // Limpiar formulario
        }
      });
    }else{
      this.store.dispatch( loadUserById( { id: this.id() || 0 }) )
      const usuarioByID =  await firstValueFrom( this.usuarioByID$.pipe(
        filter(usuario => usuario !== null), // Filtra valores nulos
        take(1) // Toma solo el primer valor válido
      ) );

      if( usuarioByID !== null ){
        this.addEditUserForm().setValue({
          username: usuarioByID.username,
          mail: usuarioByID.mail,
          password: usuarioByID.password || '',
        })
      }
    }
  }

  ngOnChange( changes: SimpleChanges){
    console.log( changes );
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

  async obtenerRoles(): Promise<void> {
    const roles = await firstValueFrom(
      this.rolService.getRoles()
    );
    this.roles.set( roles );
  }

  getUserByID(): void{
    this.store.dispatch( loadUserById( { id: this.id() || 0 }) )
  }

  onSubmitUser() {
    if (this.addEditUserForm().invalid) {
      return;
    }
    if( this.id() === 0 && this.addRolForm().invalid ){
      return;
    }

    const { username, mail, password } = this.addEditUserForm().value;
    if( this.id()?.toString() === "0" ){
      const { rol } = this.addRolForm().value;
      let rolID = Number(rol?.id) || 0;
      this.store.dispatch(savingUser({
        username: username || '',
        password: password || '',
        mail: mail || '',
        rolId: rolID
      }));
    }else{
      this.store.dispatch(updatingUser({
        id: Number(this.id()),
        username: username || '',
        password: password || '',
        mail: mail || '',
      }));
    }
  }

  async onSubmitRol(){
    if(this.addRolForm().invalid){
      return;
    }
    const { rol } = this.addRolForm().value;
    let rolID = Number(rol?.id) || 0;
    const usuarioByID = await firstValueFrom(
      this.usuarioByID$
    )

    if( usuarioByID !== null ){
      if( usuarioByID.roles !== undefined ){
        if(usuarioByID.roles.find( u => u.id === rolID ) !== undefined ){
          this.store.dispatch( savingUserFailure({ error: "Este usuario ya cuenta con este rol"}))
          return;
        }
      }
    }

    this.store.dispatch( savingRolUser({ 
      idUsuario: this.id() || 0,
      idRol: rolID
    }))
  }
}