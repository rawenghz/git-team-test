import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoginRequest, User } from '../models/models';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly TOKEN_KEY = 'smartkids_token';
  private readonly USER_KEY  = 'smartkids_user';

  currentUser = signal<User | null>(this.loadUser());

login(credentials: LoginRequest): Observable<any> {
  return this.http.post<any>(`${environment.apiUrl}/auth/login`, credentials).pipe(
    tap(res => {
      const token = res.access_token;
      const user = {
        id: res.user_id,
        role: res.role,
        nom: res.nom,
        email: res.email
      };

      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this.currentUser.set(user);
    })
  );
}

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isParent(): boolean {
    return this.currentUser()?.role === 'parent';
  }

  isDirector(): boolean {
    return this.currentUser()?.role === 'directrice';
  }

  isAnimatrice(): boolean {
    return this.currentUser()?.role === 'animatrice';
  }

  hasRole(roles: string[]): boolean {
    return roles.includes(this.currentUser()?.role || '');
  }

  private loadUser(): User | null {
    try {
      const stored = localStorage.getItem(this.USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  }

}