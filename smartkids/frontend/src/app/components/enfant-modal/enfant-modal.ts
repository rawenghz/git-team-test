import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Enfant, EnfantCreate } from '../../models/enfant.model';
import { ClasseService, Classe } from '../../services/classe.service';

@Component({
  selector: 'app-enfant-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enfant-modal.html',
  styleUrls: ['./enfant-modal.css']
})
export class EnfantModalComponent implements OnInit {
  @Input() mode: 'ajouter' | 'modifier' | 'voir' = 'ajouter';
  @Input() enfantInput: Enfant | null = null;
  @Output() fermerModal = new EventEmitter<void>();
  @Output() sauvegarder = new EventEmitter<EnfantCreate>();

  classes: Classe[] = [];

  enfant: EnfantCreate = {
    nom: '',
    age: undefined,
    genre: 'fille',
    date_naissance: '',
    notes_medicales: '',
    classe_id: undefined
  };

  // ── Dates autorisées : enfants de 3 à 5 ans ──
  // Un enfant de 3 ans : né il y a au moins 3 ans → dateMax = aujourd'hui - 3 ans
  // Un enfant de 5 ans : né il y a au plus 5 ans et 364 jours → dateMin = aujourd'hui - 6 ans + 1 jour
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

  constructor(private classeService: ClasseService) {}

  ngOnInit(): void {
    this.classeService.getAll().subscribe({
      next: (data) => {
        this.classes = data;
      },
      error: () => console.error('Erreur chargement classes')
    });

    if (this.enfantInput) {
      this.enfant = {
        nom:             this.enfantInput.nom,
        age:             this.enfantInput.age,
        genre:           this.enfantInput.genre,
        date_naissance:  this.enfantInput.date_naissance ?? '',
        notes_medicales: this.enfantInput.notes_medicales ?? '',
        classe_id:       this.enfantInput.classe_id
      };
    }
  }

  onClasseChange(classeId: number): void {
    this.enfant.classe_id = Number(classeId);
  }

  getClasseNom(classeId?: number): string {
    if (!classeId) return 'Non assignée';
    const c = this.classes.find(cl => cl.id === classeId);
    return c ? c.nom : `Classe #${classeId}`;
  }

  get titre(): string {
    if (this.mode === 'voir')     return 'Fiche de ' + (this.enfantInput?.nom ?? '');
    if (this.mode === 'modifier') return "Modifier l'enfant";
    return 'Ajouter un enfant';
  }

  get btnLabel(): string {
    return this.mode === 'modifier' ? 'Enregistrer' : "Ajouter l'enfant";
  }

  avatarEmoji(genre: string): string {
    return genre === 'fille' ? '👧' : '👦';
  }

  genreLabel(genre: string): string {
    return genre === 'fille' ? 'Fille' : 'Garçon';
  }

  enregistrer(): void {
    if (!this.enfant.nom || !this.enfant.genre) {
      alert('Veuillez remplir le nom et le genre.');
      return;
    }
    // Vérification date si remplie
    if (this.enfant.date_naissance) {
      if (this.enfant.date_naissance < this.dateMin || this.enfant.date_naissance > this.dateMax) {
        alert('La date de naissance doit correspondre à un enfant âgé de 3 à 5 ans.');
        return;
      }
    }
    this.sauvegarder.emit({ ...this.enfant });
  }

  fermer(): void {
    this.fermerModal.emit();
  }
}