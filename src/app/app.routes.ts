import { Routes } from '@angular/router';
import {Register} from './features/auth/register/register';
import {JobList} from './features/jobs/job-list/job-list';
import {Login} from './features/auth/login/login';
import {Profile} from './features/auth/profile/profile';
import {AuthGuard} from './core/guards/auth-guard';
import {Home} from './features/home/home';
import {ApplicationsList} from './features/applications/applications-list/applications-list';
import {MyJobs} from './features/my-jobs/my-jobs';

import {JobApply} from './features/jobs/job-apply/job-apply';

export const routes: Routes = [
  {path : "register" , component: Register},
  {path: "" , component: Home},
  {path:'login' , component: Login},
  {path:'profile' , component:Profile, canActivate: [AuthGuard] },
  {path: 'my-jobs', redirectTo: 'my-jobs/saved', pathMatch: 'full'},
  {path: 'my-jobs/:tab', component: MyJobs, canActivate: [AuthGuard]},
  {path: 'favorites', redirectTo: 'my-jobs/saved', pathMatch: 'full'},
  {path: 'applications', redirectTo: 'my-jobs/applied', pathMatch: 'full'},
  {path: 'jobs/:id/apply', component: JobApply, canActivate: [AuthGuard]}
];
