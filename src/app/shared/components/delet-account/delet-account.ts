import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Auth} from '../../../core/service/auth';
import {Router} from '@angular/router';
import {ToastService} from '../../../core/service/toast';

@Component({
  selector: 'app-delet-account',
  imports: [
    FormsModule,
CommonModule  ],
  templateUrl: './delet-account.html',
  styleUrl: './delet-account.css',
})
export class DeletAccount {
@Input() isVisible = false;
@Output() close = new EventEmitter<void>();
text = '';
isLoading = false;
private  authService = inject(Auth);
private router = inject(Router);
private  toast = inject(ToastService);

// Implémentation de la suppression du compte
deleteAccount(){
  // vérifier la confirmation (tolérance aux espaces et à la casse)
  if (this.text == null || this.text.trim().toLowerCase() !== 'delete') {
    this.toast.show("You must type 'delete' to confirm", 'error');
    return;
  }

  const user = this.authService.getCurrentUser();
  if (!user || !user.id) {
    this.toast.show('No user is currently logged in', 'error');
    return;
  }

  this.isLoading = true;
  this.authService.deleteAccount(user.id).subscribe({
    next: () => {
      this.isLoading = false;
      this.toast.show('Account deleted successfully', 'success');
      this.closeModal();
      try {
        this.router.navigate(['/']);
      } catch (e) {
        // navigation may fail in tests/environments without router
      }
    },
    error: (err) => {
      this.isLoading = false;
      this.toast.show(err?.message || 'Failed to delete account', 'error');
    }
  });
}
  closeModal() {
    this.isVisible = false;
    this.close.emit();
    this.text = '';
  }

}
