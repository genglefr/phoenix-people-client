import {Pipe, PipeTransform} from '@angular/core';
import {DecimalPipe} from '@angular/common';

@Pipe({
  name: 'currencyFormatter'
})
export class CurrencyFormatterPipe extends DecimalPipe implements PipeTransform {
  transform(value: number): any {
    const decimalNumber = super.transform(value, '.2-2');
    return `${decimalNumber} €`;
  }

}
