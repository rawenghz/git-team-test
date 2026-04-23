import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EvenementsService } from '../../../core/services/evenement-service';
import { ParticipationService, EventStats } from '../../../core/services/participation.service';
import { Evenement, EvenementCreate } from '../../../core/models/models';

// Interface étendue avec les stats
export interface EvenementAvecStats extends Evenement {
  stats?: EventStats;
}

@Component({
  selector: 'app-gerer-evenement',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gerer-evenements.html',
  styleUrl: './gerer-evenements.css'
})
export class GererEvenementComponent implements OnInit {
  private service        = inject(EvenementsService);
  private participationSvc = inject(ParticipationService);

  evenements   = signal<EvenementAvecStats[]>([]);
  loading      = signal(false);

  // Modal ajout / modification
  showModal        = signal(false);
  editingEvenement = signal<Evenement | null>(null);
  saving           = signal(false);
  errorMessage     = signal('');

  // Modal suppression
  showDeleteModal   = signal(false);
  evenementToDelete = signal<Evenement | null>(null);

  // Modal détails participation
  showDetailsModal  = signal(false);
  eventSelectionne  = signal<EvenementAvecStats | null>(null);

  form: EvenementCreate = this.emptyForm();

  private emptyForm(): EvenementCreate {
    return { titre: '', description: '', date: '', heure_debut: '', heure_fin: '', lieu: '', statut: 'a_venir' };
  }

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: (data) => {
        const evs: EvenementAvecStats[] = data.map(e => ({ ...e }));
        this.evenements.set(evs);
        this.loading.set(false);
        // Charger les stats pour chaque événement en parallèle
        evs.forEach(ev => this.chargerStats(ev));
      },
      error: () => this.loading.set(false)
    });
  }

  chargerStats(ev: EvenementAvecStats): void {
    this.participationSvc.getStats(ev.id).subscribe({
      next: (stats) => {
        this.evenements.update(list =>
          list.map(e => e.id === ev.id ? { ...e, stats } : e)
        );
      },
      error: () => {
        // Si pas de stats disponibles, on ignore silencieusement
      }
    });
  }

  voirDetails(ev: EvenementAvecStats): void {
    this.eventSelectionne.set(ev);
    this.showDetailsModal.set(true);
  }

  // Initiales pour l'avatar
  initiales(p: any): string {
    const prenom = p.prenom?.[0] ?? '';
    const nom    = p.nom?.[0] ?? '';
    return (prenom + nom).toUpperCase();
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

  truncTime(t?: string): string {
    if (!t) return '';
    return t.length >= 5 ? t.substring(0, 5) : t;
  }

  // ── Modal ajout / modification ──
  openModal(ev?: Evenement): void {
    this.errorMessage.set('');
    if (ev) {
      this.editingEvenement.set(ev);
      this.form = {
        titre:       ev.titre,
        description: ev.description ?? '',
        date:        ev.date,
        heure_debut: this.truncTime(ev.heure_debut),
        heure_fin:   this.truncTime(ev.heure_fin),
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
            list.map(e => e.id === updated.id ? { ...updated, stats: e.stats } : e)
          );
          this.saving.set(false);
          this.closeModal();
        },
        error: () => { this.errorMessage.set("Erreur lors de la modification."); this.saving.set(false); }
      });
    } else {
      this.service.create(payload).subscribe({
        next: (nouvel) => {
          const newEv: EvenementAvecStats = { ...nouvel };
          this.evenements.update(list => [...list, newEv]);
          this.chargerStats(newEv);
          this.saving.set(false);
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage.set(err.status === 409 || err.status === 400 ? 'Événement existe déjà' : "Erreur lors de la création.");
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
      error: () => this.saving.set(false)
    });
  }

  get modalTitre(): string {
    return this.editingEvenement() ? "Modifier l'événement" : 'Nouvel événement';
  }
}