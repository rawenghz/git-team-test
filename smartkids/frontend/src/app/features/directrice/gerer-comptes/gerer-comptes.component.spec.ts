import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router, NavigationEnd } from '@angular/router';
import { GererComptesComponent } from './gerer-comptes.component';
import { of } from 'rxjs';

declare const jasmine: any;

describe('GererComptesComponent', () => {
  let component: GererComptesComponent;
  let fixture: ComponentFixture<GererComptesComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GererComptesComponent, HttpClientTestingModule],
      providers: [
        {
          provide: Router,
          useValue: {
            events: of(new NavigationEnd(1, '/directrice/gerer-comptes', '/directrice/gerer-comptes')),
            navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true))
          }
        }
      ]
    })
    .compileComponents();
    
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(GererComptesComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger les parents lors de l\'initialisation', () => {
    fixture.detectChanges();
    
    const req = httpMock.expectOne('http://localhost:8000/users/parents');
    expect(req.request.method).toBe('GET');
    req.flush([
      { id: 1, nom: 'Dupont', prenom: 'Marie', email: 'marie@example.com' }
    ]);
    
    expect(component.parents.length).toBe(1);
    expect(component.stats.totalParents).toBe(1);
  });

  it('devrait sauvegarder les modifications d\'un compte', () => {
    const userModifie = {
      id: 1,
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie.dupont@example.com'
    };

    component.userSelectionne = userModifie;
    component.formModifier = {
      nom_complet: 'Marie Dupont',
      email: 'marie.dupont@example.com'
    };
    component.enfantsSelectionnes = [];

    component.sauvegarderModification();

    const req = httpMock.expectOne('http://localhost:8000/users/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({
      prenom: 'Marie',
      nom: 'Dupont',
      email: 'marie.dupont@example.com',
      enfants_ids: []
    });

    req.flush({ success: true });

    // Vérifier que les parents ont été rechargés
    const parentsReq = httpMock.expectOne('http://localhost:8000/users/parents');
    parentsReq.flush([]);

    const animatricesReq = httpMock.expectOne('http://localhost:8000/users/animatrices');
    animatricesReq.flush([]);
  });

  it('devrait ouvrir et fermer le modal de modification', () => {
    const user = { id: 1, nom: 'Dupont', prenom: 'Marie', email: 'marie@example.com' };
    
    component.ouvrirModifier(user);
    
    expect(component.modalOuvert).toBe('modifier');
    expect(component.userSelectionne).toBe(user);
    expect(component.formModifier.nom_complet).toBe('Marie Dupont');
    expect(component.formModifier.email).toBe('marie@example.com');
  });

  it('devrait filtrer les parents par nom', () => {
    component.parents = [
      { id: 1, nom: 'Dupont', prenom: 'Marie', email: 'marie@example.com' },
      { id: 2, nom: 'Martin', prenom: 'Jean', email: 'jean@example.com' }
    ];
    component.searchTerm = 'martin';

    const filtered = component.filteredParents;
    expect(filtered.length).toBe(1);
    expect(filtered[0].nom).toBe('Martin');
  });

  it('devrait trier les parents par nom', () => {
    component.parents = [
      { id: 1, nom: 'Dupont', prenom: 'Marie', email: 'marie@example.com' },
      { id: 2, nom: 'Blanc', prenom: 'Jean', email: 'jean@example.com' }
    ];
    component.sortOrder = 'nom_asc';

    const sorted = component.filteredParents;
    expect(sorted[0].nom).toBe('Blanc');
    expect(sorted[1].nom).toBe('Dupont');
  });
});
