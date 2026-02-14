import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../../core/service/applications';
import { Auth } from '../../../core/service/auth';
import { ToastService } from '../../../core/service/toast';
import { Job } from '../../../core/models/job';
import { LogoBackgroundPipe } from '../../../shared/pipes/logo-background-pipe';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-job-apply',
  standalone: true,
  imports: [CommonModule, FormsModule, LogoBackgroundPipe, RouterLink, Navbar],
  templateUrl: './job-apply.html'
})
export class JobApply implements OnInit {
  job = signal<Job | null>(null);
  note = signal('');
  isSubmitting = signal(false);
  isLoading = signal(true);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private appService = inject(ApplicationService);
  private auth = inject(Auth);
  private toastService = inject(ToastService);

  ngOnInit() {
    // Resolver data
    const job = this.route.snapshot.data['job'];
    if (job) {
      this.job.set(job);
      this.isLoading.set(false);
    } else {
      this.toastService.show('Failed to load job details', 'error');
      this.router.navigate(['/']);
    }
  }

  confirmApplication() {
      const job = this.job();
      const user = this.auth.getCurrentUser();

      if (!job || !user) return;

      this.isSubmitting.set(true);

      const newApp = {
        userId: user.id,
        offerId: job.id.toString(),
        apiSource: 'themuse',
        title: job.name,
        company: job.company.name,
        location: job.locations[0]?.name || 'Unknown',
        url: job.refs?.landing_page || '',
        status: 'en_attente' as const,
        notes: this.note(),
        dateAdded: new Date().toISOString()
      };

      this.appService.addApplication(newApp as any).subscribe({
        next: () => {
          this.toastService.show('Application submitted successfully!', 'success');
          this.router.navigate(['/applications']);
        },
        error: (err) => {
          console.error(err);
          this.toastService.show('Failed to submit application.', 'error');
          this.isSubmitting.set(false);
        }
      });
  }

  cancel() {
      const job = this.job();
      if(job) {
          this.router.navigate(['/jobs', job.id]);
      } else {
          this.router.navigate(['/']);
      }
  }
}
