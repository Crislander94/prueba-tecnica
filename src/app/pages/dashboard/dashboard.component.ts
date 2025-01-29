import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardLayoutComponent } from '../../layout/component/dashboard-layout/dashboard-layout.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardLayoutComponent, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
}