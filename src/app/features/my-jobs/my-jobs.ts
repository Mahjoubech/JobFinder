import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { JobService, Job } from '../../core/service/job';
import { ApplicationService } from '../../core/service/applications';
import { Auth } from '../../core/service/auth';
import { Application } from '../../core/models/applicationInterface';
import { LogoBackgroundPipe } from '../../shared/pipes/logo-background-pipe';
import { Navbar } from '../../shared/components/navbar/navbar';
import { ToastService } from '../../core/service/toast';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-jobs',
  standalone: true,
  imports: [CommonModule, RouterLink, LogoBackgroundPipe, Navbar, FormsModule],
  templateUrl: './my-jobs.html',
  styleUrl: './my-jobs.css'
})
export class MyJobs implements OnInit {
  activeTab = signal<'saved' | 'applied' | 'interviews' | 'archived'>('saved');
  savedJobs = signal<Job[]>([]);
  applications = signal<Application[]>([]);
  
  private jobService = inject(JobService);
  private appService = inject(ApplicationService);
  private auth = inject(Auth);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  ngOnInit() {
    this.route.params.subscribe(params => {
        const tab = params['tab'];
        if (tab && ['saved', 'applied', 'interviews', 'archived'].includes(tab)) {
            this.activeTab.set(tab as any);
        } else {
            this.activeTab.set('saved');
        }
    });
    this.loadSavedJobs();
    this.loadApplications();
  }

  loadSavedJobs() {
    this.jobService.favorites$.subscribe(jobs => {
      this.savedJobs.set(jobs);
    });
  }

  loadApplications() {
    const user = this.auth.getCurrentUser();
    if (user) {
      this.appService.getUserApplications(user.id).subscribe(apps => {
        this.applications.set(apps);
      });
    }
  }

  getApplicationsByStatus(status: string): Application[] {
      if (status === 'accepted') {
          return this.applications().filter(a => a.status === 'accepted');
      }
      if (status === 'refused') {
          return this.applications().filter(a => a.status === 'refused');
      }
      return this.applications().filter(a => a.status === 'en_attente');
  }

  getCurrentStatusFilter(): string {
      switch(this.activeTab()) {
          case 'interviews': return 'accepted';
          case 'archived': return 'refused';
          default: return 'en_attente';
      }
  }

  apply(job: Job) {
     this.router.navigate(['/jobs', job.id, 'apply']);
  }

  removeFavorite(job: Job) {
      this.jobService.toggleFavorite(job);
  }

  updateStatus(app: Application, event: any) {
    const newStatus = event.target.value;
    if (!app.id) return;
    this.appService.updateStatus(app.id, newStatus).subscribe({
      next: () => {
        this.toastService.show('Status updated', 'success');
        this.loadApplications(); 
      },
      error: () => this.toastService.show('Failed to update status', 'error')
    });
  }

  expandedAppId = signal<string | number | null>(null);

  toggleNotes(app: Application) {
    if (this.expandedAppId() === app.id) {
      this.expandedAppId.set(null);
    } else {
      this.expandedAppId.set(app.id!);
    }
  }

  saveNotes(app: Application) {
      if (!app.id) return;
      this.appService.updateNotes(app.id, app.notes).subscribe({
          next: () => {
              this.toastService.show('Notes updated successfully!', 'success');
              this.expandedAppId.set(null);
          },
          error: () => this.toastService.show('Failed to update notes.', 'error')
      });
  }

  showDeleteModal = signal(false);
  applicationToDelete = signal<Application | null>(null);

  confirmDelete(app: Application) {
    this.applicationToDelete.set(app);
    this.showDeleteModal.set(true);
  }

  cancelDelete() {
    this.showDeleteModal.set(false);
    this.applicationToDelete.set(null);
  }

  performDelete() {
    const app = this.applicationToDelete();
    if (!app || !app.id) return;
    
    this.appService.deleteApplication(app.id).subscribe({
      next: () => {
        this.toastService.show('Application deleted successfully!', 'success');
        this.loadApplications();
        this.cancelDelete();
      },
      error: () => {
        this.toastService.show('Failed to delete application', 'error');
        this.cancelDelete();
      }
    });
  }
}
