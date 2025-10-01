import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {UserService} from '../../services/User/user.service';

declare const isMobile: any;

@Injectable()
export class StartPageGuard implements CanActivate {

  routingDone: boolean;

  constructor(private router: Router, private userService: UserService) {
  }

  /**
   * Redirect a user (at application starting time) of the administration team directly to the resources navigation
   * point.
   * @param next contains information about the activated route
   * @param state the state of the router at a moment in time
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (!this.routingDone) {
      return this.userService.getUserPreferences().then(preference => {
        this.routingDone = true;
        if (!isMobile() && preference.homePagePreferencesDto.url) {
          this.router.navigate([preference.homePagePreferencesDto.url]);
          return false;
        }
        return true;
      }).catch(() => {
        this.routingDone = true;
        return Promise.resolve(true);
      });
    } else {
      return Promise.resolve(true);
    }
  }

  /**
   * Set routing done or not
   * @param done true if the routing is done
   */
  setRoutingDone(done) {
    this.routingDone = done;
  }
}
