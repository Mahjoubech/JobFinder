import {Component, OnChanges, OnInit, signal, SimpleChanges} from '@angular/core';
import { JobCard } from '../job-card/job-card';
import {CommonModule} from '@angular/common';
import {Job, JobService} from '../../../core/service/job';
import {Loader} from '../../../shared/components/loader/loader';
import {delay} from 'rxjs';

@Component({
  selector: 'app-job-list',
  standalone:true,
  imports: [JobCard , CommonModule ,Loader],
  templateUrl: './job-list.html',
  styleUrl: './job-list.css',
})
export class JobList implements OnInit , OnChanges{
jobs:Job[] = [];
page = 0;
limit = 8 ;
loading  = signal(false);
allLoaded =  signal(false) ;
  selectedJobId:number | null = null;
  searchKeyword = '';
constructor(protected jobService : JobService) {}
  ngOnInit(): void {
    this.jobService.jobs$.subscribe(jobs => {
      this.jobs = jobs;
      if (this.jobs.length > 0) {
        this.selectJob(this.jobs[0]);
      }
    });
    this.jobService.search('', '', 0);
    this.jobService.loading$.subscribe(isLoading => {
      this.loading.set(isLoading);
    });

    this.jobService.search('' , '' , 0);
    this.jobService.searchKeyword$.subscribe(keyword => {
      this.searchKeyword = keyword;});
    this.jobService.selectedJob$.subscribe(job => {
      this.selectedJobId = job ? job.id : null;
    });

    if (this.jobs.length > 0 && !this.selectedJobId) {
      this.selectJob(this.jobs[0]);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['jobs'] && this.jobs.length > 0 && !this.selectedJobId) {
      this.selectJob(this.jobs[0]);
    }
  }
  selectJob(job: Job) {
    this.jobService.setSelectedJob(job);
  }
  loadJobs(){
  if (this.loading() || this.allLoaded()) return;
    this.loading.set(true);
  this.jobService.getJobs(this.page , this.limit).pipe(delay(2000)).subscribe({
    next : (newJobs)=> {
      if(newJobs.length === 0){
        this.allLoaded.set(true);
      }else{
        this.jobs  = [...this.jobs , ...newJobs ]
        this.page++;
      }
      this.loading.set(false);
      console.log(`Loaded page ${this.page}, total jobs: ${this.jobs.length}`);
      },
    error:(err)=> {console.error('Error fetching Jobs ' , err);
      this.loading.set(false);
    }


  })
    }
  onScroll(event: any) {
    const element = event.target;
    if (element.scrollHeight - element.scrollTop <= element.clientHeight + 50) {
      this.loadJobs();
    }
  }
  trackByJob(index: number, job: Job): number {
    return job.id;
  }

  selectedJob(job:Job){
    console.log(this.jobService.setSelectedJob(job));
  }
}
