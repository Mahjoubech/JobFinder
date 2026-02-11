import {Component, Input ,ChangeDetectionStrategy } from '@angular/core';
import {CommonModule} from '@angular/common';
import {Job} from '../../../core/service/job';

@Component({
  selector: 'app-job-card',
  standalone:true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './job-card.html',
  styleUrl: './job-card.css',
})
export class JobCard {
  @Input() job!: Job;

  getCompanyLogo(name: string): string {
    if (!name) return 'https://placehold.co/600x400';

    const cleanName = name
      .replace(/[,.]/g, '') // Remove dots and commas
      .replace(/\s/g, '')   // Remove spaces
      .replace(/Inc$/i, '')
      .replace(/LLC$/i, '');

    return 'https://placehold.co/600x400/EEE/31343C?font=poppins&text='+cleanName;

  }
}
