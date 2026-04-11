import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnfantModalComponent } from '../../components/enfant-modal/enfant-modal';
import { EnfantService } from '../../services/enfant.service';
import { Enfant, EnfantCreate } from '../../models/enfant.model';

@Component({
  selector: 'app-enfants',
  standalone: true,
  imports: [CommonModule, EnfantModalComponent],
  templateUrl: './enfants.html',
  styleUrls: ['./enfants.css']
})
export class EnfantsComponent implements OnInit {
  enfants: Enfant[] = [];
  showModal = false;
  modeModal: 'ajouter' | 'modifier' | 'voir' = 'ajouter';
  enfantSelectionne: Enfant | null = null;
  loading = false;
  erreur = '';

  constructor(private enfantService: EnfantService) {}

  ngOnInit(): void {
    this.chargerEnfants();
  }

  chargerEnfants(): void {
    this.loading = true;
    this.erreur = '';
    this.enfantService.getAll().subscribe({
      next: (data) => {
        this.enfants = data;
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 401) {
          this.erreur = 'Session expirée. Veuillez vous reconnecter.';
        } else {
          this.erreur = 'Erreur lors du chargement des enfants.';
        }
        this.loading = false;
      }
    });
  }

  avatarEmoji(genre: string): string {
    return genre === 'fille' ? '👧' : '👦';
  }

  genreLabel(genre: string): string {
    return genre === 'fille' ? 'Fille' : 'Garçon';
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

  sauvegarder(data: EnfantCreate): void {
    if (this.modeModal === 'modifier' && this.enfantSelectionne) {
      this.enfantService.update(this.enfantSelectionne.id, data).subscribe({
        next: () => { this.chargerEnfants(); this.fermerModal(); },
        error: () => alert('Erreur lors de la modification.')
      });
    } else {
      this.enfantService.create(data).subscribe({
        next: () => { this.chargerEnfants(); this.fermerModal(); },
        error: () => alert('Erreur lors de la création.')
      });
    }
  }

  supprimer(id: number): void {
    if (confirm('Supprimer cet enfant ?')) {
      this.enfantService.delete(id).subscribe({
        next: () => this.chargerEnfants(),
        error: () => alert('Erreur lors de la suppression.')
      });
    }
  }
}