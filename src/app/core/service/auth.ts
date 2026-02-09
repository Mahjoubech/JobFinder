import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {v4 as uuidv4} from 'uuid';
import {map, mergeMap, Observable, of} from 'rxjs';

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
  register(firstName: string, lastName: string, email: string, password: string,confirmPass: string):Observable<User | {error : string}>{
    if(!firstName || !lastName || !email || !password || !confirmPass){
      return of({error : "Some fields are required"});
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
      return  of({error: "invalid email format"})
    }
    if(password.length < 6){
      return of({error: "Password must be at least 6 characters"});
    }
    if(password !== confirmPass){
      return of({error : "Passwords do not match"});
    }
    return this.http.get<User[]>(`${this.API_URL}?email=${email}`).pipe(
      mergeMap(users => {
        if(users.length > 0){
          return of({error : "Email Alredy Exits"});
        }
        const newUser:User = {
          id: uuidv4(),
          firstName,
          lastName,
          email,
          password,
        };
        return this.http.post<User>(this.API_URL , newUser).pipe(
          map(user => {
            this.currentUser = user;
            localStorage.setItem('user' , JSON.stringify((user)))
            return user;
          })
        )

      })
    )
  }
  login(email: string, password: string): Observable<User | { error: string }> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return of({ error: 'Invalid email format' });
    }

    if (password.length < 6) {
      return of({ error: 'Password must be at least 6 characters' });
    }

    return this.http.get<User[]>(`${this.API_URL}?email=${email}`).pipe(

      map(users => {

        const user = users[0];

        if (!user) {
          return { error: 'User not found' };
        }

        if (user.password !== password) {
          return { error: 'Incorrect password' };
        }
       this.currentUser = user;
        localStorage.setItem('user', JSON.stringify(user));

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
}
