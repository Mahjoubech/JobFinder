import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application } from '../models/applicationInterface';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:3000/applications';

  getUserApplications(userId: string): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.API_URL}?userId=${userId}`);
  }

  addApplication(application: Application): Observable<Application> {
    return this.http.post<Application>(this.API_URL, application);
  }

  updateStatus(id: string | number, status: 'en_attente' | 'accepted' | 'refused'): Observable<Application> {
    return this.http.patch<Application>(`${this.API_URL}/${id}`, { status });
  }

  updateNotes(id: string | number, notes: string): Observable<Application> {
    return this.http.patch<Application>(`${this.API_URL}/${id}`, { notes });
  }

  deleteApplication(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  isJobTracked(offerId: string, userId: string): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.API_URL}?offerId=${offerId}&userId=${userId}`);
  }
}
