import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JournalService } from '../../../core/services/journal-service';
import { AuthService } from '../../../core/services/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';

interface DashboardAnimatrice {
  classe_nom: string;
  nb_enfants: number;
  nb_evenements: number;
  nb_notifications: number;
  notifications_recentes: any[];
}

@Component({
  selector: 'app-dashboard-animatrice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardAnimatriceComponent implements OnInit {

  private journalService = inject(JournalService);
  private auth = inject(AuthService);
  private http = inject(HttpClient);
  private api = 'http://127.0.0.1:8000';

  stats = signal<DashboardAnimatrice>({
    classe_nom: '',
    nb_enfants: 0,
    nb_evenements: 0,
    nb_notifications: 0,
    notifications_recentes: []
  });

  loading = signal(true);

  get nomAnimatrice(): string {
    return this.auth.currentUser()?.nom ?? 'Animatrice';
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('smartkids_token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  ngOnInit(): void {
    // ✅ étape 1 : récupérer la classe
    this.journalService.getMyClasse().subscribe({
      next: (classe) => {

        // ✅ étape 2 : appels parallèles — enfants + événements + notifications
        forkJoin({
          enfants:       this.http.get<any[]>(`${this.api}/enfants/`, { headers: this.getHeaders() }),
          evenements:    this.http.get<any[]>(`${this.api}/evenements/`, { headers: this.getHeaders() }),
          notifications: this.http.get<any[]>(`${this.api}/notifications/`, { headers: this.getHeaders() })
        }).subscribe({
          next: ({ enfants, evenements, notifications }) => {
            // filtrer les enfants de la classe de l'animatrice
            const enfantsClasse = enfants.filter(e => e.classe_id === classe.id);

            this.stats.set({
              classe_nom: classe.nom,
              nb_enfants: enfantsClasse.length,
              nb_evenements: evenements.length,
              nb_notifications: notifications.length,
              notifications_recentes: notifications.slice(0, 4) // ✅ 4 dernières
            });
            this.loading.set(false);
          },
          error: () => this.loading.set(false)
        });
      },
      error: () => this.loading.set(false)
    });
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