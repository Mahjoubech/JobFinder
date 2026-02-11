import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {v4 as uuidv4} from 'uuid';
import {map, mergeMap, Observable, of, throwError} from 'rxjs';

export interface User{
  id: string,
  firstName:string,
  lastName:string,
  email:string,
  password:string
}
@Injectable({
  providedIn: 'root',
})
export class Auth {
 private API_URL = "http://localhost:3000/users"
  private currentUser: User | null = null ;
  constructor(private http : HttpClient) {}

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
            this.currentUser = user;
            // SECURITY: Do not store password in local storage
            const { password, ...userWithoutPassword } = user;
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
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
        this.currentUser = user;
        // SECURITY: Do not store password in local storage
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return user;
      })
    );
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;

    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }
  logout() {
    this.currentUser = null;
    localStorage.removeItem('user');
  }
  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
  updateProfile(id: string, data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.API_URL}/${id}`, data).pipe(
      map(updatedUser => {
        this.currentUser = updatedUser;
        const { password, ...userWithoutPassword } = updatedUser;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return updatedUser;
      })
    );
  }}
