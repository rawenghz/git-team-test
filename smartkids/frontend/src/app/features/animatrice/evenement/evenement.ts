import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-evenement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evenement.html',
  styleUrl: './evenement.css'
})
export class Evenement implements OnInit {

  private http = inject(HttpClient);
  private api = 'http://127.0.0.1:8000';

  evenements = signal<any[]>([]);
  loading = signal(true);

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('smartkids_token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  ngOnInit(): void {
    this.http.get<any[]>(`${this.api}/evenements/`, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.evenements.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getStatut(date: string): string {
    const aujourd_hui = new Date();
    const dateEvent = new Date(date);
    return dateEvent >= aujourd_hui ? 'À venir' : 'Passé';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }
}