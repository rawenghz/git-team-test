import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

export interface ParticipantInfo {
  id: number;
  nom: string;
  prenom: string;
  role: string;
}

export interface EventStats {
  total_invites: number;
  nb_participe: number;
  nb_decline: number;
  nb_en_attente: number;
  taux_participation: number;
  taux_reponse: number;          // ← ajouter cette ligne
  participants: ParticipantInfo[];
  declines: ParticipantInfo[];
  en_attente: ParticipantInfo[];
  mon_status: string | null;
}

@Injectable({ providedIn: 'root' })
export class ParticipationService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl; // ex: 'http://localhost:8000/api'

  // Voter : participer ou décliner
  voter(eventId: number, status: 'participe' | 'decline'): Observable<any> {
    return this.http.post(`${this.api}/evenements/${eventId}/participer`, { status });
  }

  // Récupérer les stats (pour la directrice)
  getStats(eventId: number): Observable<EventStats> {
    return this.http.get<EventStats>(`${this.api}/evenements/${eventId}/stats`);
  }

  // Récupérer mon statut sur un événement
  getMonStatut(eventId: number): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${this.api}/evenements/${eventId}/mon-statut`);
  }
}