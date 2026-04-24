import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JournalService } from '../../../core/services/journal-service';
import { JournalOut, JournalCreate, JournalUpdate, Enfant } from '../../../core/models/models';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './journal.html',
  styleUrl: './journal.css'
})
export class JournalComponent implements OnInit {

  classeId: number = 0;
  date = new Date().toISOString().substring(0, 10);
  cours = '';
  activite = '';
  enfants: Enfant[] = [];
  journals: JournalOut[] = [];
  entries: any[] = [];
  message = '';
  erreur = '';
  journalExistant = false;
  confirmationSuppression = false;

  // ✅ true = toutes les lignes sont en mode édition en même temps
  modeEditionActif = false;

  // ✅ tableau d'un formulaire par ligne, indexé par id du journal
  editForms: { [id: number]: JournalUpdate } = {};

  humeurs = [
    { valeur: 'heureux', emoji: '😊' },
    { valeur: 'neutre',  emoji: '😐' },
    { valeur: 'triste',  emoji: '😟' },
    { valeur: 'malade',  emoji: '😴' }
  ];

  evaluations = [
    { valeur: 'tres_bien', label: 'Très bien' },
    { valeur: 'bien',      label: 'Bien' },
    { valeur: 'moyen',     label: 'Moyen' }
  ];

  constructor(private journalService: JournalService) {}

  ngOnInit() {
    this.journalService.getMyClasse().subscribe({
      next: (classe) => {
        this.classeId = classe.id;
        this.chargerEnfants();
        this.chargerJournalDate();
      },
      error: () => this.erreur = "Aucune classe affectée à cette animatrice."
    });
  }

  chargerEnfants() {
    this.journalService.getEnfantsClasse(this.classeId).subscribe({
      next: (data) => {
        this.enfants = data;
        this.entries = data.map(e => ({
          enfant_id: e.id,
          nom: e.nom,
          absent: false,
          evaluation: 'bien',
          humeur: 'heureux',
          note: ''
        }));
      },
      error: () => this.erreur = 'Erreur chargement enfants.'
    });
  }

  chargerJournalDate() {
    this.journalExistant = false;
    this.modeEditionActif = false;
    this.editForms = {};
    this.message = '';
    this.erreur = '';

    this.journalService.getJournalClasse(this.classeId, this.date).subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.journals = data;
          this.journalExistant = true;
          this.cours = data[0].cours || '';
          this.activite = data[0].activite || '';
        } else {
          this.journals = [];
          this.journalExistant = false;
        }
      },
      error: () => this.erreur = 'Erreur lors du chargement du journal.'
    });
  }

  getEmoji(humeur: string | null): string {
    const h = this.humeurs.find(h => h.valeur === humeur);
    return h ? h.emoji : '—';
  }

  validerJournal() {
    let compteur = 0;
    let erreurs = 0;
    this.message = '';
    this.erreur = '';

    this.entries.forEach(entry => {
      const payload: JournalCreate = {
        enfant_id: entry.enfant_id,
        classe_id: this.classeId,
        date: this.date,
        cours: this.cours,
        activite: this.activite,
        absent: entry.absent,
        evaluation: entry.absent ? null : entry.evaluation,
        humeur: entry.absent ? null : entry.humeur,
        note: entry.absent ? null : entry.note
      };

      this.journalService.createJournal(payload).subscribe({
        next: () => {
          compteur++;
          if (compteur + erreurs === this.entries.length) {
            this.message = `Journal validé avec succès (${compteur}/${this.entries.length}) !`;
            this.chargerJournalDate();
          }
        },
        error: (err) => {
          erreurs++;
          const detail = err.error?.detail;
          if (Array.isArray(detail)) {
            this.erreur = detail.map((d: any) => `${d.loc?.join('.')}: ${d.msg}`).join(' | ');
          } else if (typeof detail === 'string') {
            this.erreur = detail;
          } else {
            this.erreur = `Erreur ${err.status} : données invalides.`;
          }
        }
      });
    });
  }

  // ✅ Ouvre TOUTES les lignes en édition simultanément
  ouvrirEditionTout() {
    this.editForms = {};
    this.journals.forEach(j => {
      this.editForms[j.id] = {
        cours: j.cours,
        activite: j.activite,
        absent: j.absent,
        evaluation: j.evaluation,
        humeur: j.humeur,
        note: j.note
      };
    });
    this.modeEditionActif = true;
  }

  // ✅ Sauvegarde TOUTES les lignes en une fois
  sauvegarderTout() {
    this.message = '';
    this.erreur = '';
    const ids = Object.keys(this.editForms).map(Number);
    let done = 0;

    ids.forEach(id => {
      const formAvecCommuns: JournalUpdate = {
        ...this.editForms[id],
        cours: this.cours,
        activite: this.activite
      };

      this.journalService.updateJournal(id, formAvecCommuns).subscribe({
        next: (updated) => {
          const i = this.journals.findIndex(j => j.id === id);
          if (i !== -1) this.journals[i] = updated;
          done++;
          if (done === ids.length) {
            this.modeEditionActif = false;
            this.editForms = {};
            this.message = 'Journal modifié avec succès !';
          }
        },
        error: (err) => {
          const detail = err.error?.detail;
          this.erreur = Array.isArray(detail)
            ? detail.map((d: any) => d.msg).join(' | ')
            : detail || 'Erreur modification.';
        }
      });
    });
  }

  annulerEdition() {
    this.modeEditionActif = false;
    this.editForms = {};
  }

  demanderSuppression() {
    this.confirmationSuppression = true;
  }

  annulerSuppression() {
    this.confirmationSuppression = false;
  }

  confirmerSuppression() {
    this.message = '';
    this.erreur = '';
    const ids = this.journals.map(j => j.id);
    let done = 0;

    ids.forEach(id => {
      this.journalService.deleteJournal(id).subscribe({
        next: () => {
          done++;
          if (done === ids.length) {
            this.journals = [];
            this.journalExistant = false;
            this.cours = '';
            this.activite = '';
            this.confirmationSuppression = false;
            this.message = 'Journal supprimé avec succès.';
          }
        },
        error: () => {
          this.confirmationSuppression = false;
          this.erreur = 'Erreur lors de la suppression.';
        }
      });
    });
  }

  setHumeur(index: number, valeur: string) {
    this.entries[index].humeur = valeur;
  }

  getEntryNom(enfantId: number): string {
    const entry = this.entries.find(e => e.enfant_id === enfantId);
    return entry ? entry.nom : '?';
  }
}