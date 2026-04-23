import { Component, signal, inject, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatMessage } from '../../../core/services/chatbot-service';

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chatbot-widget.html',
  styleUrls: ['./chatbot-widget.css']
})
export class ChatbotWidgetComponent implements AfterViewChecked {
  private chatbotService = inject(ChatbotService);

  isOpen = signal(false);
  isLoading = signal(false);
  userInput = '';
  messages = signal<ChatMessage[]>([
    {
      role: 'bot',
      content: 'Bonjour ! 👋 Je suis l\'assistant SmartKids. Comment puis-je vous aider ?',
      timestamp: new Date()
    }
  ]);

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  private shouldScroll = false;

  toggleChat(): void {
    this.isOpen.update(v => !v);
  }

  closeChat(): void {
    this.isOpen.set(false);
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  sendMessage(): void {
    const text = this.userInput.trim();
    if (!text || this.isLoading()) return;

    const userDir = this.detectDirection(text);

    // Add user message
    this.messages.update(msgs => [
      ...msgs,
      { role: 'user', content: text, timestamp: new Date(), direction: userDir }
    ]);
    this.userInput = '';
    this.isLoading.set(true);
    this.shouldScroll = true;

    this.chatbotService.sendMessage(text).subscribe({
      next: (res) => {
        this.messages.update(msgs => [
          ...msgs,
          { role: 'bot', content: res.reply, timestamp: new Date(), direction: res.direction }
        ]);
        this.isLoading.set(false);
        this.shouldScroll = true;
      },
      error: () => {
        this.messages.update(msgs => [
          ...msgs,
          { role: 'bot', content: 'Désolé, une erreur est survenue. Veuillez réessayer.', timestamp: new Date() }
        ]);
        this.isLoading.set(false);
        this.shouldScroll = true;
      }
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private detectDirection(text: string): 'ltr' | 'rtl' {
    const arabicCount = [...text].filter(c => c >= '\u0600' && c <= '\u06FF').length;
    return arabicCount > text.length * 0.1 ? 'rtl' : 'ltr';
  }

  private scrollToBottom(): void {
    try {
      const el = this.messagesContainer?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    } catch (_) {}
  }
}
