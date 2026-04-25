import { Component, inject, signal, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { EvenementsService } from '../../../../core/services/evenement-service';
import { ParticipationService } from '../../../../core/services/participation.service';
import { Evenement } from '../../../../core/models/models';

// Interface étendue avec état de participation
export interface EvenementAvecParticipation extends Evenement {
  monStatus?: 'participe' | 'decline' | 'en_attente' | null;
  voting?: boolean;
  votingFor?: 'participe' | 'decline';
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [NgClass],
  templateUrl: './events.html',
  styleUrl: './events.css'
})
export class EventsComponent implements OnInit {
  private svc              = inject(EvenementsService);
  private participationSvc = inject(ParticipationService);

  evenements = signal<EvenementAvecParticipation[]>([]);
  loading    = signal(true);

  ngOnInit() {
    this.svc.getEvenements().subscribe({
      next: d => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const fixed: EvenementAvecParticipation[] = d.map(ev => ({
          ...ev,
          statut: (() => {
            const evDate = new Date(ev.date);
            evDate.setHours(0, 0, 0, 0);
            if (evDate > today) return 'a_venir';
            if (evDate.getTime() === today.getTime()) return 'en_cours';
            return 'termine';
          })(),
          monStatus: null,
          voting: false
        }));

        this.evenements.set(fixed);
        this.loading.set(false);

        // Charger le statut de participation pour chaque événement
        fixed.forEach(ev => this.chargerMonStatut(ev));
      },
      error: () => this.loading.set(false)
    });
  }

  chargerMonStatut(ev: EvenementAvecParticipation): void {
    this.participationSvc.getMonStatut(ev.id).subscribe({
      next: (res) => {
        this.evenements.update(list =>
          list.map(e => e.id === ev.id ? { ...e, monStatus: res.status as any } : e)
        );
      },
      error: () => {} // Silencieux si pas encore de participation
    });
  }

  voter(ev: EvenementAvecParticipation, status: 'participe' | 'decline'): void {
  // Mettre le loading
  this.evenements.update(list =>
    list.map(e => e.id === ev.id ? { ...e, voting: true, votingFor: status } : e)
  );

  this.participationSvc.voter(ev.id, status).subscribe({
    next: () => {
      // ✅ Créer un NOUVEL objet pour forcer la détection de changement Angular
      this.evenements.update(list =>
        list.map(e => e.id === ev.id
          ? { ...e, monStatus: status, voting: false, votingFor: undefined }
          : e
        )
      );
    },
    error: () => {
      this.evenements.update(list =>
        list.map(e => e.id === ev.id
          ? { ...e, voting: false, votingFor: undefined }
          : e
        )
      );
    }
  });
}

  formatDate(d: string) {
    return new Date(d).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  labelStatut(s: string) {
    return s === 'a_venir' ? 'À venir' : s === 'en_cours' ? 'En cours' : 'Terminé';
  }
}