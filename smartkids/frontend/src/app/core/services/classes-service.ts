import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class ClassesService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/classes`;

  getClasses(): Observable<any[]>{ 
    return this.http.get<any[]>(this.base); 
  }
  getClasse(id: number): Observable<any>{ 
    return this.http.get<any>(`${this.base}/${id}`); 
  }
  createClasse(d: any): Observable<any>{
    return this.http.post<any>(this.base, d); 
  }
  updateClasse(id: number, d: any): Observable<any>{ 
    return this.http.put<any>(`${this.base}/${id}`, d); 
  }
  deleteClasse(id: number): Observable<void> {
     return this.http.delete<void>(`${this.base}/${id}`); 
  }
}
