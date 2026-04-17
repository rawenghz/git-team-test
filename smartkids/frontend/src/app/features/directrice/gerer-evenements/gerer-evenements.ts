import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EvenementsService} from '../../../core/services/evenement-service';
import { Evenement, EvenementCreate } from '../../../core/models/models';

@Component({
  selector: 'app-gerer-evenement',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gerer-evenements.html',
  styleUrl: './gerer-evenements.css'
})
export class GererEvenementComponent implements OnInit {
  private service = inject(EvenementsService);

  evenements  = signal<Evenement[]>([]);
  loading     = signal(false);

  // Modal ajout / modification
  showModal        = signal(false);
  editingEvenement = signal<Evenement | null>(null);
  saving           = signal(false);
  errorMessage     = signal('');

  // Modal suppression
  showDeleteModal    = signal(false);
  evenementToDelete  = signal<Evenement | null>(null);

  form: EvenementCreate = this.emptyForm();

  private emptyForm(): EvenementCreate {
    return { titre: '', description: '', date: '',
             heure_debut: '', heure_fin: '', lieu: '', statut: 'a_venir' };
  }

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: (data) => { this.evenements.set(data); this.loading.set(false); },
      error: ()     => { this.loading.set(false); }
    });
  }

  // ── Statut helpers ──
  statutLabel(s: string): string {
    return { a_venir: 'À venir', en_cours: 'En cours', termine: 'Terminé' }[s] ?? s;
  }

  statutBadgeClass(s: string): string {
    return {
      a_venir:  'bg-primary-subtle text-primary',
      en_cours: 'bg-warning-subtle text-warning',
      termine:  'bg-success-subtle text-success'
    }[s] ?? 'bg-secondary-subtle text-secondary';
  }

  // ── Modal ajout / modification ──
  // ── Helper : tronquer HH:mm:ss → HH:mm ──
truncTime(t?: string): string {
  if (!t) return '';
  return t.length >= 5 ? t.substring(0, 5) : t;
}

openModal(ev?: Evenement): void {
  this.errorMessage.set('');
  if (ev) {
    this.editingEvenement.set(ev);
    this.form = {
      titre:       ev.titre,
      description: ev.description ?? '',
      date:        ev.date,
      heure_debut: this.truncTime(ev.heure_debut), // ← "18:00:00" → "18:00"
      heure_fin:   this.truncTime(ev.heure_fin),   // ← "19:30:00" → "19:30"
      lieu:        ev.lieu ?? '',
      statut:      ev.statut as any
    };
  } else {
    this.editingEvenement.set(null);
    this.form = this.emptyForm();
  }
  this.showModal.set(true);
}

  closeModal(): void {
    this.showModal.set(false);
    this.editingEvenement.set(null);
    this.errorMessage.set('');
    this.form = this.emptyForm();
  }

  saveEvenement(): void {
  if (!this.form.titre || !this.form.date) {
    this.errorMessage.set('Le titre et la date sont obligatoires.');
    return;
  }
  this.saving.set(true);
  const editing = this.editingEvenement();

  // ── Nettoyer les champs vides → null pour FastAPI ──
  const payload: any = {
    titre:       this.form.titre,
    description: this.form.description || null,
    date:        this.form.date,
    heure_debut: this.form.heure_debut || null,
    heure_fin:   this.form.heure_fin   || null,
    lieu:        this.form.lieu        || null,
    statut:      this.form.statut
  };

  if (editing) {
    this.service.update(editing.id, payload).subscribe({
      next: (updated) => {
        this.evenements.update(list =>
          list.map(e => e.id === updated.id ? updated : e)
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
    this.service.create(payload).subscribe({
      next: (nouvel) => {
        this.evenements.update(list => [...list, nouvel]);
        this.saving.set(false);
        this.closeModal();
      },
      error: (err) => {
        if (err.status === 409 || err.status === 400) {
          this.errorMessage.set('événement existe déjà');
        } else {
          this.errorMessage.set("Erreur lors de la création.");
        }
        this.saving.set(false);
      }
    });
  }
}
  // ── Modal suppression ──
  confirmDelete(ev: Evenement): void {
    this.evenementToDelete.set(ev);
    this.showDeleteModal.set(true);
  }

  deleteEvenement(): void {
    const ev = this.evenementToDelete();
    if (!ev) return;
    this.saving.set(true);
    this.service.delete(ev.id).subscribe({
      next: () => {
        this.evenements.update(list => list.filter(e => e.id !== ev.id));
        this.saving.set(false);
        this.showDeleteModal.set(false);
        this.evenementToDelete.set(null);
      },
      error: () => { this.saving.set(false); }
    });
  }

  get modalTitre(): string {
    return this.editingEvenement() ? "Modifier l'événement" : 'Nouvel événement';
  }
}