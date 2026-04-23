import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable  } from 'rxjs';
import {environment } from '../../environments/environments';
import { Evenement, EvenementCreate, Notification, NotificationEnvoi, NotificationCreate } from '../models/models';



@Injectable({ providedIn: 'root' })
export class EvenementsService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/evenements`;

  getEvenements(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(`${this.base}/`);
  }

  getEvenement(id: number): Observable<Evenement> {
    return this.http.get<Evenement>(`${this.base}/${id}`);
  }

  getAll(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(`${this.base}/`);
  }

  create(data: EvenementCreate): Observable<Evenement> {
    return this.http.post<Evenement>(`${this.base}/`, data);
  }

  update(id: number, data: Partial<EvenementCreate>): Observable<Evenement> {
    return this.http.put<Evenement>(`${this.base}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/notifications`;

  getMesNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.base}/`);
  }

  envoyerNotification(data: NotificationEnvoi): Observable<{ detail: string }> {
    return this.http.post<{ detail: string }>(`${this.base}/envoyer`, data);
  }

  supprimerNotification(id: number): Observable<{ detail: string }> {
    return this.http.delete<{ detail: string }>(`${this.base}/${id}`);
  }

  getAll(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.base}/all`);
  }

  create(data: NotificationCreate): Observable<Notification> {
    return this.http.post<Notification>(`${this.base}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
  update(id: number, data: Partial<NotificationCreate>): Observable<Notification> {
  return this.http.put<Notification>(`${this.base}/${id}`, data);
}
}

export type { NotificationCreate };
