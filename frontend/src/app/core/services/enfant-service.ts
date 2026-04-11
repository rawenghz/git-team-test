import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable  } from 'rxjs';
import { Enfant } from '../models/models';
import { environment } from '../../environments/environments';


@Injectable({ providedIn: 'root' })
export class EnfantsService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/enfants`;

  getMesEnfants(): Observable<Enfant[]> {
    return this.http.get<Enfant[]>(`${this.base}`);
  }

  getEnfant(id: number): Observable<Enfant> {
    return this.http.get<Enfant>(`${this.base}/${id}`);
  }

  updateEnfant(id: number, data: Partial<Enfant>): Observable<Enfant> {
    return this.http.put<Enfant>(`${this.base}/${id}`, data);
  }
}
