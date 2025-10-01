import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AlarmCodeService} from '../services/Alarm/alarm-code.service';
import {ResourceService} from '../services/Resource/resource.service';

@Injectable()
export class AlarmCodeListResolver implements Resolve<any> {

  constructor(private alarmCodeService: AlarmCodeService, private resourceService: ResourceService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return Promise.all([
      this.alarmCodeService.getAlarmPage(),
      this.resourceService.getAllResources()
    ]);
  }
}
