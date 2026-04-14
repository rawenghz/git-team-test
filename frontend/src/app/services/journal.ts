import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JournalOut, JournalCreate, JournalUpdate, Enfant } from '../model/journal.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class JournalService {

  private api = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getJournalClasse(classeId: number, dateFiltre?: string): Observable<JournalOut[]> {
    let params = new HttpParams();
    if (dateFiltre) params = params.set('date_filtre', dateFiltre);
    return this.http.get<JournalOut[]>(
      `${this.api}/journal/classe/${classeId}`,
      { headers: this.getHeaders(), params }
    );
  }

  createJournal(data: JournalCreate): Observable<JournalOut> {
    return this.http.post<JournalOut>(
      `${this.api}/journal/`,
      data,
      { headers: this.getHeaders() }
    );
  }

  updateJournal(id: number, data: JournalUpdate): Observable<JournalOut> {
    return this.http.put<JournalOut>(
      `${this.api}/journals/${id}`,
      data,
      { headers: this.getHeaders() }
    );
  }

 

getEnfantsClasse(classeId: number): Observable<Enfant[]> {
  return this.http.get<any[]>(
    `${this.api}/enfants/`,
    { headers: this.getHeaders() }
  ).pipe(
    map(enfants => enfants.filter(e => e.classe_id === classeId))
  );
}
}