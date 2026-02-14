import {Component, Input, ChangeDetectionStrategy, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Job} from '../../../core/service/job';
import {LogoBackgroundPipe} from '../../../shared/pipes/logo-background-pipe';
import {CompanyInitialsPipe} from '../../../shared/pipes/company-initials-pipe';
import { Auth } from '../../../core/service/auth';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-job-card',
  standalone:true,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [CommonModule , LogoBackgroundPipe , CompanyInitialsPipe],
  templateUrl: './job-card.html',
  styleUrl: './job-card.css',
})
export class JobCard implements OnInit {
  @Input() job!: Job;
  @Input() isActive: boolean = false ;
  isFavorite = false;
  
  private authService = inject(Auth);
  user: User | null = null;
  
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }
}
