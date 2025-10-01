import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {StartPageGuard} from './StartPageGuard';

@Injectable()
export class AvoidRedirectGuard implements CanActivate {

  constructor(private startPageGuard: StartPageGuard) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.startPageGuard.setRoutingDone(true);
    return true;
  }
}
