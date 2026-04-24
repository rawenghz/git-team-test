import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private fb   = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email:        ['', [Validators.required, Validators.email]],
    mot_de_passe: ['', Validators.required]
  });

  loading     = signal(false);
  errorMsg    = signal('');
  showPassword = signal(false);

  isInvalid(field: string): boolean {
    const ctrl = this.loginForm.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  onSubmit(): void {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.loading.set(true);
  this.errorMsg.set('');

  const { email, mot_de_passe } = this.loginForm.value;

  this.auth.login({ email: email!, mot_de_passe: mot_de_passe! }).subscribe({
    next: (res: any) => {
  const role = res.role;

  if (role === 'directrice') {
    this.router.navigate(['/directrice/dashboard']);
  } 
  else if (role === 'animatrice') {
    this.router.navigate(['/animatrice/dashboard']);
  } 
  else if (role === 'parent') {
    this.router.navigate(['/parent/dashboard']);
  } 
  else {
    this.errorMsg.set('Rôle inconnu');
  }

  this.loading.set(false);
}
  });
}
}