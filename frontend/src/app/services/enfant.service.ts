import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enfant, EnfantCreate } from '../models/enfant.model';

@Injectable({ providedIn: 'root' })
export class EnfantService {
  private apiUrl = 'http://localhost:8000/enfants';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<Enfant[]> {
    return this.http.get<Enfant[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<Enfant> {
    return this.http.get<Enfant>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  create(data: EnfantCreate): Observable<Enfant> {
    return this.http.post<Enfant>(this.apiUrl, data, { headers: this.getHeaders() });
  }

  update(id: number, data: Partial<EnfantCreate>): Observable<Enfant> {
    return this.http.put<Enfant>(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}