import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationsService, NotificationCreate }
  from '../../../core/services/evenement-service';
import { Notification } from '../../../core/models/models';
import { DatePipe } from '@angular/common'; 

@Component({
  selector: 'app-gerer-notification',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './gerer-notifications.html',
  styleUrl: './gerer-notifications.css'
})
export class GererNotificationComponent implements OnInit {
  private service = inject(NotificationsService);

  notifications   = signal<Notification[]>([]);
  loading         = signal(false);

  // Modal ajout
  showModal    = signal(false);
  saving       = signal(false);
  errorMessage = signal('');

  form: NotificationCreate = this.emptyForm();

  // Modal suppression
  showDeleteModal  = signal(false);
  notifToDelete    = signal<Notification | null>(null);

  private emptyForm(): NotificationCreate {
    return { message: '', type: 'info', user_id: undefined };
  }

  ngOnInit(): void { this.charger(); }

  charger(): void {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: (data) => { this.notifications.set(data); this.loading.set(false); },
      error: ()     => { this.loading.set(false); }
    });
  }

  // ── Type helpers ──
  typeLabel(t: string): string {
    return { info: 'Info', alerte: 'Alerte', nouveau: 'Nouveau' }[t] ?? t;
  }

  typeBadgeClass(t: string): string {
    return {
      info:    'bg-primary-subtle text-primary',
      alerte:  'bg-danger-subtle text-danger',
      nouveau: 'bg-success-subtle text-success'
    }[t] ?? 'bg-secondary-subtle text-secondary';
  }

  typeIcon(t: string): string {
    return { info: 'ℹ️', alerte: '⚠️', nouveau: '🆕' }[t] ?? '🔔';
  }

  // ── Ajouter ces propriétés ──
editingNotif = signal<Notification | null>(null);

// ── Remplacer openModal() ──
openModal(n?: Notification): void {
  this.errorMessage.set('');
  if (n) {
    this.editingNotif.set(n);
    this.form = { message: n.message, type: n.type as any, user_id: n.user_id };
  } else {
    this.editingNotif.set(null);
    this.form = this.emptyForm();
  }
  this.showModal.set(true);
}

closeModal(): void {
  this.showModal.set(false);
  this.editingNotif.set(null);
  this.errorMessage.set('');
  this.form = this.emptyForm();
}

// ── Remplacer saveNotification() ──
saveNotification(): void {
  if (!this.form.message) {
    this.errorMessage.set('Le message est obligatoire.');
    return;
  }
  this.saving.set(true);
  const editing = this.editingNotif();

  if (editing) {
    this.service.update(editing.id, this.form).subscribe({
      next: (updated) => {
        this.notifications.update(list =>
          list.map(n => n.id === updated.id ? updated : n)
        );
        this.saving.set(false);
        this.closeModal();
      },
      error: () => {
        this.errorMessage.set("Erreur lors de la modification.");
        this.saving.set(false);
      }
    });
  } else {
    this.service.create(this.form).subscribe({
      next: (nouvelle) => {
        this.notifications.update(list => [nouvelle, ...list]);
        this.saving.set(false);
        this.closeModal();
      },
      error: (err) => {
        if (err.status === 409 || err.status === 400) {
          this.errorMessage.set('notification existe déjà');
        } else {
          this.errorMessage.set("Erreur lors de la création.");
        }
        this.saving.set(false);
      }
    });
  }
}

get modalTitreNotif(): string {
  return this.editingNotif() ? 'Modifier la notification' : 'Nouvelle notification';
}

  // ── Modal suppression ──
  confirmDelete(n: Notification): void {
    this.notifToDelete.set(n);
    this.showDeleteModal.set(true);
  }

  deleteNotification(): void {
    const n = this.notifToDelete();
    if (!n) return;
    this.saving.set(true);
    this.service.delete(n.id).subscribe({
      next: () => {
        this.notifications.update(list => list.filter(x => x.id !== n.id));
        this.saving.set(false);
        this.showDeleteModal.set(false);
        this.notifToDelete.set(null);
      },
      error: () => { this.saving.set(false); }
    });
  }
}