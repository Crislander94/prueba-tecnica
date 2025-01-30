import { ChangeDetectionStrategy, Component, computed, inject, OnInit, Signal, signal } from '@angular/core';
import { TableModule, TablePageEvent } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { AccordionModule } from 'primeng/accordion';
import { Store } from '@ngrx/store';
import { authFeature, deletingUser, loadUserRequest, uploadingUsersFromCSV, usersFeature } from '../../../store';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { Tooltip } from 'primeng/tooltip';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserCSVValidate } from 'src/app/models';
import { UsuarioService } from 'src/app/services/usuario.service';

const sizeDefault = 10;
interface SearchForm {
  search: FormControl<string | null >
}

interface UploadUser{
  file: FormControl<File | null>
}


@Component({
  selector: 'app-list-usuarios',
  imports: [
    TableModule,
    Dialog,
    AsyncPipe,
    MessageModule,
    InputIcon,
    AccordionModule,
    IconField,
    InputTextModule,
    Tooltip,
    ButtonModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './list-usuarios.component.html',
  styleUrl: './list-usuarios.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListUsuariosComponent implements OnInit {
  store = inject( Store );
  //!Mala práctica se debe ejecutar el proceso por medio de el store
  usuarioService = inject( UsuarioService );

  sizeDefault = sizeDefault;
  usuarios$ = this.store.select( usersFeature.selectUsuarios );
  isLoading$ = this.store.select( usersFeature.selectIsLoading );
  error$: Observable<string | null > = this.store.select( usersFeature.selectError );
  saveSuccess$: Observable<boolean> = this.store.select( usersFeature.selectSaveSuccess );
  responseUploadFile$: Observable<UserCSVValidate | null > = this.store.select( usersFeature.selectResponseUploadFile );
  isSaving$ = this.store.select( usersFeature.selectIsSaving );
  pages$ = this.store.select( usersFeature.selectPages );
  currentPage = signal<number>(0);
  visible: boolean = false;
  visibleUpload: boolean = false;
  idSelected = signal<number | null >( null );
  selectedFile: File | null = null;
  userAuth$ = this.store.select( authFeature.selectUsuario );

  showDialog( id: number ) {
    this.visible = true;
    this.idSelected.set( id );
  }

  onCancelDialog(){
    this.visible = false;
    this.idSelected.set( null );
  }


  showDialogUpload() {
    console.log("abriendo modal....")
    this.visibleUpload = true;
  }

  onCancelDialogUpload(){
    this.visibleUpload = false;
  }
  

  searchUserForm: Signal<FormGroup<SearchForm>> = computed(
    () => 
      new FormGroup<SearchForm>({
        search: new FormControl<string>('')
    })
  )

  uploadUserForm: Signal<FormGroup<UploadUser>> = computed(
    () => 
      new FormGroup<UploadUser>({
        file: new FormControl<File | null>(null)
    })
  )

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page: number = 0, termino : string = "" ): void {
    this.store.dispatch( loadUserRequest( { page, size: this.sizeDefault, termino } ) );
  }

  onPageChange( event: TablePageEvent ){
    const { first, rows } = event;
    let page: number = 0
    if( first > 0){
      page = ( first / rows )
    }else{
      page = first
    }
    this.currentPage.set(first);
    this.loadUsers( page  )
  }

  // Método para manejar la selección de archivos
  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if( inputElement.files !== null ){
      if (inputElement.files.length > 0) {
        const file = inputElement.files[0];
        if( file.type !== "text/csv"){
          alert("Solo se permiten archivos con extensión .csv");
          inputElement.value = '';
          this.selectedFile = null;
          return;
        }
        this.selectedFile = file;
      }
    }
  }

  onDeleteUser(  ){
    // console.log( this.idSelected() );
    if( this.idSelected() === null ){
      return;
    }
    this.store.dispatch( deletingUser( { id: this.idSelected()! } ));
    this.visible = false;
  }

  
  onSearchUser(){
    if( this.searchUserForm().invalid ){
      return;
    }
    const { search }  = this.searchUserForm().value;
    this.currentPage.set(0);
    this.loadUsers( 0, search || '' );
  }

  onUploadFile(fileInput: HTMLInputElement){
    if( this.uploadUserForm().invalid ){
      return;
    }

    if (!this.selectedFile) {
      alert('Por favor, selecciona un archivo.');
      return;
    }
    const data = new FormData();
    data.append('file', this.selectedFile); // Agregamos el archivo al FormData
    
    this.store.dispatch( uploadingUsersFromCSV( { data } ));
    this.visibleUpload = false;
    this.selectedFile = null;
    this.searchUserForm().reset();
    // Limpiar el input manualmente
    if (fileInput) {
      fileInput.value = ''; // Esto borra la selección del archivo
    }
  }

  onDownloadUsersPdf() {
    this.usuarioService.exportarUsersPDF().subscribe( response => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'usuarios.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  onDownloadUsersExcel() {
    this.usuarioService.exportarUsersExcel().subscribe( response => {
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'usuarios.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}