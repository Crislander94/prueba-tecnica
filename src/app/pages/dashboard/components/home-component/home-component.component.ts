import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ProductAPI, UserAPI } from 'src/app/models';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-home-component',
  imports: [ TableModule ],
  templateUrl: './home-component.component.html',
  styleUrl: './home-component.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponentComponent {
  dashboardService = inject( DashboardService );

  userLastFive$ = signal<UserAPI[]>([]); // Signal para almacenar usuarios
  productLastFive$ = signal<ProductAPI[]>([]); // Signal para almacenar productos

  constructor(){
    this.loadData();
  }

  private loadData() {
    this.dashboardService.getLastFiveUser().subscribe( ({ data }) => {
      this.userLastFive$.set(data);
    });

    this.dashboardService.getLastFiveProducts().subscribe(({ data }) => {
      this.productLastFive$.set( data );
    });
  }
}