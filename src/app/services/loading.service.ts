import {Injectable} from '@angular/core';
import {isNullOrUndefined} from 'util';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loadingDiv = null;
  layout = null;
  routeChange = false;
  activeElement;

  constructor() {
    this.checkAndSetLoadingDiv();
    this.checkAndSetLayout();
  }

  /**
   * Displays the loading
   */
  display() {
    this.checkAndSetLoadingDiv();
    this.checkAndSetLayout();
    if (!isNullOrUndefined(this.loadingDiv) && !isNullOrUndefined(this.layout)) {
      this.loadingDiv.classList.remove('loading');
      this.loadingDiv.classList.add('loading-shown');
      this.layout.style.pointerEvents = 'none';
      // @ts-ignore
      if (!document.activeElement.innerHTML.includes('app-root')) {
        this.activeElement = document.activeElement;
        this.activeElement.blur();
      }
    }
  }

  /**
   * Hides the loading
   */
  hide() {
    this.checkAndSetLoadingDiv();
    this.checkAndSetLayout();
    if (this.activeElement) {
      this.activeElement.focus();
    }
    if (!isNullOrUndefined(this.loadingDiv) && !isNullOrUndefined(this.layout)) {
      this.loadingDiv.classList.remove('loading-shown');
      this.loadingDiv.classList.add('loading');
      this.layout.style.pointerEvents = null;
    }
  }

  /**
   * Checks if the loading div is set and tries to set it
   */
  checkAndSetLoadingDiv() {
    if (isNullOrUndefined(this.loadingDiv)) {
      this.loadingDiv = document.querySelector('div#loading');
    }
  }

  /**
   * Chekcs if the loading div is set and tries to set it
   */
  checkAndSetLayout() {
    if (isNullOrUndefined(this.layout)) {
      this.layout = document.querySelector('section.layout');
    }
  }

  /**
   * Sets the route changing to false or true
   * @param change new value
   */
  setIsRouteChanging(change: boolean): void {
    this.routeChange = change;
  }

  /**
   * Get the route changing, either false or true
   * @returns true if the route changed
   */
  getRouteChanging(): boolean {
    return this.routeChange;
  }
}
