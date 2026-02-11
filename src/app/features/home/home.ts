import { Component } from '@angular/core';
import { JobSearch } from '../jobs/job-search/job-search';
import { JobFilter } from '../jobs/job-filter/job-filter';
import { JobList } from '../jobs/job-list/job-list';
import { JobDetail } from '../jobs/job-detail/job-detail';


@Component({
  selector: 'app-home',
  imports: [ JobSearch, JobFilter, JobList, JobDetail],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
