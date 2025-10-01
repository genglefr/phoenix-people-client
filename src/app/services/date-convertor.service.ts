import {Injectable} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Moment} from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateConvertorService {

  constructor() {
  }

  /**
   * Convert a Ngb Date Struct in  a string in format DD/MM/YYYY
   * @param date to convert
   */
  static convertDateToString(date: NgbDateStruct): string {
    if (!date) {
      return '';
    }
    if (!date.day || !date.month || !date.year) {
      return `${date}`;
    }
    return `${date.day < 10 ? '0' + date.day : date.day}/${date.month < 10 ? '0' + date.month : date.month}/${date.year}`;
  }

  /**
   * Convert a string in format DD/MM/YYYY in a Ngb Date Struct
   * @param date to convert
   */
  static getNgbDateStructFromString(date: string): NgbDateStruct {
    const dateArray = date.split('/');
    return {day: parseInt(dateArray[0], 10), month: parseInt(dateArray[1], 10), year: parseInt(dateArray[2], 10)};
  }

  /**
   * Convert a Moment date to a string date in format DD/MM/YYYY
   * @param date to convert
   */
  static convertMomentToString(date: Moment): string {
    return `${date.date() < 10 ? '0' + date.date() : date.date()}`
      + `/${(date.month() + 1) < 10 ? '0' + (date.month() + 1) : (date.month() + 1)}/${date.year()}`;
  }
}
