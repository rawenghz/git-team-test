// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';
import { NotFound } from './shared/components/not-found/not-found';
import { ClassesComponent } from './features/directrice/gerer-classe/gerer-classe';
import { DashboardDirectriceComponent } from './features/directrice/dashboard/dashboard';
import { GererEnfantComponent } from './features/directrice/gerer-enfant/gerer-enfant';
import { layoutDirectrice } from './shared/components/layout-directrice/layout-directrice';
import { LayoutComponent } from './shared/components/layout/layout';
import { DashboardComponent } from './features/parent/dashboard/dashboard/dashboard';
import { EventsComponent } from './features/parent/events/events/events';
import { ChildrenComponent } from './features/parent/children/children/children';
import { LoginComponent } from './features/auth/login/login';

export const routes: Routes = [
  // ── Public ──────────────────────────────────────
  {
    path: 'login',
    component: LoginComponent
  },

  // ── Parent ───────────────────────────────────────
  {
    path: 'parent',
    canActivate: [authGuard],
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'children',
        component: ChildrenComponent
      },
      {
        path: 'events',
        component: EventsComponent
      },
    ]
  },

  // ── Directrice ───────────────────────────────────
  {
    path: 'directrice',
    canActivate: [authGuard],
    component: layoutDirectrice,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardDirectriceComponent,

      },
      {
        path: 'gerer-classe',
        component: ClassesComponent
      },
      {
        path: 'gerer-enfant',
        component: GererEnfantComponent
      },
    ]
  },

  // ── Fallback ─────────────────────────────────────
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotFound }
];