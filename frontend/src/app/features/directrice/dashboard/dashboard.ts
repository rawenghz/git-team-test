import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

// ── Models ─────────────────────────────────────────────────────────────
export interface User {
  id: number;
  nom: string;
  email: string;
  role: 'parent' | 'animatrice' | 'directrice';
  created_at?: string;
}

export interface Notification {
  id: number;
  message: string;
  type: 'info' | 'alerte' | 'nouveau';
  user_id?: number;
  created_at: string;
}

export interface DashboardStats {
  nb_enfants: number;
  nb_utilisateurs: number;
  nb_evenements: number;
  nb_notifications: number;
  derniers_utilisateurs: User[];
  notifications_recentes: Notification[];
}

// ── Component ──────────────────────────────────────────────────────────
@Component({
  selector: 'app-dashboard-directrice',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardDirectriceComponent implements OnInit {
  private http = inject(HttpClient);

  stats   = signal<DashboardStats | null>(null);
  loading = signal(true);

  // ── Données de démonstration (fallback si API non dispo) ──
  private demoStats: DashboardStats = {
    nb_enfants: 4,
    nb_utilisateurs: 5,
    nb_evenements: 3,
    nb_notifications: 5,
    derniers_utilisateurs: [
      { id: 1, nom: 'Mme Directrice', email: 'directrice@smartkids.com', role: 'directrice' },
      { id: 2, nom: 'Mme Fatima',     email: 'fatima@smartkids.com',     role: 'animatrice' },
      { id: 3, nom: 'Mme Benali',     email: 'benali@email.com',         role: 'parent'     },
      { id: 4, nom: 'M. Mourad',      email: 'mourad@email.com',         role: 'parent'     },
    ],
    notifications_recentes: [
      { id: 1, message: 'Réunion parents-enseignants le 28 février', type: 'info',    created_at: this.hoursAgo(2)  },
      { id: 2, message: "Lina a été absente aujourd'hui",            type: 'alerte',  created_at: this.hoursAgo(5)  },
      { id: 3, message: 'Nouvelle activité peinture ajoutée',        type: 'nouveau', created_at: this.daysAgo(1)   },
      { id: 4, message: 'Photos de la sortie disponibles',           type: 'info',    created_at: this.daysAgo(2)   },
    ]
  };

  ngOnInit(): void {
    // Appel API réel — retombe sur les données démo si le backend est absent
    this.http.get<DashboardStats>('http://localhost:8000/dashboard/directrice').subscribe({
      next: data => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: () => {
        // Pas de backend encore → on affiche les données démo
        this.stats.set(this.demoStats);
        this.loading.set(false);
      }
    });
  }

  // ── Computed helpers ──────────────────────────────────────
  dernierUsers() {
    return this.stats()?.derniers_utilisateurs ?? [];
  }

  recentNotifs() {
    return this.stats()?.notifications_recentes ?? [];
  }

  labelRole(role: string): string {
    const map: Record<string, string> = {
      directrice: 'Directrice',
      animatrice: 'Animatrice',
      parent: 'Parent'
    };
    return map[role] ?? role;
  }

  timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days  = Math.floor(hours / 24);
    if (days  >= 2) return `Il y a ${days}j`;
    if (days  === 1) return 'Hier';
    if (hours >= 1) return `Il y a ${hours}h`;
    if (mins  >= 1) return `Il y a ${mins}min`;
    return "À l'instant";
  }

  // ── Helpers pour créer des dates de démo ─────────────────
  private hoursAgo(h: number): string {
    return new Date(Date.now() - h * 3600000).toISOString();
  }
  private daysAgo(d: number): string {
    return new Date(Date.now() - d * 86400000).toISOString();
  }
}