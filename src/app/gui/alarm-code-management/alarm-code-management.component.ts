import {Component, OnInit} from '@angular/core';
import {AlarmCodeDto, AlarmCodeFilterDto, PageDto, ResourceFullNameAndAccountDto} from '../../model';
import {NgbCalendar, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FilterService} from '../../services/Filter/filter.service';
import {ActivatedRoute} from '@angular/router';
import {NotificationService} from '../../services/notification.service';
import {ConfirmModalComponent} from '../modal/confirm-modal/confirm-modal.component';
import {AlarmCodeService} from '../../services/Alarm/alarm-code.service';
import {EditAlarmCodeComponent} from '../modal/edit-badge/edit-alarm-code.component';
import {LoadingService} from '../../services/loading.service';

@Component({
  selector: 'app-alarm-code-management',
  templateUrl: './alarm-code-management.component.html',
  styleUrls: ['./alarm-code-management.component.sass']
})
export class AlarmCodeManagementComponent implements OnInit {
  alarmCodes: PageDto<AlarmCodeDto>;
  accessTypes: any[] = [];
  resources: ResourceFullNameAndAccountDto[] = [];

  pageIndex = 0;
  pageSize = 25;

  alarmCodeToEdit: AlarmCodeDto = {floor: null} as AlarmCodeDto;

  alarmCodeFilter: AlarmCodeFilterDto = this.filterService.getAlarmFilterDto();

  constructor(private filterService: FilterService, private alarmCodeService: AlarmCodeService,
              private route: ActivatedRoute, private calendar: NgbCalendar,
              private notificationService: NotificationService,
              private modalService: NgbModal, private loadingService: LoadingService) {

  }

  ngOnInit(): void {
    const data = this.route.snapshot.data.data;
    this.alarmCodes = data[0];
    this.resources = data[1];
  }

 /**
   * Fetch the page of badges.
   */
  fetchPageBadge() {
      this.alarmCodeService.getAlarmPage(this.alarmCodeFilter, this.pageSize, this.pageIndex)
      .then(data => {
        this.alarmCodes = data;
      }).finally(() => {
        this.loadingService.setIsRouteChanging(false);
        this.loadingService.hide();
      });
  }

  /**
   * Resets the page index and refilter the page of badges.
   */
  resetAndFetchPageBadge() {
    this.pageIndex = 0;
    this.fetchPageBadge();
  }

  /**
   * Changes the sort of column.
   * @param event the name of the column to sort on.
   */
  changeSort(event) {
    if (this.alarmCodeFilter.sortingRow === event) {
      this.alarmCodeFilter.ascending = !this.alarmCodeFilter.ascending;
    } else {
      this.alarmCodeFilter.sortingRow = event;
      this.alarmCodeFilter.ascending = true;
    }
    this.resetAndFetchPageBadge();
  }

  /**
   * Changes the page size.
   * @param size the size to set.
   */
  changePageSize(size: number) {
    this.pageSize = size;
    this.fetchPageBadge();
  }

  /**
   * Changes the page index.
   * @param index the index to set.
   */
  changePage(index: number) {
    this.pageIndex = index;
    this.fetchPageBadge();
  }

  /**
   * Set the alarm codes to edit.
   * Emtpty object if creation.
   * @param alarmCode to edit.
   */
  setAlarmCodeInForm(alarmCode: AlarmCodeDto = {floor: null}) {
    this.alarmCodeToEdit = alarmCode;
    const modalRef = this.modalService.open(
      EditAlarmCodeComponent, {centered: true, keyboard: false, backdrop: 'static'}
    );
    modalRef.componentInstance.isCreation = !this.alarmCodeToEdit.id;
    modalRef.componentInstance.alarmCodeToEdit = this.alarmCodeToEdit;
    modalRef.componentInstance.resources = this.resources;
    modalRef.result.then(
      value => {
        if (value) {
            this.resetAndFetchPageBadge();
        }
      }
    );
  }

  /**
   * Delete the selected alarm code.
   * @param alarmCode the alarm code to delete.
   */
  deleteBadge(alarmCode: AlarmCodeDto) {
    if (alarmCode.id) {
      const modal = this.modalService.open(ConfirmModalComponent, {centered: true});
      modal.componentInstance.confirmationMessage = 'Are you sure that you want to delete this alarm code ?';
      modal.componentInstance.confirmationTitle = 'Delete alarm code';
      modal.result.then(result => {
        if (result) {
          this.loadingService.display();
          this.loadingService.setIsRouteChanging(true);
          this.alarmCodeService.deleteBadge(alarmCode).then((response) => {
            if (response) {
              this.notificationService.addSuccessToast('The alarm code has been deleted successfully');
              this.resetAndFetchPageBadge();
            } else {
              this.notificationService.addWarningToast('The alarm code has already been deleted');
            }
          }).catch(() => {
            this.loadingService.setIsRouteChanging(false);
            this.loadingService.hide();
          });
        }
      });
    }
  }

  /**
   * Search with filter applied
   */
  searchWithFilter() {
    this.resetAndFetchPageBadge();
  }

}
