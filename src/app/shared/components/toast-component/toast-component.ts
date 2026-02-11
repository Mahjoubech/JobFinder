import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/service/toast';

@Component({
  selector: 'app-toast-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-component.html',
  styleUrl: './toast-component.css',
})
export class ToastComponent {
  toasts$;

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toast$;
  }

  remove(id: number) {
    this.toastService.remove(id);
  }
}
