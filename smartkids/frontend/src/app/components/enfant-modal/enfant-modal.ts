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
  classeSelectionnee: Classe | null = null;

  enfant: EnfantCreate = {
    nom: '',
    age: undefined,
    genre: 'fille',
    date_naissance: '',
    notes_medicales: '',
    classe_id: undefined
  };

  constructor(private classeService: ClasseService) {}

  ngOnInit(): void {
    // Charger la liste des classes depuis l'API
    this.classeService.getAll().subscribe({
      next: (data) => {
        this.classes = data;
        // Si on est en mode modifier, retrouver la classe déjà assignée
        if (this.enfantInput?.classe_id) {
          this.classeSelectionnee = this.classes.find(c => c.id === this.enfantInput!.classe_id) ?? null;
        }
      },
      error: () => console.error('Erreur chargement classes')
    });

    // Pré-remplir le formulaire si mode modifier
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

  // Quand l'utilisateur choisit une classe dans le select
  onClasseChange(classeId: number): void {
    this.enfant.classe_id = Number(classeId);
    this.classeSelectionnee = this.classes.find(c => c.id === Number(classeId)) ?? null;
  }

  // Retrouver le nom d'une classe par son id (pour l'affichage fiche)
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
    this.sauvegarder.emit({ ...this.enfant });
  }

  fermer(): void {
    this.fermerModal.emit();
  }
}