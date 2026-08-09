import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import {
  BehaviorSubject,
  map,
  mergeMap,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private API_URL = 'http://localhost:3000/users';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('user');

    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
    }
  }

  register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Observable<User> {

    // =========================
    // VERCEL / DEMO
    // =========================
    if (environment.useLocalStorage) {
      const users = this.getStoredUsers();

      const exists = users.some(
        user => user.email.toLowerCase() === email.toLowerCase()
      );

      if (exists) {
        return throwError(() => new Error('Email already exists'));
      }

      const newUser: User = {
        id: uuidv4(),
        firstName,
        lastName,
        email,
        password,
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      this.setCurrentUser(newUser);

      return of(newUser);
    }

    // =========================
    // LOCAL / JSON SERVER
    // =========================
    return this.http
      .get<User[]>(`${this.API_URL}?email=${email}`)
      .pipe(
        mergeMap(users => {
          if (users.length > 0) {
            return throwError(() => new Error('Email already exists'));
          }

          const newUser: User = {
            id: uuidv4(),
            firstName,
            lastName,
            email,
            password,
          };

          return this.http.post<User>(this.API_URL, newUser).pipe(
            map(user => {
              this.setCurrentUser(user);
              return user;
            })
          );
        })
      );
  }

  login(email: string, password: string): Observable<User> {

    // =========================
    // VERCEL / DEMO
    // =========================
    if (environment.useLocalStorage) {
      const users = this.getStoredUsers();

      const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        return throwError(() => new Error('User not found'));
      }

      if (user.password !== password) {
        return throwError(() => new Error('Incorrect password'));
      }

      this.setCurrentUser(user);

      return of(user);
    }

    // =========================
    // LOCAL / JSON SERVER
    // =========================
    return this.http
      .get<User[]>(`${this.API_URL}?email=${email}`)
      .pipe(
        map(users => {
          const user = users[0];

          if (!user) {
            throw new Error('User not found');
          }

          if (user.password !== password) {
            throw new Error('Incorrect password');
          }

          this.setCurrentUser(user);

          return user;
        })
      );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  logout() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  updateProfile(id: string, data: Partial<User>): Observable<User> {

    // =========================
    // VERCEL / DEMO
    // =========================
    if (environment.useLocalStorage) {
      const users = this.getStoredUsers();

      const index = users.findIndex(user => user.id === id);

      if (index === -1) {
        return throwError(() => new Error('User not found'));
      }

      const updatedUser = {
        ...users[index],
        ...data,
      };

      users[index] = updatedUser;

      localStorage.setItem('users', JSON.stringify(users));

      this.setCurrentUser(updatedUser);

      return of(updatedUser);
    }

    // =========================
    // LOCAL / JSON SERVER
    // =========================
    return this.http
      .patch<User>(`${this.API_URL}/${id}`, data)
      .pipe(
        map(updatedUser => {
          this.setCurrentUser(updatedUser);
          return updatedUser;
        })
      );
  }

  deleteAccount(id: string): Observable<void> {

    // =========================
    // VERCEL / DEMO
    // =========================
    if (environment.useLocalStorage) {
      const users = this.getStoredUsers();

      const filteredUsers = users.filter(user => user.id !== id);

      localStorage.setItem('users', JSON.stringify(filteredUsers));

      this.logout();

      return of(void 0);
    }

    // =========================
    // LOCAL / JSON SERVER
    // =========================
    return this.http
      .delete<void>(`${this.API_URL}/${id}`)
      .pipe(
        map(() => {
          this.logout();
        })
      );
  }

  private setCurrentUser(user: User) {
    this.currentUserSubject.next(user);

    const { password, ...userWithoutPassword } = user;

    localStorage.setItem(
      'user',
      JSON.stringify(userWithoutPassword)
    );
  }

  private getStoredUsers(): User[] {
    const stored = localStorage.getItem('users');

    if (!stored) {
      return [];
    }

    return JSON.parse(stored);
  }
}