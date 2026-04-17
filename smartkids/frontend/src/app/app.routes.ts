// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';
import { NotFound } from './shared/components/not-found/not-found';
import { CreerCompte } from './features/directrice/creer-compte/creer-compte';
import { ConsulterCompte } from './features/directrice/consulter-compte/consulter-compte';

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

  // ── Directrice ───────────────────────────────────
  {
    path: 'directrice',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/components/layout-directrice/layout-directrice').then(m => m.layoutDirectrice),
    children: [
      { path: '',
        redirectTo: 'gerer-classe',
        pathMatch: 'full' 
      },
      {
        path: 'gerer-classe',
        loadComponent: () => import('./features/directrice/gerer-classe/gerer-classe').then(m => m.ClassesComponent)
      },
      {
        path:'creer-compte',
        component:CreerCompte,
      },
      {
        path:'consulter-compte',
        component:ConsulterCompte,
      },
    ]
  },

  // ── Fallback ─────────────────────────────────────
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotFound }
];