import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Enfant } from '../../models/enfant.model';

@Component({
  selector: 'app-enfant-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enfant-modal.html',
  styleUrls: ['./enfant-modal.css']
})
export class EnfantModalComponent implements OnInit {
  // mode : 'ajouter' | 'modifier' | 'voir'
  @Input() mode: 'ajouter' | 'modifier' | 'voir' = 'ajouter';
  @Input() enfantInput: Enfant | null = null;
  @Output() fermerModal = new EventEmitter<void>();
  @Output() sauvegarder = new EventEmitter<Enfant>();

  classes: string[] = [
    'Les Papillons (3-4 ans)',
    'Les Étoiles (4-5 ans)',
    'Les Girafes (5-6 ans)',
  ];

  enfant: Enfant = {
    id: 0,
    nom_complet: '',
    age: 3,
    genre: 'Fille',
    date_naissance: '',
    classe_nom: '',
    notesMedicales: ''
  };

  ngOnInit(): void {
    if (this.enfantInput) {
      this.enfant = { ...this.enfantInput };
    }
  }

  get titre(): string {
    if (this.mode === 'voir') return 'Fiche de ' + this.enfant.nom_complet;
    if (this.mode === 'modifier') return "Modifier l'enfant";
    return 'Ajouter un enfant';
  }

  get btnLabel(): string {
    return this.mode === 'modifier' ? 'Enregistrer' : "Ajouter l'enfant";
  }

  avatarEmoji(genre: string): string {
    return genre === 'Fille' ? '👧' : '👦';
  }

  enregistrer(): void {
    if (!this.enfant.nom_complet || !this.enfant.age || !this.enfant.date_naissance || !this.enfant.classe_nom) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    this.sauvegarder.emit({ ...this.enfant });
  }

  fermer(): void {
    this.fermerModal.emit();
  }
}