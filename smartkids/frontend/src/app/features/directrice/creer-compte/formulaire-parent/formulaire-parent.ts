import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EnfantsService } from '../../../../core/services/enfant-service';
import { UserService } from '../../../../core/services/user';

@Component({
  selector: 'app-formulaire-parent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulaire-parent.html',
  styleUrl: './formulaire-parent.css',
})
export class FormulaireParent implements OnInit {

  enfants: any[] = [];
  selectedEnfants: number[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  nom: string = '';
  email: string = '';
  mot_de_passe: string = '';

  constructor(
    private enfantService: EnfantsService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.enfantService.getEnfantsNonAssignes().subscribe({
      next: (data: any) => { this.enfants = data; },
      error: (err: any) => { this.errorMessage = 'Erreur lors du chargement des enfants'; }
    });
  }

  toggleEnfant(enfant: any) {
    const index = this.selectedEnfants.indexOf(enfant.id);
    if (index === -1) {
      this.selectedEnfants.push(enfant.id);
    } else {
      this.selectedEnfants.splice(index, 1);
    }
  }

  isSelected(enfant: any): boolean {
    return this.selectedEnfants.indexOf(enfant.id) !== -1;
  }

  createParent(form: any) {
    this.errorMessage = '';
    this.successMessage = '';

    if (form.invalid) {
      return;
    }

    const data = {
      nom: this.nom,
      email: this.email,
      mot_de_passe: this.mot_de_passe,
      role: 'parent',
      enfants_ids: this.selectedEnfants,
    };

    this.userService.createUser(data).subscribe({
      next: (res: any) => {
        this.successMessage = 'Compte parent créé avec succès !';
        form.reset();
        this.selectedEnfants = [];

        //n3wd nchargi les enfants  disponibles
        this.enfantService.getEnfantsNonAssignes().subscribe({
            next: (data: any) => { this.enfants = data; },
            error: (err: any) => { console.log(err); }
        });

        // Rediriger vers gerer-comptes après 1.5 secondes
        setTimeout(() => {
          this.router.navigate(['/directrice/gerer-comptes']);
        }, 1500);
      },
      error: (err: any) => {
       this.errorMessage = 'Erreur: ' + JSON.stringify(err.error);
      }
    });
  }
}