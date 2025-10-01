import {Injectable} from '@angular/core';

@Injectable()
export class SortUtils {
  constructor() { }

  sort(a: string | number, b: string | number) {
    if (a == null) {
      return 1;
    }

    if (b == null) {
      return -1;
    }

    if (typeof a === 'string' && typeof b === 'string') {
      if (a.toLowerCase() > b.toLowerCase()) {
        return 1;
      }

      if (a.toLowerCase() < b.toLowerCase()) {
        return -1;
      }
    } else {
      if (a > b) {
        return 1;
      }

      if (a < b) {
        return -1;
      }
    }

    return 0;
  }
}
