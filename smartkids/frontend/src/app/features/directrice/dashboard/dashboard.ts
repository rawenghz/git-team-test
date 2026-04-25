import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboard-service/dashboard-service';
import { DashboardStats } from '../../../core/models/models';

@Component({
  selector: 'app-dashboard-directrice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardDirectriceComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  stats = signal<DashboardStats>({
    nb_enfants: 0,
    nb_utilisateurs: 0,
    nb_evenements: 0,
    nb_notifications: 0,
    taux_absence: {
      total_absences: 0,
      total_jours: 0,
      taux_pourcentage: 0
    },
    taux_absence_par_enfant: [],
    derniers_utilisateurs: [],
    notifications_recentes: []
  });

  loading = signal(true);

  absenceColor = computed(() => {
    const taux = this.stats().taux_absence?.taux_pourcentage ?? 0;
    if (taux <= 10) return 'success';
    if (taux <= 25) return 'warning';
    return 'danger';
  });

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

  labelRole(role: string): string {
    const map: Record<string, string> = {
      directrice: 'Directrice',
      animatrice: 'Animatrice',
      parent: 'Parent'
    };
    return map[role] || role;
  }

  roleBadgeClass(role: string): string {
    const map: Record<string, string> = {
      directrice: 'badge-directrice',
      animatrice: 'badge-animatrice',
      parent: 'badge-parent'
    };
    return map[role] || 'bg-secondary';
  }

  bellClass(type: string): string {
    const map: Record<string, string> = {
      info: 'bell-info',
      alerte: 'bell-alerte',
      nouveau: 'bell-nouveau'
    };
    return map[type] || 'bell-info';
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

  avatarInitial(nom: string): string {
    return nom?.charAt(0)?.toUpperCase() || '?';
  }
}