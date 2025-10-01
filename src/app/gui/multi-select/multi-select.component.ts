import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.sass']
})
export class MultiSelectComponent implements OnInit {
  @Input()
  items: any[];

  @Input()
  idValue: string;

  @Input()
  label: string;

  @Input()
  filter: any[];

  @Input()
  placeholder: string;

  @Input()
  width: string;

  @Input()
  multiple = true;

  @Input()
  selectOnTab = false;

  @Input()
  clearOnBackspace = false;

  @Input()
  virtualScroll = false;

  @Input()
  closeOnSelect = false;

  @Output()
  changeEventEmitter: EventEmitter<any> = new EventEmitter();

  @Input()
  hasSelectAll = false;

  @Input()
  clearSearchOnAdd = true;

  @Input()
  selectableGroupAsModel = false;

  @Input()
  groupBy = 'groupBy';

  @Input()
  selectAllLabel = 'Select all';

  @Input()
  limitTagLength = 0;

  @Input()
  forceTagLimit = false;

  @Input()
  lazy = false;

  @Input()
  addTag = false;

  @Input()
  addTagText = 'Add item';

  @Input()
  notFoundText = 'No items found';

  @Input()
  maxTagsDisplayed = 1;

  @Input()
  disabled = false;

  @Input()
  sortBySelect = false;

  constructor() {
  }

  ngOnInit() {
    if (this.hasSelectAll) {
      this.items = this.items.map(elt => {
        elt['select'] = this.selectAllLabel;
        return elt;
      });
    }

    if (this.sortBySelect) {
      if (this.filter && this.multiple) {
        this.sortItemsBySelected();
      }
    }
  }

  /**
   * Change value and add it to the datasource if it's new
   */
  changeValue(value: any) {
    if(value && this.multiple) {
      value.forEach(v => this.addValueIfAbsent(v)); //LAST
    } else {
      this.addValueIfAbsent(value);
    }
    this.changeEventEmitter.emit(this.filter);
    this.sortItemsBySelected();
  }

  /**
   * Sort the items by displaying the selected ones first.
   */
  sortItemsBySelected() {
    if (this.sortBySelect) {
      this.items = Array.from(this.items.sort(
        (a, b) => {
          if(this.filter.some((y) => JSON.stringify(a) === JSON.stringify(y))) {
            return -1;
          }
          if(this.filter.some((y) => JSON.stringify(b) === JSON.stringify(y))) {
            return 1;
          }
          return 0;
        }
      ));
    }
  }

  /**
   * Check if the given value exists in the item list, add it otherwise.
   * @param value the given value to check
   */
  addValueIfAbsent(value: any) {
    if(value && !this.items.includes(value)) {
      this.items = [...this.items, value];
    }
  }
}
