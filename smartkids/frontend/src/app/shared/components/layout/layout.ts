import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class LayoutComponent {
  private auth = inject(AuthService);
  sidebarOpen = signal(false);

  userName()    { return this.auth.currentUser()?.nom ?? 'Utilisateur'; }
  userInitial() { return (this.auth.currentUser()?.nom ?? 'U').charAt(0).toUpperCase(); }

  logout()       { this.auth.logout(); }
  toggleSidebar(){ this.sidebarOpen.update(v => !v); }
  closeSidebar() { this.sidebarOpen.set(false); }
}