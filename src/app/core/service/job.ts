import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
export interface Job{
  id:number;
  name: string;
  company : {
    name:string;
    id:number;
  }
  locations: {name: string}[];
  levels: {name:string}[];
  publication_date:string;
}
@Injectable({
  providedIn: 'root',
})
export class JobService  {
  private API_URL = 'https://www.themuse.com/api/public/jobs?page=0&descending=true';
  constructor(private http: HttpClient) {}
  getJobs(): Observable<Job[]>{
    return this.http.get<any>(this.API_URL).pipe(
      map(res => res.results)
    )
  }
}
