import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Job } from '../../core/models/job';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

export const jobResolver: ResolveFn<Job | null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const jobId = route.paramMap.get('id');
  const http = inject(HttpClient);
  const API_URL = '/themuse-api/api/public/jobs';

  if (!jobId) {
    return of(null);
  }

  return http.get<Job>(`${API_URL}/${jobId}`).pipe(
    catchError(error => {
      console.error('JobResolver: Failed to fetch job', error);
      return of(null);
    })
  );
};
