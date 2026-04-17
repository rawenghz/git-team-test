import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {JournalEntry } from '../models/models';
import { environment } from '../../environments/environments';


@Injectable({ providedIn: 'root' })
export class JournalService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/journal`;

  getJournalEnfant(enfantId: number): Observable<JournalEntry[]> {
    return this.http.get<JournalEntry[]>(`${this.base}/enfant/${enfantId}`);
  }
}