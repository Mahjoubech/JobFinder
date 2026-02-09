import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {v4 as uuidv4} from 'uuid';
import {map, mergeMap, Observable, of} from 'rxjs';

export interface User{
  id: String,
  firstName:String,
  lastName:String,
  email:String,
  password:String
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
            localStorage.setItem('user' , JSON.stringify((user)))
            return user;
          })
        )

      })
    )
  }

}
