import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  error: HttpErrorResponse = null;

  constructor(private router: Router) {
  }

  /**
   * Handle the error and redirect to error page
   * @param error error to handle
   */
  handleErrorAndNavigateToErrorPage(error: HttpErrorResponse): void {
    this.setError(error);
    this.router.navigate(['error']);
  }

  /**
   * Sets the error member to the inputEmployeeList error
   */
  setError(error: HttpErrorResponse): void {
    this.error = error;
  }

  /**
   * Get the error
   * @returns Error
   */
  public getError(): Error {
    return this.error;
  }
}
