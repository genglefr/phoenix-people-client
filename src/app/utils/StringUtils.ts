import {Injectable} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class StringUtils {
  constructor() {
  }

  /**
   * Trim the value if the value exists.
   * @param value to trim.
   */
  static trimValueIfExist(value: string): string {
    if (value) {
      return value.trim();
    }
    return value;
  }

  /**
   * Format the NgbDateStruct from ngb datepicker to 'dd-mm-yyyy' format
   * @param date to format
   */
  static formatHyphen(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }

  /**
   * Remove tags from the given string
   * @param str
   */
  static sanitize(str) {
    if(!str) {
      return '';
    }
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
  }

  /**
   * Checks if the input is blank (null, undefined, or an empty string)
   * @param input the input to check.
   */
  static isBlank(input: any): boolean {
    return input === null || input === undefined || (typeof input === 'string' && input.trim() === '');
  }

  /**
   * Check if the input is not blank.
   * @param input the input to check.
   */
  static isNotBlank(input: any): boolean {
    return !this.isBlank(input);
  }
}
