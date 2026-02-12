import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {Navbar} from '../../../shared/components/navbar/navbar';
import {FormsModule} from '@angular/forms';
import {JobService} from '../../../core/service/job';

@Component({
  selector: 'app-job-search',
  imports: [RouterLink, CommonModule ,Navbar , FormsModule],
  templateUrl: './job-search.html',
  styleUrl: './job-search.css',
})
export class JobSearch {
  keyword = "";
  constructor(private  jobService : JobService) {}
  onSearch(){
    this.jobService.search(this.keyword);
  }

  onReset() {
    this.keyword = '';
    this.jobService.resetSearch();
  }
}
