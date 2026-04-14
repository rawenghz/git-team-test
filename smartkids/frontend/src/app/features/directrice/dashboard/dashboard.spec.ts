import { Component, OnInit, inject, signal } from '@angular/core';
import { DashboardService, DashboardStats } from '../../../core/services/dashboard-service/dashboard-service';

@Component({
  selector: 'app-dashboard-directrice',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardDirectriceComponent implements OnInit {

  private dashboardService = inject(DashboardService);

  stats = signal<DashboardStats | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }
}