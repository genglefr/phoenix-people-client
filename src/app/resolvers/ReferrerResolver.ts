import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ReferrersService} from '../services/Referrer/referrers.service';

@Injectable()
export class ReferrerResolver implements Resolve<any> {

  constructor(private referrersService: ReferrersService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.referrersService.getReferrers();
  }

}
