import { Component, OnInit, inject, signal } from '@angular/core';
import { Auth } from '../../../core/service/auth';
import { User } from '../../../core/models/user';
import { JobSearch } from '../../jobs/job-search/job-search';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/service/toast';
import { ToastComponent } from '../../../shared/components/toast-component/toast-component';
import { ApplicationService } from '../../../core/service/applications';
import { JobService } from '../../../core/service/job';
import { Application } from '../../../core/models/applicationInterface';
import { LogoBackgroundPipe } from '../../../shared/pipes/logo-background-pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [JobSearch, FormsModule, CommonModule, ToastComponent, LogoBackgroundPipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  user: User | null = null;

  // Profile Fields
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  jobTitle: string = '';
  profileImage: string = '';
  resumeUrl: string = '';

  // Password Fields
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  // Stats & Data
  favoritesCount = signal(0);
  appliedCount = signal(0);
  recentApplications = signal<Application[]>([]);
  isLoading = signal(false);

  // Constants
  readonly jobTitles = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Product Manager',
    'UX/UI Designer',
    'Data Scientist',
    'DevOps Engineer',
    'Mobile Developer',
    'QA Engineer'
  ];

  readonly defaultProfileImage = 'https://img.freepik.com/free-vector/hand-drawn-question-mark-silhouette_23-2150940534.jpg?semt=ais_wordcount_boost&w=740&q=80';

  private authService = inject(Auth);
  private toastService = inject(ToastService);
  private appService = inject(ApplicationService);
  private jobService = inject(JobService);

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.user = user;
      this.populateForm(user);
      this.loadStats(user.id);
      this.loadRecentApps(user.id);
    }
  }

  populateForm(user: User) {
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.jobTitle = user.jobTitle || '';
    this.profileImage = user.profileImage || '';
    this.resumeUrl = user.resumeUrl || '';
  }

  get displayedImage(): string {
    return this.profileImage?.trim() ? this.profileImage : this.defaultProfileImage;
  }

  loadStats(userId: string) {
    // favorites count
    this.jobService.favorites$.subscribe(favs => {
        this.favoritesCount.set(favs.length);
    });

    // applied count
    this.appService.getUserApplications(userId).subscribe(apps => {
        this.appliedCount.set(apps.length);
    });
  }

  loadRecentApps(userId: string) {
      this.appService.getUserApplications(userId).subscribe(apps => {
          // Get last 3 applications sorted by date
          const sorted = [...apps].sort((a, b) =>
            new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime()
          ).slice(0, 3);
          this.recentApplications.set(sorted);
      });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.toastService.show('Image size should be less than 5MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfile() {
    if (!this.user) return;

    if (this.newPassword && this.newPassword !== this.confirmPassword) {
      this.toastService.show('Passwords do not match', 'error');
      return;
    }

    this.isLoading.set(true);

    const updateData: Partial<User> = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      jobTitle: this.jobTitle,
      profileImage: this.profileImage,
      resumeUrl: this.resumeUrl
    };

    if (this.newPassword) {
      updateData.password = this.newPassword;
    }

    this.authService.updateProfile(this.user.id, updateData).subscribe({
      next: (user) => {
        this.user = user;
        this.resetPasswordFields();
        this.isLoading.set(false);
        this.toastService.show('Profile updated successfully!', 'success');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastService.show('Failed to update profile. Please try again.', 'error');
      }
    });
  }

  resetPasswordFields() {
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }
}
