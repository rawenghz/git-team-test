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
}