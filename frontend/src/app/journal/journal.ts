import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JournalService } from '../services/journal';
import { JournalOut, JournalCreate, JournalUpdate, Enfant } from '../model/journal.model';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './journal.html',
  styleUrl: './journal.css'
})
export class JournalComponent implements OnInit {

  classeId = Number(localStorage.getItem('classe_id')) || 1;
  date = new Date().toISOString().substring(0, 10);
  cours = '';
  activite = '';
  enfants: Enfant[] = [];
  journals: JournalOut[] = [];
  entries: any[] = [];
  modeEdition: number | null = null;
  editForm: JournalUpdate = {};
  message = '';
  erreur = '';

 humeurs = [
  { valeur: 'joyeux',  emoji: '😊' },
  { valeur: 'neutre',  emoji: '😐' },
  { valeur: 'triste',  emoji: '😟' },
  { valeur: 'fatigué', emoji: '😴' }
];

  constructor(private journalService: JournalService) {}

 ngOnInit() {
  // Temporaire pour tester — colle ton token Swagger ici
  localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZXhwIjoxNzc2MTg3MjE3fQ.Ft_KSgJb-d-NYQMsuZ1OYz8WN965cxsR9ecxWsG4hnc');
  this.chargerEnfants();
}

  chargerEnfants() {
    this.journalService.getEnfantsClasse(1).subscribe({
      next: (data) => {
        this.enfants = data;
        this.entries = data.map(e => ({
  enfant_id: e.id,
  nom: e.nom,        // nom complet
  prenom: '',        // plus besoin
  absent: false,
  evaluation: 'bien',
  humeur: 'joyeux',
  note: ''
}));
      },
      error: () => this.erreur = 'Erreur chargement enfants.'
    });
  }

  validerJournal() {
    let compteur = 0;
    this.entries.forEach(entry => {
      const payload: JournalCreate = {
        enfant_id: entry.enfant_id,
        classe_id: this.classeId,
        date: this.date,
        cours: this.cours,
        activite: this.activite,
        absent: entry.absent,
        evaluation: entry.evaluation,
        humeur: entry.humeur,
        note: entry.note
      };
      this.journalService.createJournal(payload).subscribe({
        next: () => {
          compteur++;
          if (compteur === this.entries.length) {
            this.message = 'Journal validé avec succès !';
          }
        },
        error: (err) => this.erreur = err.error?.detail || 'Erreur création.'
      });
    });
  }

  ouvrirEdition(j: JournalOut) {
    this.modeEdition = j.id;
    this.editForm = {
      cours: j.cours,
      activite: j.activite,
      absent: j.absent,
      evaluation: j.evaluation,
      humeur: j.humeur,
      note: j.note
    };
  }

  sauvegarder(id: number) {
    this.journalService.updateJournal(id, this.editForm).subscribe({
      next: (updated) => {
        const i = this.journals.findIndex(j => j.id === id);
        if (i !== -1) this.journals[i] = updated;
        this.modeEdition = null;
        this.message = 'Modifié avec succès !';
      },
      error: () => this.erreur = 'Erreur modification.'
    });
  }

  annulerEdition() {
    this.modeEdition = null;
  }

  setHumeur(index: number, valeur: string) {
    this.entries[index].humeur = valeur;
  }
}