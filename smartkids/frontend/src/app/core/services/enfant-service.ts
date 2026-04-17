<<<<<<< HEAD
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import{Enfant} from '../models/models';
@Injectable({ providedIn: 'root' })
export class EnfantsService {

  private apiUrl = 'http://localhost:8000/enfants';

  constructor(private http: HttpClient) {}

  getMesEnfants() {
    return this.http.get<Enfant[]>(`${this.apiUrl}/`);
  }

  getEnfant(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateEnfant(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
  getEnfantsNonAssignes() {
  return this.http.get<Enfant[]>(`${this.apiUrl}/non-assignes`);
}
=======
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enfant, EnfantCreate } from '../models/models';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class EnfantsService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/enfants`;

  // ── Méthodes existantes du collègue (inchangées) ──
  getMesEnfants(): Observable<Enfant[]> {
    return this.http.get<Enfant[]>(this.base);
  }

  getEnfant(id: number): Observable<Enfant> {
    return this.http.get<Enfant>(`${this.base}/${id}`);
  }

  updateEnfant(id: number, data: Partial<Enfant>): Observable<Enfant> {
    return this.http.put<Enfant>(`${this.base}/${id}`, data);
  }

  // ── Méthodes ajoutées pour gerer-enfant ──
  getAllEnfants(): Observable<Enfant[]> {
    return this.http.get<Enfant[]>(this.base);
  }

  createEnfant(data: EnfantCreate): Observable<Enfant> {
    return this.http.post<Enfant>(this.base, data);
  }

  deleteEnfant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
>>>>>>> f5aea04e40189a5a821390d1c54c7d8f62b359af
}