import {ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot} from '@angular/router';
import {inject} from '@angular/core';
import {Auth} from '../service/auth';

export class Admin implements CanActivate {
  private  auth = inject(Auth);
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    if(this.auth.getCurrentUser()?.role === 'admin') {
      return  true;
    }
    return false;
  }

}
