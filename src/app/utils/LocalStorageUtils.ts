import {Injectable} from '@angular/core';

@Injectable()
export class LocalStorageUtils {
  // 4 hours - In milliseconds
  private static readonly defaultTimeToLive = 60 * 60 * 1000 * 4;

  constructor() {
  }

  /**
   * Store an item in the local storage
   * @param key string
   * @param value object to store
   * @param timeToLive in milliseconds before expiration
   */
  static setWithExpiry(key: string, value: any, timeToLive = LocalStorageUtils.defaultTimeToLive) {
    const now = new Date();
    const item = {
      value,
      expiry: now.getTime() + timeToLive
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  /**
   * Get an item stored in local storage
   * @param key string
   */
  static getWithExpiry(key: string) {
    const itemStr = localStorage.getItem(key);
    // if the item doesn't exist, return null
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    // compare the expiry time of the item with the current time
    if (!item.expiry || now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  }
}
