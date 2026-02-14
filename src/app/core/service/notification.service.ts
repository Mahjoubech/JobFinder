import { Injectable, signal } from '@angular/core';
import { Subject, interval, switchMap, map, retry, share, catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Job } from '../models/job';

export interface Notification {
  id: string;
  job: Job;
  read: boolean;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Use your PROXY endpoint
  private apiUrl = '/themuse-api/api/public/jobs'; 
  
  // Signals for Reactive UI (Badge & List)
  notifications = signal<Notification[]>([]);
  unreadCount = signal<number>(0);

  private jobAddedSubject = new Subject<Job>();
  public jobAdded$ = this.jobAddedSubject.asObservable();

  // Last Job ID
  private lastJobId: number | null = null;
  private isFirstLoad = true;

  constructor(private http: HttpClient) {
    this.startPolling();
  }

  private startPolling() {
    console.log('NotificationService: Starting Proxy Polling...');

    // Poll every 60 seconds
    interval(60000) 
      .pipe(
        // Fetch page 1, descending order
        switchMap(() => this.http.get<any>(`${this.apiUrl}?page=1&descending=true`)),
        retry(2), 
        share(),
        catchError(err => {
          console.error('Polling Error:', err);
          return of(null); 
        })
      )
      .subscribe((response) => {
        if (response && response.results && response.results.length > 0) {
          const latestJobData = response.results[0];
          // Use the correct mapping function
          const normalizedJob = this.mapToJob(latestJobData);
          this.checkForNewJob(normalizedJob);
        }
      });
  }

  private checkForNewJob(latestJob: Job) {
    if (this.isFirstLoad) {
      this.lastJobId = latestJob.id;
      this.isFirstLoad = false;
      return;
    }

    if (this.lastJobId !== null && latestJob.id !== this.lastJobId) {
      console.log('NotificationService: New Job Detected!', latestJob);
      this.lastJobId = latestJob.id;
      
      // 1. Notify Subscribers (Toast)
      this.jobAddedSubject.next(latestJob);

      // 2. Add to Notification List
      this.addNotification(latestJob);
    }
  }

  private addNotification(job: Job) {
    const newNotification: Notification = {
      id: Date.now().toString(),
      job: job,
      read: false,
      timestamp: new Date()
    };

    // Update signals
    this.notifications.update(list => [newNotification, ...list]);
    this.updateUnreadCount();
  }

  markAsRead() {
    this.notifications.update(list => list.map(n => ({ ...n, read: true })));
    this.updateUnreadCount();
  }

  private updateUnreadCount() {
    const count = this.notifications().filter(n => !n.read).length;
    this.unreadCount.set(count);
  }

  // CORRECTED MAPPING FUNCTION
  private mapToJob(apiJob: any): Job {
    // We construct the object to perfectly match the 'Job' interface
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
