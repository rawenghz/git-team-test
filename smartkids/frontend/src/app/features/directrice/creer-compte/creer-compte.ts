import { Component } from '@angular/core';
import { FormulaireParent } from './formulaire-parent/formulaire-parent';
import { FormulaireAnimatrice } from './formulaire-animatrice/formulaire-animatrice';
@Component({
  selector: 'app-creer-compte',
  imports: [FormulaireParent, FormulaireAnimatrice],
  templateUrl: './creer-compte.html',
  styleUrl: './creer-compte.css',
})
export class CreerCompte {
mode = 'parent';

  changerMode(nouveauMode: string) {
    this.mode = nouveauMode;
  }
}
