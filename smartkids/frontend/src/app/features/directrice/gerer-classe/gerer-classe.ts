import { Component, inject, signal, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClassesService } from '../../../core/services/classes-service';
import { AnimatricesService } from '../../../core/services/animatrice-service/animatrices-service';
import { Classe, ClasseForm, Animatrice } from '../../../core/models/models';


@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './gerer-classe.html',
  styleUrl: './gerer-classe.css'
})
export class ClassesComponent implements OnInit {
  private classesSvc = inject(ClassesService);
  private animatricesSvc = inject(AnimatricesService);

  classes = signal<Classe[]>([]);
  animatrices = signal<Animatrice[]>([]);
  loading = signal(true);
  saving = signal(false);

  showModal = signal(false);
  showDeleteModal = signal(false);
  editingClasse = signal<Classe | null>(null);
  classeToDelete = signal<Classe | null>(null);
  errorMessage = signal('');



  ngOnInit() {
    this.loadClasses();
    this.loadAnimatrices();
  }

  loadClasses() {
    this.loading.set(true);
    this.classesSvc.getClasses().subscribe({
      next: d => { this.classes.set(d); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  loadAnimatrices() {
    this.animatricesSvc.getAnimatrices().subscribe({
      next: d => this.animatrices.set(d),
      error: () => { }
    });
  }

  form: ClasseForm = { nom: '', section: '', animatrice_id: null };

  openModal(classe?: Classe) {
    this.errorMessage.set('');
    if (classe) {
      this.editingClasse.set(classe);
      this.form = { nom: classe.nom, section: classe.section, animatrice_id: classe.animatrice_id ?? null };
    } else {
      this.editingClasse.set(null);
      this.form = { nom: '', section: '', animatrice_id: null };
    }
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingClasse.set(null);
  }

  saveClasse() {
    if (!this.form.nom || !this.form.section) return;

    // verifier doublons de nom de classe
    const editing = this.editingClasse();
    const duplicate = this.classes().find(c =>
      c.nom.toLowerCase().trim() === this.form.nom.toLowerCase().trim() &&
      c.id !== editing?.id
    );

    if (duplicate) {
      this.errorMessage.set(`Une classe "${this.form.nom}" existe déjà.`);
      return;
    }

    this.errorMessage.set('');
    this.saving.set(true);

    const request = editing
      ? this.classesSvc.updateClasse(editing.id, this.form)
      : this.classesSvc.createClasse(this.form);

    request.subscribe({
      next: () => { this.saving.set(false); this.closeModal(); this.loadClasses(); },
      error: () => { this.saving.set(false); this.errorMessage.set('Une erreur est survenue.'); }
    });
  }

  confirmDelete(classe: Classe) {
    this.classeToDelete.set(classe);
    this.showDeleteModal.set(true);
  }

  deleteClasse() {
    const classe = this.classeToDelete();
    if (!classe) return;
    this.saving.set(true);
    this.classesSvc.deleteClasse(classe.id).subscribe({
      next: () => {
        this.saving.set(false);
        this.showDeleteModal.set(false);
        this.loadClasses();
      },
      error: () => this.saving.set(false)
    });
  }

  formatSection(section: string): string {
    return { 'petite': 'Petite section', 'moyenne': 'Moyenne section', 'grande': 'Grande section' }[section] ?? section;
  }

  getAnimatriceName(id: number | null) {
    return this.animatrices().find(a => a.id === id)?.nom ?? 'Non assignée';
  }

  getSectionClass(section: string): string {
    return { 'petite': 'text-bg-success', 'moyenne': 'text-bg-primary', 'grande': 'text-bg-warning' }[section] ?? 'text-bg-secondary';
  }
}