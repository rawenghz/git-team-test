import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

export interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  direction?: 'ltr' | 'rtl';
}

export interface ChatResponse {
  reply: string;
  direction: 'ltr' | 'rtl';
}

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/chatbot`;

  sendMessage(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.base}/chat`, { message });
  }
}
