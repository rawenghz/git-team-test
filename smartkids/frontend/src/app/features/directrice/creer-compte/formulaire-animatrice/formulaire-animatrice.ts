import { Component } from '@angular/core';
import { Classe } from '../../../../core/models/models';
import { AnimatricesService } from '../../../../core/services/animatrices-service';
import { ClassesService } from '../../../../core/services/classes-service';
import { UserService } from '../../../../core/services/user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-formulaire-animatrice',
  imports: [FormsModule],
  templateUrl: './formulaire-animatrice.html',
  styleUrl: './formulaire-animatrice.css',
})
export class FormulaireAnimatrice {
  Classe: Classe[] = [];
  selectedClasse: number | null = null; // une seule classe par animatrice
  errorMessage: string = '';
  successMessage: string = '';

  nom: string = '';
  email: string = '';
  mot_de_passe: string = '';
  constructor(
      private ClassesService: ClassesService,
      private userService: UserService
    ) {}
    ngOnInit() {
    this.ClassesService.getClassesNonAssignes().subscribe({
      next: (data: any) => { this.Classe = data; },
      error: (err: any) => { this.errorMessage = 'Erreur lors du chargement des animatrices'; }
    });
  }
  toggleClasse(classe: any) {
    this.selectedClasse = this.selectedClasse === classe.id ? null : classe.id;
  }
   isSelected(classe: any): boolean {
    return this.selectedClasse === classe.id;
  }
  createAnimatrice(form: any) {
    this.errorMessage = '';
    this.successMessage = '';

    if (form.invalid) {
      return;
    }
    
    const data = {
      nom: this.nom,
      email: this.email,
      mot_de_passe: this.mot_de_passe,
      role: 'animatrice',
      classe_id: this.selectedClasse,
    };
    

    this.userService.createUser(data).subscribe({
      next: (res: any) => {
        
        this.successMessage = 'Compte animatrice créé avec succès !';
        form.reset();
        this.selectedClasse = null;

//n3wd nchargi les classe   disponibles
        this.ClassesService.getClassesNonAssignes().subscribe({
            next: (data: any) => { this.Classe = data; },
            error: (err: any) => { console.log(err); }
        });
      },
      error: (err: any) => {
       this.errorMessage = 'Erreur: ' + JSON.stringify(err.error);
      }
    });
  }
}
