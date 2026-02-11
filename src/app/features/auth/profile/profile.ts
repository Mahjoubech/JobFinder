import { Component, OnInit } from '@angular/core';
import { Auth, User } from '../../../core/service/auth';
import { Router } from '@angular/router';
import { JobSearch } from '../../jobs/job-search/job-search';
import { JobCard } from '../../jobs/job-card/job-card';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [JobSearch, JobCard, FormsModule, CommonModule],
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

  constructor(private authService : Auth , private router: Router) {}

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
    if(this.newPassword && this.newPassword !== this.confirmPassword){
      return;
    }
    const updateData : Partial<User> = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email
    }
    if (this.newPassword){
      updateData.password = this.newPassword;
    }
    this.authService.updateProfile(this.user.id , updateData).subscribe({
      next: (updateUser => {
        this.user = updateUser;
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      })
    })
    console.log('Update Profile:', {
      firstName: this.firstName,
      lastName: this.lastName,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    });

  }
}
