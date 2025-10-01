import {Injectable} from '@angular/core';
import {EmployeeDto, ResourceFullNameAndAccountDto} from '../model';

declare const accentFold: any;


@Injectable()
export class FilterUtils {
  constructor() { }

  /**
   * Is term machting employee
   * @param employee employee
   * @param term term
   */
  public static isMatchingWithFirstNameLastNameOrAccount(employee: ResourceFullNameAndAccountDto, term: string) {
    const lastName = accentFold(employee.lastName);
    const firstName = accentFold(employee.firstName);
    const account = accentFold(employee.account);
    const searchValue = accentFold(term);
    return (`${lastName} ${firstName} (${account})`).includes(searchValue)
      || (`${firstName} ${lastName} (${account})`).includes(searchValue);
  }

  /**
   * Is term machting employee
   * @param employee employee
   * @param term term
   */
  public static isMatchingWithFirstNameLastName(employee: ResourceFullNameAndAccountDto, term: string) {
    const lastName = accentFold(employee.lastName);
    const firstName = accentFold(employee.firstName);
    const searchValue = accentFold(term);
    return (`${lastName} ${firstName}`)
        .includes(searchValue)
      ||  (`${firstName} ${lastName}`)
        .includes(searchValue);
  }
}
