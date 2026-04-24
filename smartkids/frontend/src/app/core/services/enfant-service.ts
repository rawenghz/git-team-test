import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Enfant, EnfantCreate } from '../models/models';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class EnfantsService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/enfants`;
  private api = 'http://127.0.0.1:8000';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('smartkids_token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ── Méthodes existantes ──
  getMesEnfants(): Observable<Enfant[]> {
    return this.http.get<Enfant[]>(this.base);
  }

  getEnfant(id: number): Observable<Enfant> {
    return this.http.get<Enfant>(`${this.base}/${id}`);
  }

  updateEnfant(id: number, data: Partial<Enfant>): Observable<Enfant> {
    return this.http.put<Enfant>(`${this.base}/${id}`, data);
  }

  getAllEnfants(): Observable<Enfant[]> {
    return this.http.get<Enfant[]>(this.base);
  }

  createEnfant(data: EnfantCreate): Observable<Enfant> {
    return this.http.post<Enfant>(this.base, data);
  }

  deleteEnfant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  // ✅ AJOUT : récupère la classe de l'animatrice connectée
  getMyClasse(): Observable<any> {
    return this.http.get<any>(
      `${this.api}/classes/my-classe`,
      { headers: this.getHeaders() }
    );
  }

  // ✅ AJOUT : récupère les enfants d'une classe spécifique
  getEnfantsClasse(classeId: number): Observable<Enfant[]> {
    return this.http.get<any[]>(
      `${this.api}/enfants/`,
      { headers: this.getHeaders() }
    ).pipe(
      map(enfants => enfants.filter(e => e.classe_id === classeId))
    );
  }
}