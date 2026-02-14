import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {v4 as uuidv4} from 'uuid';
import {BehaviorSubject, map, mergeMap, Observable, of, throwError} from 'rxjs';
import {User} from '../models/user';


@Injectable({
  providedIn: 'root',
})
export class Auth {
  private API_URL = "http://localhost:3000/users"
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http : HttpClient) {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
    }
  }

  register(firstName: string, lastName: string, email: string, password: string): Observable<User> {
    return this.http.get<User[]>(`${this.API_URL}?email=${email}`).pipe(
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
    return this.http.get<User[]>(`${this.API_URL}?email=${email}`).pipe(
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
    return this.http.patch<User>(`${this.API_URL}/${id}`, data).pipe(
      map(updatedUser => {
        this.setCurrentUser(updatedUser);
        return updatedUser;
      })
    );
  }

  private setCurrentUser(user: User) {
    this.currentUserSubject.next(user);
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  }
}
