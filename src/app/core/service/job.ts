import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, finalize, map, Observable} from 'rxjs';
import {Job} from '../models/Job';
export type {Job};

@Injectable({
  providedIn: 'root',
})
export class JobService  {
  private API_URL = '/themuse-api/api/public/jobs';
  private jobSubject = new BehaviorSubject<Job[]>([])
  jobs$= this.jobSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  private searchKeywordSubject = new BehaviorSubject<string>('');
  searchKeyword$ = this.searchKeywordSubject.asObservable();
  private selectedJobSubject = new BehaviorSubject<Job | null>(null)
  selectedJob$ = this.selectedJobSubject.asObservable();
  private favoritesSubject = new BehaviorSubject<Job[]>([]);
  favorites$ = this.favoritesSubject.asObservable();
  
  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      this.favoritesSubject.next(JSON.parse(stored));
    }
  }

  private originalJobs: Job[] = [];

  getJobs(page: number = 0, limit: number = 20): Observable<Job[]> {
    const url = `${this.API_URL}?page=${page}&items_per_page=${limit}&descending=true`;
    return this.http.get<any>(url).pipe(
      map(res => {
        const jobs = res.results.slice(0, limit);
        this.originalJobs = jobs; // Store original fetch
        return jobs;
      })
    );
  }
  getJobById(id: number | string): Observable<Job> {
      return this.http.get<Job>(`${this.API_URL}/${id}`);
  }
  setSelectedJob(job : Job | null){
    this.selectedJobSubject.next(job);
  }

  toggleFavorite(job: Job) {
    const current = this.favoritesSubject.value;
    const index = current.findIndex(j => j.id === job.id);
    let updated: Job[] = [];
    if (index > -1) {
      updated = current.filter(j => j.id !== job.id);
    } else {
      updated = [...current, job];
    }
    this.favoritesSubject.next(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  }

  isJobFavorite(jobId: number): boolean {
    return this.favoritesSubject.value.some(j => j.id === jobId);
  }

  filterJobs(criteria: { date?: string, level?: string, company?: string, remote?: boolean, easyApply?: boolean }): void {
    let filtered = [...this.originalJobs];

    if (criteria.company) {
      filtered = filtered.filter(job => job.company.name === criteria.company);
    }

    if (criteria.level) {
      filtered = filtered.filter(job => job.levels.some(l => l.name === criteria.level));
    }

    if (criteria.remote) {
      filtered = filtered.filter(job => job.locations.some(l => l.name.toLowerCase().includes('remote')));
    }

    if (criteria.date) {
      const now = new Date().getTime();
      let cutoffTime = 0;

      switch (criteria.date) {
        case '24h':
          cutoffTime = now - 24 * 60 * 60 * 1000;
          break;
        case '7d':
          cutoffTime = now - 7 * 24 * 60 * 60 * 1000;
          break;
        case '30d':
          cutoffTime = now - 30 * 24 * 60 * 60 * 1000;
          break;
        default:
          cutoffTime = 0;
      }

      if (cutoffTime > 0) {
        filtered = filtered.filter((job) => {
          const pubDate = new Date(job.publication_date).getTime();
          return pubDate >= cutoffTime;
        });
      }
    }

    this.jobSubject.next(filtered);
  }

  getUniqueCompanies(): string[] {
    return [...new Set(this.originalJobs.map(job => job.company.name))].sort();
  }

  getUniqueLevels(): string[] {
    const levels = this.originalJobs.flatMap(job => job.levels.map(l => l.name));
    return [...new Set(levels)].sort();
  }

  search(keyword: string, location: string = '', page: number = 0): void {
    this.loadingSubject.next(true);
    let url = `${this.API_URL}?page=${page}&descending=true`;
    if (location) {
      url += `&location=${encodeURIComponent(location)}`;
    }
    this.http.get<any>(url).pipe(
      map(res => {
        let result = res.results;
        if (keyword) {
          const lowerKey = keyword.toLowerCase();
          result = result.filter((job: Job) =>
            job.name.toLowerCase().includes(lowerKey) ||
            job.company?.name.toLowerCase().includes(lowerKey)
          );
        }
        const finalJobs = result.slice(0, 20); // Limit results
        this.originalJobs = finalJobs; // Store for filtering
        return finalJobs;
      }),
      finalize(() => { this.loadingSubject.next(false); })
    ).subscribe(jobs => {
        this.jobSubject.next(jobs);
    });
  }

  resetSearch(): void {
    this.loadingSubject.next(true);
    const randomPage = Math.floor(Math.random() * 10);
    const url = `${this.API_URL}?page=${randomPage}&items_per_page=20&descending=true`;
    this.http.get<any>(url).pipe(
       map(res => {
           const jobs = res.results.slice(0, 20);
           this.originalJobs = jobs; // Store for filtering
           return jobs;
       }),
       finalize(() => { this.loadingSubject.next(false); })
    ).subscribe(jobs => {
       this.jobSubject.next(jobs);
    });
  }


}
