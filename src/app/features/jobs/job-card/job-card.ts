import {Component, Input ,ChangeDetectionStrategy } from '@angular/core';
import {CommonModule} from '@angular/common';
import {Job} from '../../../core/service/job';
import {LogoBackgroundPipe} from '../../../shared/pipes/logo-background-pipe';
import {CompanyInitialsPipe} from '../../../shared/pipes/company-initials-pipe';

@Component({
  selector: 'app-job-card',
  standalone:true,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [CommonModule , LogoBackgroundPipe , CompanyInitialsPipe],
  templateUrl: './job-card.html',
  styleUrl: './job-card.css',
})
export class JobCard {
  @Input() job!: Job;
  @Input() isActive: boolean = false ;
  isFavorite = false;

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }
}
