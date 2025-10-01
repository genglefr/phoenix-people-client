import { Injectable } from '@angular/core';
import {ApiInformation} from "../utils/ApiInformation";
import {HttpClient} from "@angular/common/http";
import {Observable, of, Subject} from "rxjs";
import {map} from "rxjs/operators";
import {HttpParams} from "@angular/common/http/src/params";
import {HttpHeaders} from "@angular/common/http/src/headers";
import {HttpOptions} from "../../environments/config";

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = {};

  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * Save the given value into the cache
   * @param url key of the saved value
   * @param value value to save
   */
  save<T>(url: string, value: T): T {
    this.cache[url] = value;
    return value;
  }

  /**
   * Load the value with the given url as key in the cache
   * @param url key
   */
  load(url: string): any {
    return this.cache[url];
  }

  /**
   * Load the value with the given url as key in the cache as a promise
   * @param url key
   */
  loadAsPromise<T>(url: string): Promise<T> {
    return Promise.resolve(this.cache[url]);
  }

  /**
   * Load the value with the given url as key in the cache as an observable
   * @param url key
   */
  loadAsObservable<T>(url: string): Observable<T> {
    return of(this.cache[url]);
  }

  /**
   * Check if a value exist with the given url as key
   * @param url key
   */
  exist(url: string): boolean{
    return this.cache[url] != null;
  }

  /**
   * Check if a value exist with the given url as key in the cache, if it exists, return it as Observable.
   * Otherwise, call the server to get the value
   * @param url key
   * @param options option of the request
   */
  get<T>(url, options?: HttpOptions): Observable<T>{
    if(this.exist(url)) {
      return this.loadAsObservable<T>(url);
    } else {
      return this.httpClient.get<T>(url, options)
        .pipe(
          map(val => this.save(url, val))
        );
    }
  }

  /**
   * Check if a value exist with the given url as key in the cache, if it exists, return it as Observable.
   * Otherwise, call the server to get the value
   * @param url key
   * @param body body of the request
   * @param options option of the request
   */
  post<T>(url, body: any = {},options?: HttpOptions): Observable<T>{
    if(this.exist(url)) {
      return this.loadAsObservable<T>(url);
    } else {
      return this.httpClient.post<T>(url, body, options)
        .pipe(
          map(val => this.save(url, val))
        );
    }
  }
}
