import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Job, JobService} from '../../../core/service/job';
import {CommonModule} from '@angular/common';
import {LogoBackgroundPipe} from '../../../shared/pipes/logo-background-pipe';
import {CompanyInitialsPipe} from '../../../shared/pipes/company-initials-pipe';
@Component({
  selector: 'app-job-detail',
  standalone:true,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [CommonModule ,  LogoBackgroundPipe , CompanyInitialsPipe],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.css',
})
export class JobDetail implements OnInit{
  isFavorite = false;
 job:Job | null = null;
 constructor(private jobService : JobService) {}

  ngOnInit(): void {
        this.jobService.selectedJob$.subscribe(
          job => {
            this.job = job;
            this.isFavorite = false;
          }
        )
    }
  get companyDescriptionSnippet(): string {
    if (!this.job?.contents) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.job.contents;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    return text.length > 200 ? text.substring(0, 200) + '...' : text;
  }
  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }
}
