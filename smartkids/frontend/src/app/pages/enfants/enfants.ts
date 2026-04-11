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
  modeModal: 'ajouter' | 'modifier' | 'voir' = 'ajouter';
  enfantSelectionne: Enfant | null = null;

  enfants: Enfant[] = [
    { id: 1, nom_complet: 'Lina Benali',    age: 3, genre: 'Fille',  date_naissance: '15/03/2023', classe_nom: 'Les Papillons (3-4 ans)', notesMedicales: 'Allergie aux arachides' },
    { id: 2, nom_complet: 'Adam Benali',    age: 5, genre: 'Garçon', date_naissance: '20/06/2019', classe_nom: 'Les Papillons (3-4 ans)', notesMedicales: '' },
    { id: 3, nom_complet: 'Sara Mourad',    age: 4, genre: 'Fille',  date_naissance: '05/09/2020', classe_nom: 'Les Papillons (3-4 ans)', notesMedicales: '' },
    { id: 4, nom_complet: 'Youssef Khaled', age: 3, genre: 'Garçon', date_naissance: '18/01/2021', classe_nom: 'Les Papillons (3-4 ans)', notesMedicales: '' },
  ];

  avatarEmoji(genre: string): string {
    return genre === 'Fille' ? '👧' : '👦';
  }

  ouvrirAjouter(): void {
    this.enfantSelectionne = null;
    this.modeModal = 'ajouter';
    this.showModal = true;
  }

  ouvrirVoir(enfant: Enfant): void {
    this.enfantSelectionne = { ...enfant };
    this.modeModal = 'voir';
    this.showModal = true;
  }

  ouvrirModifier(enfant: Enfant): void {
    this.enfantSelectionne = { ...enfant };
    this.modeModal = 'modifier';
    this.showModal = true;
  }

  fermerModal(): void {
    this.showModal = false;
    this.enfantSelectionne = null;
  }

  sauvegarder(enfant: Enfant): void {
    if (this.modeModal === 'modifier') {
      const index = this.enfants.findIndex(e => e.id === enfant.id);
      if (index !== -1) this.enfants[index] = enfant;
    } else {
      const newId = this.enfants.length > 0 ? Math.max(...this.enfants.map(e => e.id)) + 1 : 1;
      this.enfants.push({ ...enfant, id: newId });
    }
    this.fermerModal();
  }

  supprimer(id: number): void {
    if (confirm('Supprimer cet enfant ?')) {
      this.enfants = this.enfants.filter(e => e.id !== id);
    }
  }
}