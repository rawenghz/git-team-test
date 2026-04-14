import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  nb_enfants: number;
  nb_utilisateurs: number;
  nb_evenements: number;
  nb_notifications: number;
  derniers_utilisateurs: any[];
  notifications_recentes: any[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);

  getDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>('http://localhost:8000/dashboard/directrice');
  }
}