import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/models';
import { environment } from '../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/users`;

  createUser(data: any) {
    return this.http.post<any>(`${this.base}/`, data);
  }

  getParents(): Observable<User[]> {
    return this.http.get<User[]>(`${this.base}/`).pipe(
      map((users: User[]) => users.filter((u: User) => u.role === 'parent'))
    );
  }
}