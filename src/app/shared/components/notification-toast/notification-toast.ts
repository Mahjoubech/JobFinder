import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Job } from '../../../core/models/job';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-toast.html',
  styles: [`
    .animate-slide-in-right {
      animation: slideIn 0.5s ease-out;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-shrink {
      animation: shrink 5s linear forwards;
    }
    @keyframes shrink {
      from { width: 100%; }
      to { width: 0%; }
    }
  `]
})
export class NotificationToast {
  @Input() job: Job | null = null;
  @Output() closed = new EventEmitter<void>();
  
  visible = false;
  private timeoutId: any;

  constructor(private router: Router) {}

  show(job: Job) {
    this.job = job;
    this.visible = true;
    
    // Auto-hide after 5 seconds
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => this.close(), 5000);
  }

  close() {
    this.visible = false;
    this.closed.emit();
  }

  viewJob() {
    if (this.job) {
      // Logic to navigate or select job
      // For now we just close, user can click "My Jobs" or simply verify list update
       this.close();
    }
  }
}
