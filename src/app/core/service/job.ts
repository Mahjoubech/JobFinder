import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, finalize, map, Observable} from 'rxjs';
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
  private API_URL = '/themuse-api/api/public/jobs';
  private jobSubject = new BehaviorSubject<Job[]>([])
  jobs$= this.jobSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  constructor(private http: HttpClient) {}
  getJobs(page:number = 0 , limit:number = 20): Observable<Job[]> {
    const url = `${this.API_URL}?page=${page}&items_per_page=${limit}&descending=true`;
    return this.http.get<any>(url).pipe(
      map(res => res.results.slice(0 , limit))
    );
  }
  srearch(keyword : string , location : string , page : number = 0) : void{
      this.loadingSubject.next(true);
    let url = `${this.API_URL}?page=${page}&descending=true`;
    if(location){
      url += `&location=${encodeURIComponent(location)}`;
    }

    this.http.get<any>(url).pipe(
      map(res =>{
        let result = res.results;
        if (keyword){
          const lowerKey = keyword.toLowerCase();
          result = result.filter((job : Job) => {
            job.name.toLowerCase() === lowerKey
          });
        }
        return result.slice(0 , 8)
      }),
      finalize(()=>{this.loadingSubject.next(false)})
    ).subscribe(jobs => {
      if(page === 0){
        this.jobSubject.next(jobs);
      }else{
        const cuurent = this.jobSubject.value;
        this.jobSubject.next([...cuurent , ...jobs]);
      }
    })
  }

}
