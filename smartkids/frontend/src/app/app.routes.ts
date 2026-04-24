import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';
import { NotFound } from './shared/components/not-found/not-found';

export const routes: Routes = [
  // ── Public ──────────────────────────────────────
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
  },

  // ── Parent ───────────────────────────────────────
  {
    path: 'parent',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/components/layout/layout').then(m => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/parent/dashboard/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'children',
        loadComponent: () => import('./features/parent/children/children/children').then(m => m.ChildrenComponent)
      },
      {
        path: 'events',
        loadComponent: () => import('./features/parent/events/events/events').then(m => m.EventsComponent)
      },
    ]
  },

  // ── Animatrice ───────────────────────────────────
  {
    path: 'animatrice',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/components/layout-animatrice/layout-animatrice').
      then(m => m.LayoutAnimatrice),  // ✅ layout ajouté
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },  // ✅ redirection
      {
        path: 'dashboard',
        loadComponent: () => import('./features/animatrice/dashboard/dashboard')
          .then(m => m.DashboardAnimatriceComponent)
      },
      {
        path: 'journal',
        loadComponent: () => import('./features/animatrice/journal/journal')
          .then(m => m.JournalComponent)
      },
      {
        path: 'evenement',
        loadComponent: () => import('./features/animatrice/evenement/evenement')
          .then(m => m.Evenement)
      },
      {
        path: 'enfant-assignes',
        loadComponent: () => import('./features/animatrice/enfant-assignes/enfant-assignes')
          .then(m => m.EnfantsComponent)
      }, 
       {
        path: 'notification',
        loadComponent: () => import('./features/animatrice/notification/notification')
          .then(m => m.Notification)
      }, 
    ]
  },

  // ── Directrice ───────────────────────────────────
  {
    path: 'directrice',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/components/layout-directrice/layout-directrice')
      .then(m => m.layoutDirectrice),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/directrice/dashboard/dashboard')
          .then(m => m.DashboardDirectriceComponent)
      },
      {
        path: 'gerer-classe',
        loadComponent: () => import('./features/directrice/gerer-classe/gerer-classe')
          .then(m => m.ClassesComponent)
      },
      {
        path: 'gerer-enfant',
        loadComponent: () => import('./features/directrice/gerer-enfant/gerer-enfant')
          .then(m => m.GererEnfantComponent)
      },
    ]
  },

  // ── Fallback ─────────────────────────────────────
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotFound }
];