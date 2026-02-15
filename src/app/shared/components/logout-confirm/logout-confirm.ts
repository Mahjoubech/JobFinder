import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logout-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout-confirm.html',
  styleUrl: './logout-confirm.css',
})
export class LogoutConfirm {
  @Input() isVisible = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  isLoading = false;

  confirmLogout() {
    this.isLoading = true;
    // small delay to show spinner if needed, then emit
    setTimeout(() => {
      this.isLoading = false;
      this.confirm.emit();
      this.closeModal();
    }, 200);
  }

  closeModal() {
    this.isVisible = false;
    this.close.emit();
    this.isLoading = false;
  }
}

