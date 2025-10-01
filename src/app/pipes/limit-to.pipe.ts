import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'limitTo',
  pure: false
})
export class LimitToPipe implements PipeTransform {

  transform(value: any, args?: number): any {
    const limit = args ? args : 20;
    const trail = '...';

    if (value) {
      return value.length > limit ? value.substring(0, limit) + trail : value;
    }
    return value;
  }
}
