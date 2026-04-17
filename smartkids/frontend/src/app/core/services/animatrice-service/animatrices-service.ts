import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class AnimatricesService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/users`;

  getAnimatrices(): Observable<any[]> { return this.http.get<any[]>(this.base); }
}
