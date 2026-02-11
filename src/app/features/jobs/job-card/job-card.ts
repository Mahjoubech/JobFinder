import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Job} from '../../../core/service/job';

@Component({
  selector: 'app-job-card',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './job-card.html',
  styleUrl: './job-card.css',
})
export class JobCard {
 @Input() job!: Job;
}
