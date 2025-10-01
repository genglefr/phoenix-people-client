import {Directive, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appKeyListener]'
})
export class KeyListenerDirective {

  readonly ENTER_KEY_CODE = 'Enter';

  @Input() enterKeyFunction: Function;

  @Input() ignoredClasses: Array<string> = [];

  @HostListener('keypress', ['$event']) onEnterKeyPress(event: KeyboardEvent) {
    if (event.key === this.ENTER_KEY_CODE) {
      const target = event.target as HTMLInputElement;
      if (!this.ignoredClasses.some(elt => target.classList.contains(elt))) {
        this.enterKeyFunction();
      }
    }
  }

  constructor() { }

}
