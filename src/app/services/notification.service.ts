import {Injectable} from '@angular/core';
import {ToastyConfig, ToastyService} from 'ng2-toasty';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastyService: ToastyService, private toastyConfig: ToastyConfig) {
    this.toastyConfig.limit = 10;
  }

  /**
   * Add a toast with an error message
   * @param errorMessage to display
   */
  addErrorToast(errorMessage: string) {

    const subErrors = errorMessage.split('\n');
    subErrors.forEach(subE => this.toastyService.error({
      title: 'Error',
      msg: subE,
      showClose: true,
      timeout: 10000,
      theme: 'bootstrap'
    }));
  }

  /**
   * Add a toast with a success message
   * @param successMessage to display
   */
  addSuccessToast(successMessage: string) {
    this.toastyService.success({
      title: 'Success',
      msg: successMessage,
      showClose: true,
      timeout: 5000,
      theme: 'bootstrap'
    });
  }

  /**
   * Add a toast with a warning message
   * @param warningMessage to display
   */
  addWarningToast(warningMessage: string) {
    this.toastyService.warning({
      title: 'Warning',
      msg: warningMessage,
      showClose: true,
      timeout: 5000,
      theme: 'bootstrap'
    });
  }

  /**
   * Add success toast with the given then return the given value
   * @param val value to return
   * @param message to show
   */
  success<T>(val: T, message: string): T {
    this.addSuccessToast(message);
    return val;
  }
}
