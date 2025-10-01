import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as moment from 'moment';
import {FullResourceDto, ResourcePhoneDto} from '../../model';
import {EditPhoneComponent} from '../modal/edit-phone/edit-phone.component';
import {PhoneConsumptionService} from '../../services/PhoneConsumption/phone-consumption.service';
import {NotificationService} from '../../services/notification.service';
import {FilterDto} from '../../utils/filter';
import {ResourceService} from '../../services/Resource/resource.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DailyEmailsService} from '../../services/DailyEmail/daily-emails.service';
import {PhoneService} from "../../services/Phone/phone.service";

@Component({
  selector: 'app-manage-phone-numbers',
  templateUrl: './manage-phone-numbers.component.html',
  styleUrls: ['./manage-phone-numbers.component.sass']
})
export class ManagePhoneNumbersComponent implements OnInit, OnChanges {

  @Input()
  user: FullResourceDto;

  @Input()
  isUserAdministrator;

  @Input()
  isResourceCandidate = false;

  changedPhone = false;
  sortAscendingPhone = false;

  phoneSet = false;

  filters: FilterDto[] = [
    {column: 'phoneNumber', value: ''},
    {column: 'phone.phoneModel', value: ''},
    {column: 'phone.phoneImei', value: ''},
    {column: 'receptionDate', value: ''}
  ];

  constructor(private phoneConsumptionService: PhoneConsumptionService,
              private notificationService: NotificationService,
              private resourceService: ResourceService,
              private modalService: NgbModal,
              private dailyMailService: DailyEmailsService,
              private phoneService: PhoneService) { }

  ngOnInit() {
    this.sortPhones();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      this.checkResourcePhoneList();
    }
  }



  /**
   * Change the value for the criteria
   * @param field - the field where the filter is added
   * @param event - the value inserted
   */
  applyFilter(field, event) {
    if (field != null) {
      this.filters.find(elt => elt.column === field).value = event.target.value;
      this.sortPhones();
    }
  }




  /**
   * Changes the order of the sort.
   */
  changeSortForPhones() {
    this.sortAscendingPhone = !this.sortAscendingPhone;
    this.sortPhones();
  }

  /**
   * Sort the badges according to the sort direction.
   */
  sortPhones() {
    this.user.resourcePhoneList.sort(
      (a, b) => moment(a.receptionDate, 'DD/MM/YYYY').valueOf() - moment(b.receptionDate, 'DD/MM/YYYY').valueOf()
    );
    if (!this.sortAscendingPhone) {
      this.user.resourcePhoneList.reverse();
    }
    this.filters = Array.from(this.filters);
  }

  /**
   * Removes the phone from the list of phones.
   */
  removePhone(phone: ResourcePhoneDto) {
    this.phoneConsumptionService.isLinked(phone.resourcePhoneId)
      .then(
        isLinked => {
          if(isLinked) {
            this.notificationService.addErrorToast(`Delete of the phone is not possible since consumptions are linked.`);
          } else {
            const index = this.user.resourcePhoneList.indexOf(phone);
            if(index > -1) {
              this.user.resourcePhoneList.splice(index, 1);
            }
            this.sortPhones();
            if (this.phoneSet) {
              this.checkResourcePhoneList();
            }
          }
        }
      );
  }


  /**
   * Add the selected phone to the list.
   */
  addToPhoneList(resourcePhoneDto: ResourcePhoneDto, index: number) {
    if(resourcePhoneDto) {
      this.changedPhone = true;
      if(index > -1) {
        this.user.resourcePhoneList[index] = resourcePhoneDto;
      } else {
        this.user.resourcePhoneList.push(resourcePhoneDto);
      }

      this.sortPhones();
    }
  }

  /**
   * Open phone modal for edit/creation
   * @param resourcePhoneDto phone to edit, if creation null
   */
  openPhoneModal(resourcePhoneDto: ResourcePhoneDto = null) {
    Promise.all(
      [
        this.phoneConsumptionService.isLinked(resourcePhoneDto ? resourcePhoneDto.resourcePhoneId : null),
        this.phoneService.getPhoneModelList()
      ]).then(
      ([isLinked, phoneModelList]) => {
        const modalRef = this.modalService.open(EditPhoneComponent, {centered: true, backdrop: 'static'});
        modalRef.componentInstance.isCreation = !resourcePhoneDto;
        modalRef.componentInstance.resourcePhoneDto = resourcePhoneDto;
        modalRef.componentInstance.isLinked = isLinked;
        modalRef.componentInstance.phoneModelList = phoneModelList;
        const index = this.user.resourcePhoneList.indexOf(resourcePhoneDto);
        modalRef.result.then(phone => this.addToPhoneList(phone, index));
      }
    );
  }

  /**
   * Sends the phone notification to the resource.
   * @param account the resource to send the phone notification to.
   */
  sendPhoneNotification(account: string) {
    this.dailyMailService.sendPhoneNotification(account)
      .then(() => {
        this.notificationService
          .addSuccessToast(`The email has been sent successfully!`);
      })
      .finally(() => {
        document.getElementById('phoneNotification').blur();
      })
  }


  /**
   * Check the resource phone list.
   */
  checkResourcePhoneList() {
    this.phoneSet = !!(this.user.resourcePhoneList && this.user.resourcePhoneList.length);
  }

}
