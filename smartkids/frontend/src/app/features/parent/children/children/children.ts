import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EnfantsService } from '../../../../core/services/enfant-service';
import { Enfant } from '../../../../core/models/models';


@Component({
  selector: 'app-children',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './children.html',
  styleUrl: './children.css'
})
export class ChildrenComponent implements OnInit {
  private svc = inject(EnfantsService);
  enfants = signal<Enfant[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.svc.getMesEnfants().subscribe({
      next: d => {
      this.enfants.set(d);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  formatDate(d: string) {
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  saveEnfant(enfant: Enfant) {
  this.svc.updateEnfant(enfant.id, {
    notes_medicales: enfant.notes_medicales,
  }).subscribe({
    next: () => { enfant._open = false;
     },
    error: () => {}
  });
}
}