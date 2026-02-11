import {Component, OnInit} from '@angular/core';
import { JobCard } from '../job-card/job-card';
import {CommonModule} from '@angular/common';
import {Job, JobService} from '../../../core/service/job';
import {Loader} from '../../../shared/components/loader/loader';

@Component({
  selector: 'app-job-list',
  standalone:true,
  imports: [JobCard , CommonModule ,Loader],
  templateUrl: './job-list.html',
  styleUrl: './job-list.css',
})
export class JobList implements OnInit{
jobs:Job[] = [];
page = 0;
limit = 20 ;
loading = false ;
allLoaded = false ;
constructor(protected jobService : JobService) {}
  ngOnInit(): void {
  this.loadJobs();
  }
  loadJobs(){
  if (this.loading || this.allLoaded) return;
    this.loading = true;
  this.jobService.getJobs(this.page , this.limit).subscribe({
    next : (newJobs)=> {
      if(newJobs.length === 0){
        this.allLoaded = true;
      }else{
        this.jobs  = [...this.jobs , ...newJobs ]
        this.page++;
      }
      this.loading = false;
      console.log(`Loaded page ${this.page}, total jobs: ${this.jobs.length}`);
      },
    error:(err)=> {console.error('Error fetching Jobs ' , err);
      this.loading = false;
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
}
