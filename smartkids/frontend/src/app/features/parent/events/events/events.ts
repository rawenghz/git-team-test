import { Component, inject, signal, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { EvenementsService } from '../../../../core/services/evenement-service';
import { Evenement } from '../../../../core/models/models';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [NgClass],
  templateUrl: './events.html',
  styleUrl: './events.css'
})
export class EventsComponent implements OnInit {
  private svc = inject(EvenementsService);
  evenements = signal<Evenement[]>([]);
  loading    = signal(true);

  ngOnInit() {
    this.svc.getEvenements().subscribe({
      next: d => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const fixed = d.map(ev => ({
  ...ev,
  statut: (() => {
    const evDate = new Date(ev.date);
    evDate.setHours(0, 0, 0, 0);
    if (evDate > today) return 'a_venir';
    if (evDate.getTime() === today.getTime()) return 'en_cours';
    return 'termine';
  })()
})) as Evenement[];

this.evenements.set(fixed);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
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