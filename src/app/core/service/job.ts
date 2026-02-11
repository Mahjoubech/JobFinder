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
  private API_URL = '/themuse-api/api/public/jobs?page=0&descending=true';
  constructor(private http: HttpClient) {}
  getJobs(page:number = 0 , limit:number): Observable<Job[]> {
    const url = `/themuse-api/api/public/jobs?page=${page}&items_per_page=${limit}&descending=true`;
    return this.http.get<any>(url).pipe(
      map(res => res.results.slice(0 , limit))
    );
  }}
