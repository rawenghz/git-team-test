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
  @Input() enfantInput: Enfant | null = null;
  @Output() fermerModal = new EventEmitter<void>();
  @Output() sauvegarder = new EventEmitter<Enfant>();

  // "enfant" correspond exactement à ce que le HTML de l'équipe utilise
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

  // "fermer()" correspond exactement à ce que le HTML de l'équipe appelle
  fermer(): void {
    this.fermerModal.emit();
  }

  // appelé par le bouton Ajouter/Enregistrer
  enregistrer(): void {
    if (!this.enfant.nom_complet || !this.enfant.age || !this.enfant.date_naissance || !this.enfant.classe_nom) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    this.sauvegarder.emit({ ...this.enfant });
  }
}