import {Pipe, PipeTransform} from '@angular/core';
import {FilterDto} from '../utils/filter';

declare const accentFold: any;

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform<T>(items: T[], filterToApplyList: FilterDto[]): T[] {
    let itemsFiltered = items ? Array.from(items) : [];
    filterToApplyList.forEach(
      filterToApply => itemsFiltered =
        itemsFiltered.filter(elt =>
          `${accentFold(this.getPropertyValue(filterToApply.column, elt) ? this.getPropertyValue(filterToApply.column, elt).toString() : '')}`.includes(`${accentFold(filterToApply.value)}`)
        )
    );
    return itemsFiltered;
  }

  /**
   * Get property value split by .
   * @param filterToApply filter
   * @param itemToCheck item to get property from
   */
  getPropertyValue(filterToApply: string, itemToCheck) {
    const filterToApplySplit = filterToApply.split('.');
    let propertyValue = itemToCheck;
    filterToApplySplit.forEach(
      filterProperty => {
        if(propertyValue[filterProperty]) {
          propertyValue = propertyValue[filterProperty];
        }
      }
    );
    return propertyValue;
  }
}
