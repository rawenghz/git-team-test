import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnfantModalComponent } from '../../components/enfant-modal/enfant-modal';
import { Enfant } from '../../models/enfant.model';

@Component({
  selector: 'app-enfants',
  standalone: true,
  imports: [CommonModule, EnfantModalComponent],
  templateUrl: './enfants.html',
  styleUrls: ['./enfants.css']
})
export class EnfantsComponent {
  showModal = false;
  enfantAModifier: Enfant | null = null;

  enfants: Enfant[] = [
    { id: 1, nom_complet: 'Lina Benali',    age: 3, genre: 'Fille',  date_naissance: '2021-03-12', classe_nom: 'Les Papillons' },
    { id: 2, nom_complet: 'Adam Benali',    age: 5, genre: 'Garçon', date_naissance: '2019-06-20', classe_nom: 'Les Papillons' },
    { id: 3, nom_complet: 'Sara Mourad',    age: 4, genre: 'Fille',  date_naissance: '2020-09-05', classe_nom: 'Les Papillons' },
    { id: 4, nom_complet: 'Youssef Khaled', age: 3, genre: 'Garçon', date_naissance: '2021-01-18', classe_nom: 'Les Papillons' },
  ];

  avatarEmoji(genre: string): string {
    return genre === 'Fille' ? '👧' : '👦';
  }

  ouvrirModal(): void {
    this.enfantAModifier = null;
    this.showModal = true;
  }

  ouvrirModification(enfant: Enfant): void {
    this.enfantAModifier = { ...enfant };
    this.showModal = true;
  }

  fermerModal(): void {
    this.showModal = false;
    this.enfantAModifier = null;
  }

  ajouterEnfant(enfant: Enfant): void {
    if (this.enfantAModifier) {
      const index = this.enfants.findIndex(e => e.id === enfant.id);
      if (index !== -1) this.enfants[index] = enfant;
    } else {
      const newId = this.enfants.length > 0 ? Math.max(...this.enfants.map(e => e.id)) + 1 : 1;
      this.enfants.push({ ...enfant, id: newId });
    }
    this.fermerModal();
  }

  supprimerEnfant(id: number): void {
    if (confirm('Supprimer cet enfant ?')) {
      this.enfants = this.enfants.filter(e => e.id !== id);
    }
  }
}