import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Classe {
  id: number;
  nom: string;
  section?: string;
  animatrice_id?: number;
}

@Injectable({ providedIn: 'root' })
export class ClasseService {
  private apiUrl = 'http://localhost:8000/classes';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<Classe[]> {
    return this.http.get<Classe[]>(this.apiUrl, { headers: this.getHeaders() });
  }
}