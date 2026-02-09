import { Routes } from '@angular/router';
import {Register} from './features/auth/register/register';
import {JobList} from './features/jobs/job-list/job-list';
import {Login} from './features/auth/login/login';
import {Profile} from './features/auth/profile/profile';
import {AuthGuard} from './core/guards/auth-guard';

export const routes: Routes = [
  {path : "register" , component: Register},
  {path: "dashboard" , component: JobList},
  {path:'login' , component: Login},
  {path:'profile' , component:Profile , canActivate:[AuthGuard]}
];
