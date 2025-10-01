import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ErrorService} from './services/Error/error.service';
import {debounceTime, distinctUntilChanged, finalize, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {NotificationService} from './services/notification.service';
import {LoadingService} from './services/loading.service';
import {environment} from '../environments/environment';

@Injectable()
export class RequestInterceptorService implements HttpInterceptor {

  excludedUrls: string[] = [
    '/holaris/cache',
    '/timesheet/cache'
  ];
  constructor(private errorService: ErrorService,
              private router: Router,
              private notificationService: NotificationService,
              private loadingService: LoadingService) {
  }

  /**
   * Intercept http requests and handle them
   * @param request request intercepted
   * @param next http handler
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (!this.excludedUrls.some(url => request.url.includes(url))) {
      return next.handle(request).pipe(
        debounceTime(environment.spinnerDelay),
        distinctUntilChanged(),
        tap((data) => {
            // @ts-ignore
            if (!(data.url && this.excludedUrls.some(url => request.url.includes(url)))) {
              this.displaySpinner();
            }
          },
          error => {
            this.handleError(error);
          }
        ), finalize(() => {
            if (!this.loadingService.getRouteChanging()) {
              this.loadingService.hide();
            }
          }
        ));
    } else {
      return next.handle(request);
    }
  }

  /**
   * Handle the error depending of it status
   * @param error to handle
   */
  handleError(error: HttpErrorResponse) {
    switch (error.status) {
      case 403 : {
        const errorMessage = new HttpErrorResponse({
          error: new Error('  You do not have access to this page.'),
          status: 403,
          statusText: '403 : Forbidden access'
        });
        this.errorService.setError(errorMessage);
        this.router.navigate(['error']);
        break;
      }
      case 404 : {
        const errorMessage = new HttpErrorResponse({
          error: new Error('  The page you looking for don\'t exist.'),
          status: 403,
          statusText: '404 : Page not found'
        });
        this.errorService.setError(errorMessage);
        this.router.navigate(['error']);
        break;
      }
      case 406 :
        // error message will be displayed in modal
        // this.notificationService.addWarningToast(error.error.message);
        break;
      case 500 :
        this.notificationService.addErrorToast(error.error.error);
        break;
      default :
        if (error.error && !error.error.message) {
          const reader = new FileReader();
          const myFunction = function() {
            this.notificationService.addErrorToast(JSON.parse(reader.result as string).message);
          };
          reader.onload = myFunction.bind(this);
          reader.readAsText(error.error as Blob);
        } else {
          this.notificationService.addErrorToast(error.error.message);
        }
    }
  }
  /**
   * Display a spinner
   */
  displaySpinner() {
    if (!this.loadingService.getRouteChanging()) {
      this.loadingService.display();
    }
  }

}
