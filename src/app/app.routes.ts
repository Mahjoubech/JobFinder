import { Routes } from '@angular/router';
import {AuthGuard} from './core/guards/auth-guard';
import {Home} from './features/home/home';
import { NotFound } from './features/not-found';

export const routes: Routes = [
  {
    path : "register", 
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
  },
  {
    path: "", 
    component: Home
  },
  {
    path:'login', 
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path:'profile', 
    loadComponent: () => import('./features/auth/profile/profile').then(m => m.Profile),
    canActivate: [AuthGuard] 
  },
  {path: 'my-jobs', redirectTo: 'my-jobs/saved', pathMatch: 'full'},
  {
    path: 'my-jobs/:tab', 
    loadComponent: () => import('./features/my-jobs/my-jobs').then(m => m.MyJobs),
    canActivate: [AuthGuard]
  },
  {path: 'favorites', redirectTo: 'my-jobs/saved', pathMatch: 'full'},
  {path: 'applications', redirectTo: 'my-jobs/applied', pathMatch: 'full'},
  {
    path: 'jobs/:id/apply', 
    loadComponent: () => import('./features/jobs/job-apply/job-apply').then(m => m.JobApply),
    canActivate: [AuthGuard]
  },
  {path: '**', component: NotFound}
];
