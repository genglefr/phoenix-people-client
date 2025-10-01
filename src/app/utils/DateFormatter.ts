import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Injectable} from '@angular/core';


@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
  /**
   * Transform a value to a NgbDateStruct
   * @param value to transform
   */
  parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split('/');
      if (dateParts.length === 1 && this.isNumber(dateParts[0])) {
        return {day: this.toInteger(dateParts[0]), month: null, year: null};
      } else if (dateParts.length === 2 && this.isNumber(dateParts[0]) && this.isNumber(dateParts[1])) {
        return {day: this.toInteger(dateParts[0]), month: this.toInteger(dateParts[1]), year: null};
      } else if (dateParts.length === 3 && this.isNumber(dateParts[0]) && this.isNumber(dateParts[1]) && this.isNumber(dateParts[2])) {
        return {
          day: this.toInteger(dateParts[0]),
          month: this.toInteger(dateParts[1]),
          year: this.toInteger(dateParts[2])
        };
      }
    }
    return null;
  }

  /**
   * Format the NgbDateStruct from ngb datepicker to 'dd-mm-yyyy' format
   * @param date to format
   */
  format(date: NgbDateStruct): string {
    return date ?
      `${this.isNumber(date.day) ?
        this.padNumber(date.day) : ''}/${this.isNumber(date.month) ? this.padNumber(date.month) : ''}/${date.year}` :
      '';
  }

  /**
   * Transform a value to an integer
   * @param value to transform
   */
  toInteger(value: any): number {
    return parseInt(`${value}`, 10);
  }

  /**
   * Convert a number to a string with a leading zero.
   * @param value number used in the string
   */
  padNumber(value: number) {
    if (this.isNumber(value)) {
      return `0${value}`.slice(-2);
    } else {
      return '';
    }
  }

  /**
   * Return if a value is a number or not
   * @param value to check
   */
  isNumber(value: any): value is number {
    return !isNaN(this.toInteger(value));
  }

}
