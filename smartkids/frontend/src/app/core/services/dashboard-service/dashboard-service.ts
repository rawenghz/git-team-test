import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStats } from '../../models/models';


@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);

  getDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>('http://localhost:8000/directrice/dashboard');
  }
}