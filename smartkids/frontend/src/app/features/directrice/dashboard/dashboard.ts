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

  // ✅ default safe state (IMPORTANT)
  stats = signal<DashboardStats>({
    nb_enfants: 0,
    nb_utilisateurs: 0,
    nb_evenements: 0,
    nb_notifications: 0,
    derniers_utilisateurs: [],
    notifications_recentes: []
  });

  loading = signal(true);

  ngOnInit(): void {
    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);

        // keep safe empty state instead of null
        this.loading.set(false);
      }
    });
  }

  // (optional) helper if used in HTML
  labelRole(role: string): string {
    const map: any = {
      directrice: 'Directrice',
      animatrice: 'Animatrice',
      parent: 'Parent'
    };
    return map[role] || role;
  }

  timeAgo(date: string): string {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `Il y a ${days}j`;
    if (hours > 0) return `Il y a ${hours}h`;
    if (mins > 0) return `Il y a ${mins}min`;
    return "À l'instant";
  }
}