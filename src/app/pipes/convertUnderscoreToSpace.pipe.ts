import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'convertUnderscoreToSpace'
})

export class ConvertUnderscoreToSpacePipe implements PipeTransform {
  transform(underscore: string): string {
    if (underscore != null && underscore.includes('_')) {
      return underscore.split('_').join(' ');
    }
    return underscore;
  }
}
