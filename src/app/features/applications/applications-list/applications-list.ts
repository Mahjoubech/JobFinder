import {Component, OnInit, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApplicationService} from '../../../core/service/applications';
import {Auth} from '../../../core/service/auth';
import {Application} from '../../../core/models/applicationInterface';
import {ToastService} from '../../../core/service/toast';
import {RouterLink} from '@angular/router';
import {LogoBackgroundPipe} from '../../../shared/pipes/logo-background-pipe';
import {FormsModule} from '@angular/forms';
import {JobService, Job} from '../../../core/service/job';
import {JobDetail} from '../../jobs/job-detail/job-detail';
import {JobFilter} from '../../jobs/job-filter/job-filter';
import {JobSearch} from '../../jobs/job-search/job-search';

@Component({
  selector: 'app-applications-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LogoBackgroundPipe, JobDetail, JobFilter, JobSearch],
  templateUrl: './applications-list.html',
  styleUrl: './applications-list.css'
})
export class ApplicationsList implements OnInit {
  applications = signal<Application[]>([]);
  filteredApplications = signal<Application[]>([]);
  isLoading = signal(true);
  selectedAppId = signal<string | null>(null);
  
  private appService = inject(ApplicationService);
  private auth = inject(Auth);
  private toastService = inject(ToastService);
  private jobService = inject(JobService);

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    const user = this.auth.getCurrentUser();
    if (!user) return; 

    this.isLoading.set(true);
    this.appService.getUserApplications(user.id).subscribe({
      next: (apps) => {
        this.applications.set(apps);
        this.filteredApplications.set(apps);
        this.isLoading.set(false);
        if (apps.length > 0) {
            this.onSelect(apps[0]);
        }
      },
      error: () => {
        this.toastService.show('Error loading applications', 'error');
        this.isLoading.set(false);
      }
    });
  }

  onSearch(keyword: string) {
    if (!keyword.trim()) {
      this.filteredApplications.set(this.applications());
      return;
    }
    const lowerKey = keyword.toLowerCase();
    const filtered = this.applications().filter(app => 
      app.title.toLowerCase().includes(lowerKey) || 
      app.company.toLowerCase().includes(lowerKey) ||
      app.location.toLowerCase().includes(lowerKey)
    );
    this.filteredApplications.set(filtered);

    if (filtered.length > 0) {
      this.onSelect(filtered[0]);
    } else {
      this.jobService.setSelectedJob(null);
    }
  }

  onReset() {
    this.filteredApplications.set(this.applications());
    if (this.applications().length > 0) {
      this.onSelect(this.applications()[0]);
    }
  }

  onSelect(app: Application) {
      if (!app.id) return;
      this.selectedAppId.set(app.id.toString());
      
      const partialJob: Job = {
          id: parseInt(app.offerId, 10) || 0,
          name: app.title,
          short_name: app.title,
          company: { name: app.company, id: 0, short_name: app.company },
          locations: [{ name: app.location }],
          type: 'Unknown',
          publication_date: app.dateAdded,
          refs: { landing_page: app.url },
          categories: [],
          levels: [],
          tags: [],
          contents: '',
          model_type: 'jobs'
      };

      this.jobService.setSelectedJob(partialJob);
  }

  updateStatus(app: Application, event: any) {
    const newStatus = event.target.value;
    if (!app.id) return;

    this.appService.updateStatus(app.id, newStatus).subscribe({
      next: () => {
        this.toastService.show('Status updated', 'success');
        this.applications.update(apps => apps.map(a => a.id === app.id ? {...a, status: newStatus} : a));
      },
      error: () => this.toastService.show('Failed to update status', 'error')
    });
  }
  
  saveNotes(app: Application) {
      if (!app.id) return;
      this.appService.updateNotes(app.id, app.notes).subscribe({
          next: () => this.toastService.show('Notes saved', 'success'),
          error: () => this.toastService.show('Failed to save notes', 'error')
      });
  }

  deleteApplication(id: number) {
    if(!confirm('Are you sure you want to stop tracking this application?')) return;
    
    this.appService.deleteApplication(id).subscribe({
        next: () => {
             this.toastService.show('Application deleted', 'success');
             this.applications.update(apps => apps.filter(a => a.id !== id));
             if (this.selectedAppId() === id.toString() && this.applications().length > 0) {
                 this.onSelect(this.applications()[0]);
             } else if (this.applications().length === 0) {
                 this.jobService.setSelectedJob(null);
             }
        },
        error: () => this.toastService.show('Failed to delete', 'error')
    })
  }

  getStatusClass(status: string): string {
      switch(status) {
          case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
          case 'refused': return 'bg-red-100 text-red-800 border-red-200';
          default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      }
  }
}
