import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Notification {
  id: number;
  message: string;
  type: 'info' | 'alerte' | 'nouveau';
  user_id: number | null;
  created_at: string;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.html',
  styleUrl: './notification.css'
})
export class NotificationComponent implements OnInit {

  private http = inject(HttpClient);
  private api = 'http://127.0.0.1:8000';

  notifications = signal<Notification[]>([]);
  loading = signal(true);

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('smartkids_token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  ngOnInit(): void {
    this.http.get<Notification[]>(`${this.api}/notifications/`, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.notifications.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getTypeBadge(type: string): string {
    switch (type) {
      case 'alerte':  return '🔴 Alerte';
      case 'info':    return '🔵 Info';
      case 'nouveau': return '🟢 Nouveau';
      default: return type;
    }
  }

  timeAgo(date: string): string {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `Il y a ${days}j`;
    if (hours > 0) return `Il y a ${hours}h`;
    if (mins > 0) return `Il y a ${mins}min`;
    return "À l'instant";
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }
}