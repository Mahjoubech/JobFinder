import {Injectable, signal} from '@angular/core';
import {catchError, interval, of, retry, share, Subject, switchMap} from 'rxjs';
import {Job} from '../models/job';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NotificationServiceTs {
  private apiUrl = '/themuse-api/api/public/jobs';
  notifications = signal<Notification[]>([]);
  unreadCount = signal<number>(0);
  private jobAddedSubject = new Subject<Job>();
  public jobAdded$ = this.jobAddedSubject.asObservable();
  private lastJobId: string | number | null = null;
  private isFirstLoad = true;

  constructor(private http: HttpClient) {
    this.startPulling();
  }

  private startPulling() {
    console.log("NotificationService: Starting Proxy Polling...");
    interval(60000).pipe(
      switchMap(() => this.http.get<any>(`${this.apiUrl}?page=1&descending=true`)),
      retry(2),
      share(),
      catchError(err => {
        console.error('Polling Error:', err);
        return of(null);
      })
    ).subscribe((res) => {
      if (res && res.results && res.results.length > 0) {
        const latestJobData = res.results[0];
        const normalizedJob = this.mapToJob(latestJobData);
        this.checkForNewJob(normalizedJob);
      }
    });
  }
  private checkForNewJob(latestJob: Job) {
    if (this.isFirstLoad) {
      this.lastJobId = latestJob.id;
      this.isFirstLoad = false;
      console.log('NotificationService: Initial job ID set to', this.lastJobId);
      return;
    }
    if (this.lastJobId !== null && latestJob.id !== this.lastJobId) {
      console.log('NotificationService: New Job Detected!', latestJob);
      this.lastJobId = latestJob.id;
      this.jobAddedSubject.next(latestJob);
    }
  }

  private mapToJob(apiJob: any): Job {
    return {
      id: apiJob.id,
      name: apiJob.name, // 'name' in your interface
      type: apiJob.type,
      publication_date: apiJob.publication_date,
      short_name: apiJob.short_name,
      model_type: apiJob.model_type,
      contents: apiJob.contents,
      locations: apiJob.locations || [],
      categories: apiJob.categories || [],
      levels: apiJob.levels || [],
      tags: apiJob.tags || [],
      refs: apiJob.refs || {},
      company: {
        id: apiJob.company?.id ?? 0,
        short_name: apiJob.company?.short_name ?? 'unknown',
        name: apiJob.company?.name ?? 'Unknown Company'
      }
    };
  }

}
