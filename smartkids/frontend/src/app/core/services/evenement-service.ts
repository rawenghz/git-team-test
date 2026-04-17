import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable  } from 'rxjs';
import {Evenement, Notification, NotificationEnvoi } from '../models/models';
import {environment } from '../../environments/environments';


@Injectable({ providedIn: 'root' })
export class EvenementsService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/evenements`;

  getEvenements(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(this.base);
  }

  getEvenement(id: number): Observable<Evenement> {
    return this.http.get<Evenement>(`${this.base}/${id}`);
  }
}
@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/notifications`;

  getMesNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.base}`);
  }

  envoyerNotification(data: NotificationEnvoi): Observable<{ detail: string }> {
    return this.http.post<{ detail: string }>(`${this.base}/envoyer`, data);
  }

  supprimerNotification(id: number): Observable<{ detail: string }> {
    return this.http.delete<{ detail: string }>(`${this.base}/${id}`);
  }
}