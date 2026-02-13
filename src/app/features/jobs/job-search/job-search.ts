import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() showSearch = true;
  @Input() explicitSearch = false;
  @Output() searchTrigger = new EventEmitter<string>();
  @Output() resetTrigger = new EventEmitter<void>();

  keyword = "";
  constructor(private  jobService : JobService) {}
  onSearch(){
    if (this.explicitSearch) {
      this.searchTrigger.emit(this.keyword);
    } else {
      this.jobService.search(this.keyword);
    }
  }

  onReset() {
    this.keyword = '';
    if (this.explicitSearch) {
      this.resetTrigger.emit();
    } else {
      this.jobService.resetSearch();
    }
  }
}
