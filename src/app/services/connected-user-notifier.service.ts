import { Injectable } from '@angular/core';
import {FullResourceDto} from '../model';


@Injectable({
  providedIn: 'root'
})
export class ConnectedUserNotifierService {
  private user: FullResourceDto;


  constructor() {

  }

  /**
   * Stores the user's model
   * @param data user model
   */
  setUser(data: FullResourceDto) {
    this.user = data;
  }

  /**
   * Returns the user's model
   */
  getUser() {
    if (this.user) {
      return this.user;
    }
  }
}

