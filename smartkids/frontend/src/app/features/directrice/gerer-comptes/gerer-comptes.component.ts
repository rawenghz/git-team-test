import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-gerer-comptes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './gerer-comptes.component.html',
  styleUrl: './gerer-comptes.component.css'
})
export class GererComptesComponent implements OnInit, OnDestroy {

  activeTab: string = 'parents';
  searchTerm: string = '';
  sortOrder: string = 'nom_asc';

  parents: any[] = [];
  animatrices: any[] = [];
  enfantsDisponibles: any[] = [];

  stats = {
    totalParents: 0,
    totalAnimatrices: 0,
    enfantsAssignes: 0,
    enfantsLibres: 0
  };

  // ===== MODAL STATE =====
  modalOuvert: string = '';
  userSelectionne: any = null;

  // Modal Modifier
  formModifier = { nom_complet: '', email: '' };
  enfantsSelectionnes: any[] = [];
  rechercheEnfant: string = '';

  // Modal Mot de passe
  modeMdp: string = 'auto';
  nouveauMotDePasse: string = '';
  copie: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadParents();
    this.loadAnimatrices();
    this.loadStats();
    this.loadEnfants();

    // Détecter quand l'utilisateur revient de la création de compte
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: any) => {
        if (event.url.includes('gerer-comptes')) {
          this.loadParents();
          this.loadAnimatrices();
          this.loadStats();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ===== CHARGEMENT DONNÉES =====

  loadParents(): void {
    this.http.get<any[]>('http://localhost:8000/users/parents').subscribe({
      next: (data) => {
        this.parents = data;
        this.stats.totalParents = data.length;
      },
      error: (err) => console.error('Erreur chargement parents', err)
    });
  }

  loadAnimatrices(): void {
    this.http.get<any[]>('http://localhost:8000/users/animatrices').subscribe({
      next: (data) => {
        this.animatrices = data;
        this.stats.totalAnimatrices = data.length;
      },
      error: (err) => console.error('Erreur chargement animatrices', err)
    });
  }

  loadStats(): void {
    this.http.get<any>('http://localhost:8000/enfants/stats').subscribe({
      next: (data) => {
        this.stats.enfantsAssignes = data.assignes;
        this.stats.enfantsLibres = data.libres;
      },
      error: (err) => console.error('Erreur chargement stats', err)
    });
  }

  loadEnfants(): void {
    this.http.get<any[]>('http://localhost:8000/enfants').subscribe({
      next: (data) => { this.enfantsDisponibles = data; },
      error: (err) => console.error('Erreur chargement enfants', err)
    });
  }

  // ===== TABS & FILTRES =====

  setTab(tab: string): void {
    this.activeTab = tab;
    this.searchTerm = '';
  }

  get filteredParents(): any[] {
    return this.sortList(this.filterList(this.parents));
  }

  get filteredAnimatrices(): any[] {
    return this.sortList(this.filterList(this.animatrices));
  }

  filterList(list: any[]): any[] {
    if (!this.searchTerm) return [...list];
    const s = this.searchTerm.toLowerCase();
    return list.filter(u =>
      (u.nom + ' ' + u.prenom).toLowerCase().includes(s) ||
      u.email.toLowerCase().includes(s)
    );
  }

  sortList(list: any[]): any[] {
    return list.sort((a, b) => {
      const nA = (a.nom + ' ' + a.prenom).toLowerCase();
      const nB = (b.nom + ' ' + b.prenom).toLowerCase();
      if (this.sortOrder === 'nom_asc')   return nA.localeCompare(nB);
      if (this.sortOrder === 'nom_desc')  return nB.localeCompare(nA);
      if (this.sortOrder === 'email_asc') return a.email.localeCompare(b.email);
      return 0;
    });
  }

  // ===== OUVERTURE MODALS =====

  ouvrirDetails(user: any): void {
    this.userSelectionne = user;
    this.modalOuvert = 'details';
  }

  ouvrirModifier(user: any): void {
    this.userSelectionne = user;
    this.formModifier = {
      nom_complet: user.prenom + ' ' + user.nom,
      email: user.email
    };
    this.enfantsSelectionnes = user.enfants ? [...user.enfants] : [];
    this.rechercheEnfant = '';
    this.modalOuvert = 'modifier';
  }

  ouvrirMotDePasse(user: any): void {
    this.userSelectionne = user;
    this.modeMdp = 'auto';
    this.copie = false;
    this.genererMotDePasse();
    this.modalOuvert = 'mdp';
  }

  ouvrirSupprimer(user: any): void {
    this.userSelectionne = user;
    this.modalOuvert = 'supprimer';
  }

  fermerModal(): void {
    this.modalOuvert = '';
    this.userSelectionne = null;
  }

  // ===== ACTIONS MODALS =====

  sauvegarderModification(): void {
    const id = this.userSelectionne?.id;
    const parties = this.formModifier.nom_complet.trim().split(' ');
    const body = {
      prenom: parties[0] || '',
      nom: this.formModifier.nom_complet.trim(),
      email: this.formModifier.email,
      enfants_ids: this.enfantsSelectionnes.map(e => e.id)
    };
    this.http.put(`http://localhost:8000/users/${id}`, body).subscribe({
      next: () => {
        this.loadParents();
        this.loadAnimatrices();
        this.fermerModal();
      },
      error: (err) => console.error('Erreur modification', err)
    });
  }

  confirmerMotDePasse(): void {
    const id = this.userSelectionne?.id;
    this.http.put(`http://localhost:8000/users/${id}/password`, {
      nouveau_mot_de_passe: this.nouveauMotDePasse
    }).subscribe({
      next: () => this.fermerModal(),
      error: (err) => console.error('Erreur mot de passe', err)
    });
  }

  confirmerSuppression(): void {
    const id = this.userSelectionne?.id;
    this.http.delete(`http://localhost:8000/users/${id}`).subscribe({
      next: () => {
        this.loadParents();
        this.loadAnimatrices();
        this.loadStats();
        this.fermerModal();
      },
      error: (err) => console.error('Erreur suppression', err)
    });
  }

  // ===== MOT DE PASSE =====

  setModeMdp(mode: string): void {
    this.modeMdp = mode;
    if (mode === 'auto') this.genererMotDePasse();
    else this.nouveauMotDePasse = '';
    this.copie = false;
  }

  genererMotDePasse(): void {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&';
    this.nouveauMotDePasse = Array.from({ length: 10 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
    this.copie = false;
  }

  copierMdp(): void {
    navigator.clipboard.writeText(this.nouveauMotDePasse).then(() => {
      this.copie = true;
      setTimeout(() => this.copie = false, 2000);
    });
  }

  // ===== ENFANTS (modal Modifier) =====

  get filteredEnfantsDisponibles(): any[] {
    if (!this.rechercheEnfant) return this.enfantsDisponibles;
    const s = this.rechercheEnfant.toLowerCase();
    return this.enfantsDisponibles.filter(e =>
      (e.prenom + ' ' + e.nom).toLowerCase().includes(s)
    );
  }

  isEnfantSelectionne(enfant: any): boolean {
    return this.enfantsSelectionnes.some(e => e.id === enfant.id);
  }

  toggleEnfant(enfant: any): void {
    if (this.isEnfantSelectionne(enfant)) {
      this.enfantsSelectionnes = this.enfantsSelectionnes.filter(e => e.id !== enfant.id);
    } else {
      this.enfantsSelectionnes.push(enfant);
    }
  }
}
