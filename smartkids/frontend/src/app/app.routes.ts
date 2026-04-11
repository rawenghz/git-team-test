import { Routes } from '@angular/router';
import { DirectriceLayoutComponent } from './layout/directrice-layout/directrice-layout';
import { EnfantsComponent } from './pages/enfants/enfants';

export const routes: Routes = [
  {
    path: '',
    component: DirectriceLayoutComponent,
    children: [
      { path: '', redirectTo: 'enfants', pathMatch: 'full' },
      { path: 'enfants', component: EnfantsComponent },
      // Les autres équipes ajoutent leurs routes ici :
      // { path: 'evenements', component: EvenementsComponent },
      // { path: 'classes', component: ClassesComponent },
      // etc.
    ]
  }
];