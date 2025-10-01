import {HttpParams} from "@angular/common/http";
import {HttpHeaders} from "@angular/common/http/src/headers";

export enum ECompanyMapping {
  'Phoenix Luxembourg' = 'Phoenix Developments S.A.',
  'Phoenix Belgium' = 'Phoenix Belgium',
  'Phoenix Bulgaria' = 'Blue Developments Ltd',
  'Phoenix Hellas' = 'Phoenix Hellas'
}
export class Pagination {
  public static readonly DEFAULT_PAGINATION_INDEX = 0;
  public static readonly DEFAULT_PAGINATION_SIZE = 25;

  index: number;
  size: number;

  constructor(index: number = Pagination.DEFAULT_PAGINATION_INDEX, size: number = Pagination.DEFAULT_PAGINATION_SIZE) {
    this.index = index;
    this.size = size;
  }

  /**
   * Convert Pagination into HttpParams with properties 'pageIndex' and 'pageSize'
   * Return an HttpParams object
   */
  toParams(): HttpParams {
    const params = new HttpParams()
      .set('pageIndex', String(this.index))
      .set('pageSize', String(this.size));
    return params;
  }
}

export interface HttpOptions {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe?: 'body';
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}
