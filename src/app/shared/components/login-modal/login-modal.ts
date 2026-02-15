import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../core/service/auth';
import { ToastService } from '../../../core/service/toast';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.css'
})
export class LoginModal {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();

  email = '';
  password = '';
  isLoading = false;

  private authService = inject(Auth);
  private router = inject(Router);
  private toastService = inject(ToastService);

  onLogin() {
    if (!this.email || !this.password) {
      this.toastService.show('Please enter both email and password', 'error');
      return;
    }

    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastService.show('Welcome back!', 'success');
        this.closeModal();
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.show(err.message || 'Login failed', 'error');
      }
    });
  }

  onRegister() {
    this.closeModal();
    this.router.navigate(['/register']);
  }

  closeModal() {
    this.isVisible = false;
    this.close.emit();
    this.email = '';
    this.password = '';
  }
}
