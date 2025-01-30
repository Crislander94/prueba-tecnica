import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  Signal} from '@angular/core';


import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { AsyncPipe } from '@angular/common';


import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { filter, firstValueFrom, Observable, Subject, take, takeUntil } from 'rxjs';
import { authFeature, productsFeature } from 'src/app/store';
import { ProductAPI } from 'src/app/models';
import { loadProductById, savingProduct, updatingProduct } from '../../../store/products/products.actions';

interface ProductForm{
  nombre: FormControl<string>,
  cantidad: FormControl<string>,
  imagen: FormControl<string>,
  precio: FormControl<string>
}


@Component({
  selector: 'app-add-edit-products',
  imports: [
    InputTextModule,
    SelectModule,
    ButtonModule,
    ToastModule,
    AsyncPipe,
    MessageModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-edit-product.component.html',
  styleUrl: './add-edit-product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditProductComponent implements OnInit {
  destroy$ = new Subject<void>();
    id = input<number>();
    readonly store = inject( Store );
    isSaving$: Observable<boolean> = this.store.select( productsFeature.selectIsSaving );
    error$: Observable<string | null > = this.store.select( productsFeature.selectError );
    saveSuccess$: Observable<boolean> = this.store.select( productsFeature.selectSaveSuccess );
    productByID$ : Observable<ProductAPI | null > = this.store.select( productsFeature.selectProduct );
    userAuth$ = this.store.select( authFeature.selectUsuario );

    private productForm: ProductForm = {
      nombre: new FormControl<string>( '', {
        nonNullable: true,
        validators: [ Validators.required ]
      } ),
      cantidad: new FormControl<string>('' , {
        nonNullable: true,
        validators: [
          Validators.required, 
          Validators.pattern(/^[0-9]$/)
        ]
      }),
      imagen: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.required,
        ]
      }),
      precio: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.required,
        ]
      })
    }
  
    addEditProductForm: Signal<FormGroup<ProductForm>> = computed(
      () => 
        new FormGroup<ProductForm>( this.productForm )
    );
  
    constructor(){
      effect(() =>{
        if(this.id()?.toString() === "0"){
          this.addEditProductForm().reset();
        }
      } );
    }
    
    async ngOnInit() {
      
  
      if(this.id()?.toString() === "0"){
        this.saveSuccess$
        .pipe( takeUntil( this.destroy$ ))
        .subscribe(success => {
          if (success) {
            this.addEditProductForm().reset(); // Limpiar formulario
          }
        });
      }else{
        this.store.dispatch( loadProductById( { id: this.id() || 0 }) )
        const productByID =  await firstValueFrom( this.productByID$.pipe(
          filter( product => product !== null), // Filtra valores nulos
          take(1) // Toma solo el primer valor válido
        ) );
  
        if( productByID !== null ){
          this.addEditProductForm().setValue({
            nombre: productByID.nombre,
            cantidad: productByID.cantidad.toString(),
            imagen: productByID.imagen,
            precio: productByID.precio.toString(),
          })
        }
      }
    }
  
    ngOnDestroy(){
      this.destroy$.next();
      this.destroy$.complete();
    }

  
    onSubmitProduct() {
      if (this.addEditProductForm().invalid) {
        return;
      }
  
      const { nombre, cantidad, imagen, precio } = this.addEditProductForm().value;
      if( this.id()?.toString() === "0" ){
        
        
        this.store.dispatch(savingProduct({
          nombre: nombre || '',
          cantidad: Number( cantidad ) || 0,
          imagen: imagen || '',
          precio: Number( precio ) || 0,
        }));
      }else{
        this.store.dispatch(updatingProduct({
          id: Number(this.id()),
          nombre: nombre || '',
          cantidad: Number( cantidad ) || 0,
          imagen: imagen || '',
          precio: Number( precio ) || 0,
        }));
      }
    }
}
