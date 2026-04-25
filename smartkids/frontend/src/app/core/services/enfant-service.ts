import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enfant, EnfantCreate } from '../models/models';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class EnfantsService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/enfants`;

  getMesEnfants(): Observable<Enfant[]> {
    return this.http.get<Enfant[]>(`${this.base}/`);
  }

  getEnfant(id: number): Observable<Enfant> {
    return this.http.get<Enfant>(`${this.base}/${id}`);
  }

  updateEnfant(id: number, data: Partial<Enfant>): Observable<Enfant> {
    return this.http.put<Enfant>(`${this.base}/${id}`, data);
  }

  getEnfantsNonAssignes(): Observable<Enfant[]> {
    return this.http.get<Enfant[]>(`${this.base}/non-assignes`);
  }

  getAllEnfants(): Observable<Enfant[]> {
    return this.http.get<Enfant[]>(`${this.base}/`);
  }

  createEnfant(data: EnfantCreate): Observable<Enfant> {
    return this.http.post<Enfant>(`${this.base}/`, data);
  }

  deleteEnfant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}