import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {BadgeService} from '../services/Badge/badge.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AvailableBadgesResolver implements Resolve<any> {

  constructor(private badgeService: BadgeService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.badgeService.getAvailableNumbers();
  }
}
