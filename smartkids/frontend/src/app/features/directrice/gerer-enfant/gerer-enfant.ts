import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EnfantsService } from '../../../core/services/enfant-service';
import { ClassesService } from '../../../core/services/classes-service';
import { Enfant, EnfantCreate, Classe } from '../../../core/models/models';

@Component({
  selector: 'app-gerer-enfant',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gerer-enfant.html',
  styleUrl: './gerer-enfant.css'
})
export class GererEnfantComponent implements OnInit {
  private enfantsService = inject(EnfantsService);
  private classesService = inject(ClassesService);

  // ── État principal ──
  enfants = signal<Enfant[]>([]);
  classes = signal<Classe[]>([]);
  loading = signal(false);

  // ── Modal ajout / modification ──
  showModal     = signal(false);
  editingEnfant = signal<Enfant | null>(null);
  saving        = signal(false);
  errorMessage  = signal('');

  form: EnfantCreate = this.emptyForm();

  // ── Modal suppression ──
  showDeleteModal  = signal(false);
  enfantToDelete   = signal<Enfant | null>(null);

  // ── Modal voir (fiche détail) ──
  showViewModal    = signal(false);
  viewingEnfant    = signal<Enfant | null>(null);

  // ── Dates autorisées : 3 à 5 ans ──
  get dateMin(): string {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 6);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }

  get dateMax(): string {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 3);
    return d.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.chargerDonnees();
  }

  private emptyForm(): EnfantCreate {
    return { nom: '', age: undefined, genre: 'fille',
             date_naissance: '', notes_medicales: '', classe_id: undefined };
  }

  chargerDonnees(): void {
    this.loading.set(true);
    this.enfantsService.getAllEnfants().subscribe({
      next: (data) => { this.enfants.set(data); this.loading.set(false); },
      error: ()     => { this.loading.set(false); }
    });
    this.classesService.getClasses().subscribe({
      next: (data) => this.classes.set(data),
      error: ()    => {}
    });
  }

  // ── Helpers affichage ──
  avatarEmoji(genre: string): string { return genre === 'fille' ? '👧' : '👦'; }
  genreLabel(genre: string):  string { return genre === 'fille' ? 'Fille' : 'Garçon'; }

  getClasseNom(classeId?: number): string {
    if (!classeId) return 'Non assignée';
    const c = this.classes().find(cl => cl.id === classeId);
    return c ? c.nom : `Classe #${classeId}`;
  }

  get modalTitre(): string {
    return this.editingEnfant() ? "Modifier l'enfant" : 'Ajouter un enfant';
  }

  // ── Ouvrir / fermer modal ajout/modification ──
  openModal(enfant?: Enfant): void {
    this.errorMessage.set('');
    if (enfant) {
      this.editingEnfant.set(enfant);
      this.form = {
        nom:             enfant.nom,
        age:             enfant.age,
        genre:           enfant.genre,
        date_naissance:  enfant.date_naissance ?? '',
        notes_medicales: enfant.notes_medicales ?? '',
        classe_id:       enfant.classe_id
      };
    } else {
      this.editingEnfant.set(null);
      this.form = this.emptyForm();
    }
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingEnfant.set(null);
    this.errorMessage.set('');
    this.form = this.emptyForm();
  }

  // ── Sauvegarde (création ou modification) ──
  saveEnfant(): void {
    if (!this.form.nom || !this.form.genre) {
      this.errorMessage.set('Veuillez remplir le nom et le genre.');
      return;
    }
    if (this.form.date_naissance) {
      if (this.form.date_naissance < this.dateMin ||
          this.form.date_naissance > this.dateMax) {
        this.errorMessage.set('La date de naissance doit correspondre à un enfant de 3 à 5 ans.');
        return;
      }
    }

    this.saving.set(true);
    this.errorMessage.set('');

    const editing = this.editingEnfant();

    if (editing) {
      // ── Modification ──
      this.enfantsService.updateEnfant(editing.id, this.form).subscribe({
        next: (updated) => {
          this.enfants.update(list =>
            list.map(e => e.id === updated.id ? updated : e)
          );
          this.saving.set(false);
          this.closeModal();
        },
        error: () => {
          this.errorMessage.set('Erreur lors de la modification.');
          this.saving.set(false);
        }
      });
    } else {
      // ── Création ──
      this.enfantsService.createEnfant(this.form).subscribe({
        next: (nouvel) => {
          this.enfants.update(list => [...list, nouvel]);
          this.saving.set(false);
          this.closeModal();
        },
        error: (err) => {
          // Gestion doublon backend (400 ou 409)
          if (err.status === 400 || err.status === 409) {
            this.errorMessage.set('enfant existe déjà');
          } else {
            this.errorMessage.set("Erreur lors de la création de l'enfant.");
          }
          this.saving.set(false);
        }
      });
    }
  }

  // ── Modal suppression ──
  confirmDelete(enfant: Enfant): void {
    this.enfantToDelete.set(enfant);
    this.showDeleteModal.set(true);
  }

  deleteEnfant(): void {
    const enfant = this.enfantToDelete();
    if (!enfant) return;
    this.saving.set(true);
    this.enfantsService.deleteEnfant(enfant.id).subscribe({
      next: () => {
        this.enfants.update(list => list.filter(e => e.id !== enfant.id));
        this.saving.set(false);
        this.showDeleteModal.set(false);
        this.enfantToDelete.set(null);
      },
      error: () => { this.saving.set(false); }
    });
  }

  // ── Modal voir (fiche détail) ──
  openViewModal(enfant: Enfant): void {
    this.viewingEnfant.set(enfant);
    this.showViewModal.set(true);
  }
}