import { ChangeDetectionStrategy, Component, computed, inject, OnInit, Signal, signal } from '@angular/core';
import { TableModule, TablePageEvent } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { deletingProduct, loadProductRequest, productsFeature } from 'src/app/store';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';

const sizeDefaultProducts = 10;
interface SearchForm {
  search: FormControl<string | null >
}

@Component({
  selector: 'app-list-products',
  imports: [
    TableModule,
    Dialog,
    AsyncPipe,
    MessageModule,
    InputIcon,
    IconField,
    NgOptimizedImage,
    InputTextModule,
    ButtonModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListProductsComponent {
store = inject( Store );
  sizeDefault = sizeDefaultProducts;
  products$ = this.store.select( productsFeature.selectProducts );
  isLoading$ = this.store.select( productsFeature.selectIsLoading );
  error$: Observable<string | null > = this.store.select( productsFeature.selectError );
  saveSuccess$: Observable<boolean> = this.store.select( productsFeature.selectSaveSuccess );
  isSaving$ = this.store.select( productsFeature.selectIsSaving );
  pages$ = this.store.select( productsFeature.selectPages );
  currentPage = signal<number>(0);
  visible: boolean = false;
  idSelected = signal<number | null >( null );

  searchProductForm: Signal<FormGroup<SearchForm>> = computed(
    () => 
      new FormGroup<SearchForm>({
        search: new FormControl<string>('')
    })
  )

  showDialog( id: number ) {
    this.visible = true;
    this.idSelected.set( id );
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(page: number = 0, termino = "" ): void {
    this.store.dispatch( loadProductRequest( { page, size: this.sizeDefault, termino } ) );
  }

  onPageChange( event: TablePageEvent ){
    const { first, rows } = event;
    let page: number = 0
    if( first > 0){
      page = ( first / rows )
    }else{
      page = first
    }
    console.log( {  page, first, rows } );
    this.currentPage.set(first);
    this.loadProducts( page  )
  }

  onDeleteUser(  ){
    // console.log( this.idSelected() );
    if( this.idSelected() === null ){
      return;
    }
    this.store.dispatch( deletingProduct( { id: this.idSelected()! } ));
    this.visible = false;
  }

  onCancelDialog(){
    this.visible = false;
    this.idSelected.set( null );
  }

  onSearchProduct(){
    if( this.searchProductForm().invalid ){
      return;
    }
    const { search }  = this.searchProductForm().value;
    this.currentPage.set(0);
    this.loadProducts( 0, search || '' );
  }
}
