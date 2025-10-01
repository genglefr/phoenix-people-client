import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PageDto} from '../../../model';
import {Pagination} from '../../../../environments/config';


@Component({
  selector: 'app-data-table-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input()
  pageDto: PageDto<any>;

  @Input()
  pagination: Pagination;

  @Input()
  pageSize = 25;

  @Input()
  pageSizeOptions?: number[] = [25, 50, 100];

  @Input()
  showPageSizeOptions = true;

  @Input()
  showFirstAndLastPageIcon = false;

  @Output()
  changeEventEmitter: EventEmitter<Pagination> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * Change the index value of the page
   * @param pageIndex the new value
   */
  changePageOptions(pageIndex: number) {
    this.pagination.index = pageIndex;
    this.pagination.size = this.pageSize;
    this.changeEventEmitter.emit(this.pagination);
  }
}
