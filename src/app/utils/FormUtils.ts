import {Injectable} from '@angular/core';

@Injectable()
export class FormUtils {

  private static readonly ALLOWED_KEYS = ['ArrowLeft', 'ArrowRight', 'Tab', 'Delete', 'Backspace'];

  constructor() {}

  /**
   * Validate number inputs only.
   * @param event the event to handle.
   */
  static validateNumberInput(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);

    const isNumber = charCode >= 48 && charCode <= 57;
    const isShortcut = (event.ctrlKey || event.metaKey) && ['c', 'v', 'x', 'a'].includes(event.key.toLowerCase());

    if (!isNumber && !this.ALLOWED_KEYS.includes(event.key) && !isShortcut) {
      event.preventDefault();
    }
  }

  /**
   * Validate past inputs for number only.
   * @param event the event to handle.
   */
  static validatePasteInput(event: ClipboardEvent) {
    const pastedText = event.clipboardData ? event.clipboardData.getData('text') || '' : null;
    if (!/^\d+$/.test(pastedText)) {
      event.preventDefault(); // Blocks pasting non-numeric values
    }
  }

}
