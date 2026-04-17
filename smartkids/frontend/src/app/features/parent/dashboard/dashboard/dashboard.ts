import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { DashboardService } from '../../../../core/services/dashboard-service';

interface JournalEntry {
  date: string;
  appris: string;
  activite: string;
  evaluation: 'Très bien' | 'Bien' | 'Moyen' | 'À améliorer';
  humeur: 'heureux' | 'neutre' | 'triste';
  note?: string;
}

interface EnfantDashboard {
  id: number;
  nom: string;
  genre: 'fille' | 'garcon';
  animatrice: string;
  journal: JournalEntry[];
}

interface NotifItem {
  id: number;
  message: string;
  temps_relatif: string;
  type: 'Info' | 'Alerte' | 'Nouveau';
}

interface DashboardData {
  parent_nom: string;
  total_evenements: number;
  total_notifications: number;
  enfants: EnfantDashboard[];
  notifications: NotifItem[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgClass],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private svc = inject(DashboardService);

  dashboard        = signal<DashboardData | null>(null);
  loading          = signal(true);
  selectedEnfantId = signal<number | null>(null);

  selectedEnfant = computed(() =>
    this.dashboard()?.enfants.find(e => e.id === this.selectedEnfantId()) ?? null
  );

  hasEnfants = computed(() => (this.dashboard()?.enfants?.length ?? 0) > 0);

  ngOnInit() {
    this.svc.getParentDashboard().subscribe({
      next: (data) => {
        this.dashboard.set(data);
        if (data.enfants?.length) {
          this.selectedEnfantId.set(data.enfants[0].id);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  selectEnfant(id: number) { this.selectedEnfantId.set(id); }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('fr-FR', {
      weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  getBadgeClass(type: string): string {
    return {
      'Info'   : 'text-bg-info',
      'Alerte' : 'text-bg-danger',
      'Nouveau': 'text-bg-success',
    }[type] ?? 'text-bg-secondary';
  }

  getEvalClass(eval_: string): string {
    return {
      'Très bien'  : 'text-bg-success',
      'Bien'       : 'text-bg-primary',
      'Moyen'      : 'text-bg-warning',
      'À améliorer': 'text-bg-danger',
    }[eval_] ?? 'text-bg-secondary';
  }

  getHumeurEmoji(humeur: string): string {
    return { 'heureux': '😊', 'neutre': '😐', 'triste': '😟' }[humeur] ?? '😊';
  }
}