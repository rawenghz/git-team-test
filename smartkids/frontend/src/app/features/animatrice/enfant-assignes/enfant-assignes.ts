import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnfantsService } from '../../../core/services/enfant-service';

@Component({
  selector: 'app-enfants-assignes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enfant-assignes.html',
  styleUrl: './enfant-assignes.css'
})
export class EnfantsComponent implements OnInit {

 private enfantsService = inject(EnfantsService);

  enfants = signal<any[]>([]);
  classe = signal<any>(null);
  loading = signal(true);
  enfantSelectionne = signal<any>(null); // ✅ pour la fiche

  ngOnInit(): void {
    this.enfantsService.getMyClasse().subscribe({
      next: (classe) => {
        this.classe.set(classe);
        this.enfantsService.getEnfantsClasse(classe.id).subscribe({
          next: (data) => {
            this.enfants.set(data);
            this.loading.set(false);
          },
          error: () => this.loading.set(false)
        });
      },
      error: () => this.loading.set(false)
    });
  }

  voirFiche(enfant: any): void {
    this.enfantSelectionne.set(enfant);
  }

  fermerFiche(): void {
    this.enfantSelectionne.set(null);
  }

  getEmoji(genre: string): string {
    return genre === 'fille' ? '👧' : '👦';
  }

  
  getGenreLabel(genre: string): string {
    return genre === 'fille' ? 'Fille' : 'Garçon';
  }
}