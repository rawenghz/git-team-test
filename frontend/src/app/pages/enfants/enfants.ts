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
  loading = false;
  erreur = '';

  // Modal ajouter / modifier / voir
  showModal = false;
  modeModal: 'ajouter' | 'modifier' | 'voir' = 'ajouter';
  enfantSelectionne: Enfant | null = null;

  // Modal suppression
  showModalSuppression = false;
  enfantASupprimer: Enfant | null = null;
  suppressionEnCours = false;

  constructor(private enfantService: EnfantService) {}

  ngOnInit(): void {
    this.chargerEnfants();
  }

  // Chargement initial uniquement
  chargerEnfants(): void {
    this.loading = true;
    this.erreur = '';
    this.enfantService.getAll().subscribe({
      next: (data) => {
        this.enfants = data;
        this.loading = false;
      },
      error: (err) => {
        this.erreur = err.status === 401
          ? 'Session expirée. Veuillez vous reconnecter.'
          : 'Erreur lors du chargement des enfants.';
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

  // ── OUVRIR MODALS ──
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

  // ── SAUVEGARDER : mise à jour LOCALE instantanée ──
  sauvegarder(data: EnfantCreate): void {
    if (this.modeModal === 'modifier' && this.enfantSelectionne) {
      const id = this.enfantSelectionne.id;
      this.enfantService.update(id, data).subscribe({
        next: (enfantMisAJour) => {
          // Remplacer dans la liste locale — pas de rechargement
          const index = this.enfants.findIndex(e => e.id === id);
          if (index !== -1) this.enfants[index] = enfantMisAJour;
          this.fermerModal();
        },
        
        error: () => alert('Erreur lors de la modification.')
      });
    } else {
      this.enfantService.create(data).subscribe({
        next: (nouvelEnfant) => {
          // Ajouter à la liste locale — pas de rechargement
          this.enfants.push(nouvelEnfant);
          this.fermerModal();
        },
        error: () => alert('Erreur lors de la création.')
      });
    }
  }

  // ── SUPPRESSION avec modal de confirmation ──
  ouvrirModalSuppression(enfant: Enfant): void {
    this.enfantASupprimer = enfant;
    this.showModalSuppression = true;
  }

  fermerModalSuppression(): void {
    this.showModalSuppression = false;
    this.enfantASupprimer = null;
    this.suppressionEnCours = false;
  }

  confirmerSuppression(): void {
    if (!this.enfantASupprimer) return;
    this.suppressionEnCours = true;
    this.enfantService.delete(this.enfantASupprimer.id).subscribe({
      next: () => {
        // Supprimer de la liste locale — pas de rechargement
        this.enfants = this.enfants.filter(e => e.id !== this.enfantASupprimer!.id);
        this.fermerModalSuppression();
      },
      error: () => {
        alert('Erreur lors de la suppression.');
        this.suppressionEnCours = false;
      }
    });
  }
}