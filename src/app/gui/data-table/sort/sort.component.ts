import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FilterDto} from "../../../model";

@Component({
  selector: 'app-data-table-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.css']
})
export class SortComponent implements OnInit {
  @Output('changeSort')
  changeSort: EventEmitter<any> = new EventEmitter();
  @Input()
  filter: FilterDto;
  @Input()
  sortingRow: string;
  @Input()
  label: string;

  constructor() {
  }

  ngOnInit(): void {
  }

  /**
   * Change the row to sort.
   * @param sortingRow event sortingRow.
   */
  changeSortEvent(sortingRow: string) {
    if (this.filter.sortingRow === sortingRow) {
      this.filter.ascending = !this.filter.ascending;
    } else {
      this.filter.sortingRow = sortingRow;
      this.filter.ascending = true;
    }
    this.changeSort.emit(this.filter);
  }
}
