import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../core/service/job';

@Component({
  selector: 'app-job-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-filter.html',
  styleUrl: './job-filter.css',
})
export class JobFilter implements OnInit {
  activeDropdown: string | null = null;

  filters = {
    date: '',
    level: '',
    company: '',
    remote: false,
    easyApply: false
  };

  companies: string[] = [];
  levels: string[] = [];

  dateOptions = [
    { label: 'Past 24 hours', value: '24h' },
    { label: 'Past week', value: '7d' },
    { label: 'Past month', value: '30d' },
    { label: 'Any time', value: '' }
  ];

  constructor(private jobService: JobService) {}

  ngOnInit() {
    this.jobService.jobs$.subscribe(() => {
      setTimeout(() => {
        this.companies = this.jobService.getUniqueCompanies();
        this.levels = this.jobService.getUniqueLevels();
      });
    });
  }

  toggleDropdown(name: string) {
    this.activeDropdown = this.activeDropdown === name ? null : name;
  }

  applyFilter(type: string, value: any) {
    if (type === 'date') this.filters.date = value;
    if (type === 'level') this.filters.level = value;
    if (type === 'company') this.filters.company = value;
    if (type === 'remote') this.filters.remote = !this.filters.remote;
    if (type === 'easyApply') this.filters.easyApply = !this.filters.easyApply;

    this.jobService.filterJobs(this.filters);

    if (type !== 'remote' && type !== 'easyApply') {
      this.activeDropdown = null;
    }
  }

  reset() {
    this.filters = {
      date: '',
      level: '',
      company: '',
      remote: false,
      easyApply: false
    };
    this.jobService.resetSearch();
  }
}
