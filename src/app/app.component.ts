import {Component} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {LoadingService} from './services/loading.service';
import {ResourceService} from './services/Resource/resource.service';
import {FullResourceDto} from './model';
import {ConnectedUserNotifierService} from './services/connected-user-notifier.service';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'usource';
  showDetailsBtn = false;

  constructor(public router: Router, private loadingService: LoadingService, private resourceService: ResourceService,
              private userNotifier: ConnectedUserNotifierService) {
    resourceService.getConnectedResource().then((data: FullResourceDto) => {
      userNotifier.setUser(data);
    });

    router.events.subscribe((event) => {

      if (event instanceof NavigationStart) {
        this.loadingService.setIsRouteChanging(true);
        this.loadingService.display();
      }

      if (event instanceof NavigationEnd || event instanceof NavigationError) {
        this.loadingService.hide();
        this.loadingService.setIsRouteChanging(false);
      }

      if (event instanceof NavigationCancel) {
        this.loadingService.hide();
      }

      if (event instanceof NavigationEnd) {
        this.showDetailsBtn = environment.myDetailsBtnAllowedUrls.includes(event.url);
      }
    });
  }
}
