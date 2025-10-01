import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FilterDto, OwnerDto, PageDto, PhoneFilterDto, PhoneOwnerDto, ResourceFullNameAndAccountDto} from '../../model';
import {FilterService} from '../../services/Filter/filter.service';
import {NotificationService} from '../../services/notification.service';
import {PhoneService} from '../../services/Phone/phone.service';
import {PhoneConsumptionService} from '../../services/PhoneConsumption/phone-consumption.service';
import {UserService} from '../../services/User/user.service';
import {EditPhoneComponent} from "../modal/edit-phone/edit-phone.component";
import {ModalUtils} from "../../utils/ModalUtils";
import {ResourceService} from "../../services/Resource/resource.service";
import {BadgeService} from "../../services/Badge/badge.service";
import {Pagination} from "../../../environments/config";
import {StringUtils} from "../../utils/StringUtils";
import {ExportResourcesService} from "../../services/ExportResources/export-resources.service";

@Component({
  selector: 'app-phone-management',
  templateUrl: './phone-management.component.html',
  styleUrls: ['./phone-management.component.sass']
})
export class PhoneManagementComponent implements OnInit {

  @ViewChild('exitButton') exitButton;

  phoneModelList: string[];
  ownerList: OwnerDto[];

  pagination: Pagination = new Pagination();

  phones: PageDto<PhoneOwnerDto>;
  resources: ResourceFullNameAndAccountDto[] = [];
  phoneFilter: PhoneFilterDto = this.filterService.getPhoneFilterDto();

  pageIndex = 0;
  pageSize = 25;
  isCreation = true;

  /** FORMS **/
  phoneForm = new FormGroup({
    'phoneNumber': new FormControl(null, [Validators.required, Validators.maxLength(50)]),
    'owner': new FormControl(null),
    'phoneImei': new FormControl(null),
    'serialNumber': new FormControl(null),
    'model': new FormControl(null),
    'receptionDate': new FormControl(null),
    'comment': new FormControl(null, [Validators.maxLength(4000)])
  });


  constructor(private filterService: FilterService,
    private phoneService: PhoneService,
    private resourceService: ResourceService,
    private badgeService: BadgeService,
    private phoneConsumptionService: PhoneConsumptionService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private modalService: NgbModal,
    private modal: ModalUtils,
    private userService: UserService, private exportService: ExportResourcesService) {

  }
  ngOnInit(): void {
    const [phones, filter] = this.route.snapshot.data.data;
    this.phones = phones;
    this.phoneFilter = filter;
  }

  /**
  * Fetch the page of phones.
  */
  fetchPagePhone() {
    this.phoneService.getPhonePage(this.phoneFilter, this.pagination)
      .then(data => this.phones = data);
  }

  /**
   * Resets the page index and refilter the page of phones.
   */
  resetAndFetchPagePhone() {
    this.pageIndex = 0;
    this.fetchPagePhone();
  }

  /**
   * Export phone table as an excel
   */
  export() {
    this.exportService.exportPhones(this.phoneFilter).then(() => {
      this.notificationService.addSuccessToast('Export file successfully created');
    });
  }

  /**
  * Open the edit modal if phone given otherwise create modal
  * @param phone to edit.
  */
  editOrCreatePhone(phone: PhoneOwnerDto) {
  const data: Promise<any>[] = [
    this.getPhoneModel(),
    phone ? Promise.resolve() : this.getOwnerList()
  ]
    Promise.all(data).then(([phoneList, ownerList]) => {
      const ref = this.modalService.open(EditPhoneComponent,
        ModalUtils.getGenericParams(ModalUtils.DO_NOTHING_ON_DISMISS, 'md')
      )
      ref.componentInstance.phoneModelList = phoneList;
      ref.componentInstance.isOwner = true;
      ref.componentInstance.isCreation = !phone;
      ref.componentInstance.ownerList = ownerList;

      if(phone) {
        ref.componentInstance.resourcePhoneDto = phone.resourcePhoneDto;
        ref.componentInstance.owner = phone.owner;
      }

      ref.result.then(phone => {
        if(phone) {
          this.phoneService.save(phone).then(() => this.resetAndFetchPagePhone());
        }
      });
    });
  }

  /**
   * Delete the selected phone.
   * @param phone the phone to delete.
   */
  deletePhone(phone: PhoneOwnerDto) {
    ModalUtils.confirm(
      'Confirm deletion',
      `Are you sure you want to remove this entry: <br/>
            <ul class="pt-1">
            <li><strong>Owner:</strong> ${StringUtils.sanitize(phone.owner.fullName)}</li>
            <li><strong>Phone number:</strong> ${StringUtils.sanitize(phone.resourcePhoneDto.phoneNumber)}</li>
            <li><strong>Phone IMEI:</strong>  ${StringUtils.sanitize(phone.resourcePhoneDto.phone.phoneImei)}</li>
            <li><strong>Serial number:</strong>  ${StringUtils.sanitize(phone.resourcePhoneDto.phone.serialNumber)}</li>
            <li><strong>Phone model:</strong>  ${StringUtils.sanitize(phone.resourcePhoneDto.phone.phoneModel)}</li>
            <li><strong>Phone reception date:</strong>  ${StringUtils.sanitize(phone.resourcePhoneDto.receptionDate)}</li>
            </ul>
      `,
      this.modalService,
      () => {
        this.phoneService.deletePhone(phone).then(() => this.resetAndFetchPagePhone());
      }
    );
  }

  /**
   * Change column to sort
   * @param filter
   */
  changeSort(filter: FilterDto) {
    this.phoneFilter.sortingRow = filter.sortingRow;
    this.phoneFilter.ascending = filter.ascending;
    this.resetAndFetchPagePhone();
  }

  /**
   * Get the local phone model list if it is filled, otherwise get it remotely
   */
  getPhoneModel(): Promise<string[]>{
    if(this.phoneModelList){
      return Promise.resolve(this.phoneModelList);
    } else {
      return this.phoneService.getPhoneModelList().then((res) => {
        this.phoneModelList = res;
        return res;
      });
    }
  }

  /**
   * Get the local owner list if it is filled, otherwise get it remotely
   */
  getOwnerList(): Promise<OwnerDto[]>{
    if(this.ownerList){
      return Promise.resolve(this.ownerList);
    } else {
      return this.badgeService.getBadgeResources().then((res) => {
        this.ownerList = res;
        return res;
      });
    }
  }

  /**
   * Update pagination and fetch new tasks according the pagination
   * @param pagination
   */
  changePagination(pagination: Pagination): void {
    this.pagination = pagination;
    this.resetAndFetchPagePhone();
  }

  get phoneNumber(): AbstractControl {
    return this.phoneForm.get('phoneNumber');
  }
  get owner(): AbstractControl {
    return this.phoneForm.get('owner');
  }
  get phoneImei(): AbstractControl {
    return this.phoneForm.get('phoneImei');
  }
  get serialNumber(): AbstractControl {
    return this.phoneForm.get('serialNumber');
  }
  get model(): AbstractControl {
    return this.phoneForm.get('model');
  }
  get receptionDate(): AbstractControl {
    return this.phoneForm.get('receptionDate');
  }
  get comment(): AbstractControl {
    return this.phoneForm.get('comment');
  }
}
