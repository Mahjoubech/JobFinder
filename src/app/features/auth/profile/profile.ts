import { Component, OnInit } from '@angular/core';
import { Auth, User } from '../../../core/service/auth';
import { JobSearch } from '../../jobs/job-search/job-search';
import { JobCard } from '../../jobs/job-card/job-card';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {ToastService } from '../../../core/service/toast';
import { HttpErrorResponse } from '@angular/common/http';
import {ToastComponent} from '../../../shared/components/toast-component/toast-component';
@Component({
  selector: 'app-profile',
  imports: [JobSearch, JobCard, FormsModule, CommonModule ,ToastComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit{
  user: User | null = null;


  firstName: string = '';
  lastName: string = '';
  email: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private authService: Auth,
    private toastService: ToastService
  ) {}
  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if(user){
      this.user = user;
      this.email = user.email;
      this.firstName = user.firstName;
      this.lastName = user.lastName;
    }
  }


  updateProfile() {
    if (!this.user) return;

    if (this.newPassword && this.newPassword !== this.confirmPassword) {
      return;
    }

    const updateData: Partial<User> = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email
    };
    if (this.newPassword) {
      updateData.password = this.newPassword;
    }
    this.authService.updateProfile(this.user.id, updateData).subscribe({
        next: (user) => {
          this.user = user;
          this.oldPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
          this.toastService.show('Profile updated successfully!', 'success');
        },
        error: (err) => {
          this.toastService.show('Failed to update profile.', 'error');
        }
      });
  }

}
