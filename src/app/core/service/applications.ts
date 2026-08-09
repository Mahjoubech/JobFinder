import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Application } from '../models/applicationInterface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private http = inject(HttpClient);

  private API_URL = 'http://localhost:3000/applications';

  getUserApplications(userId: string): Observable<Application[]> {
    if (environment.useLocalStorage) {
      const applications = this.getStoredApplications();

      return of(
        applications.filter(
          application => application.userId === userId
        )
      );
    }

    return this.http.get<Application[]>(
      `${this.API_URL}?userId=${userId}`
    );
  }

  addApplication(application: Application): Observable<Application> {
    if (environment.useLocalStorage) {
      const applications = this.getStoredApplications();

      const newApplication: Application = {
        ...application,
        id: crypto.randomUUID(),
      };

      applications.push(newApplication);

      localStorage.setItem(
        'applications',
        JSON.stringify(applications)
      );

      return of(newApplication);
    }

    return this.http.post<Application>(
      this.API_URL,
      application
    );
  }

  updateStatus(
    id: string | number,
    status: 'en_attente' | 'accepted' | 'refused'
  ): Observable<Application> {

    if (environment.useLocalStorage) {
      const applications = this.getStoredApplications();

      const index = applications.findIndex(
        application => application.id === id
      );

      if (index === -1) {
        return throwError(
          () => new Error('Application not found')
        );
      }

      applications[index] = {
        ...applications[index],
        status,
      };

      localStorage.setItem(
        'applications',
        JSON.stringify(applications)
      );

      return of(applications[index]);
    }

    return this.http.patch<Application>(
      `${this.API_URL}/${id}`,
      { status }
    );
  }

  updateNotes(
    id: string | number,
    notes: string
  ): Observable<Application> {

    if (environment.useLocalStorage) {
      const applications = this.getStoredApplications();

      const index = applications.findIndex(
        application => application.id === id
      );

      if (index === -1) {
        return throwError(
          () => new Error('Application not found')
        );
      }

      applications[index] = {
        ...applications[index],
        notes,
      };

      localStorage.setItem(
        'applications',
        JSON.stringify(applications)
      );

      return of(applications[index]);
    }

    return this.http.patch<Application>(
      `${this.API_URL}/${id}`,
      { notes }
    );
  }

  deleteApplication(
    id: string | number
  ): Observable<void> {

    if (environment.useLocalStorage) {
      const applications = this.getStoredApplications();

      const updatedApplications = applications.filter(
        application => application.id !== id
      );

      localStorage.setItem(
        'applications',
        JSON.stringify(updatedApplications)
      );

      return of(void 0);
    }

    return this.http.delete<void>(
      `${this.API_URL}/${id}`
    );
  }

  isJobTracked(
    offerId: string,
    userId: string
  ): Observable<Application[]> {

    if (environment.useLocalStorage) {
      const applications = this.getStoredApplications();

      return of(
        applications.filter(
          application =>
            application.offerId === offerId &&
            application.userId === userId
        )
      );
    }

    return this.http.get<Application[]>(
      `${this.API_URL}?offerId=${offerId}&userId=${userId}`
    );
  }

  private getStoredApplications(): Application[] {
    const stored = localStorage.getItem('applications');

    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
}