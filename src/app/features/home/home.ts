import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { JobSearch } from '../jobs/job-search/job-search';
import { JobFilter } from '../jobs/job-filter/job-filter';
import { JobList } from '../jobs/job-list/job-list';
import { JobDetail } from '../jobs/job-detail/job-detail';
import { NotificationService } from '../../core/service/notification.service';
import { NotificationToast } from '../../shared/components/notification-toast/notification-toast';

@Component({
  selector: 'app-home',
  imports: [ JobSearch, JobFilter, JobList, JobDetail, NotificationToast],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit {
  @ViewChild('toast') toast!: NotificationToast;

  constructor(private notificationService: NotificationService) {}

  ngAfterViewInit() {
    this.notificationService.jobAdded$.subscribe(job => {
      this.toast.show(job);
    });
  }
}
