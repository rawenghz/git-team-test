import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';
import { NotFound } from './shared/components/not-found/not-found';
import { CreerCompte } from './features/directrice/creer-compte/creer-compte';
import { ConsulterCompte } from './features/directrice/consulter-compte/consulter-compte';
import { ClassesComponent } from './features/directrice/gerer-classe/gerer-classe';
import { DashboardDirectriceComponent } from './features/directrice/dashboard/dashboard';
import { GererEnfantComponent } from './features/directrice/gerer-enfant/gerer-enfant';
import { layoutDirectrice } from './shared/components/layout-directrice/layout-directrice';
import { LayoutComponent } from './shared/components/layout/layout';
import { DashboardComponent } from './features/parent/dashboard/dashboard/dashboard';
import { EventsComponent } from './features/parent/events/events/events';
import { ChildrenComponent } from './features/parent/children/children/children';
import { LoginComponent } from './features/auth/login/login';
import { HomeComponent } from './features/home/home';  

export const routes: Routes = [
  { path: '',      component: HomeComponent },          
  { path: 'login', component: LoginComponent },

  {
    path: 'parent',
    canActivate: [authGuard],
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'children',  component: ChildrenComponent },
      { path: 'events',    component: EventsComponent },
    ]
  },

  {
    path: 'directrice',
    canActivate: [authGuard],
    component: layoutDirectrice,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',        component: DashboardDirectriceComponent },
      { path: 'gerer-classe',     component: ClassesComponent },
      { path: 'gerer-enfant',     component: GererEnfantComponent },
      { path: 'creer-compte',     component: CreerCompte },
      { path: 'consulter-compte', component: ConsulterCompte },
      {
        path: 'gerer-evenement',
        loadComponent: () =>
          import('./features/directrice/gerer-evenements/gerer-evenements')
            .then(m => m.GererEvenementComponent)
      },
      {
        path: 'gerer-notification',
        loadComponent: () =>
          import('./features/directrice/gerer-notifications/gerer-notifications')
            .then(m => m.GererNotificationComponent)
      },
    ]
  },

  { path: '**', component: NotFound }
];