import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {
  OwnerDto,
  PhoneOwnerDto,
  ResourceFullNameAndAccountDto,
  ResourcePhoneDto
} from '../../../model';
import {NgbActiveModal, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../services/notification.service';
import {LoadingService} from '../../../services/loading.service';
import {phoneRequiredValidator} from '../../../validators/PhoneRequiredValidator';
import {DateConvertorService} from '../../../services/date-convertor.service';

@Component({
  selector: 'app-edit-phone',
  templateUrl: './edit-phone.component.html',
  styleUrls: ['./edit-phone.component.sass']
})
export class EditPhoneComponent implements OnInit {

  @Input()
  isCreation: boolean;

  @Input()
  isOwner: boolean = false;

  @Input()
  owner: OwnerDto;

  @Input()
  isLinked: boolean;

  @Input()
  resourcePhoneDto: ResourcePhoneDto;

  @Input()
  phoneModelList: string[];

  @Input()
  ownerList: ResourceFullNameAndAccountDto[];

  @ViewChild('exitButton') exitButton;

  today = this.calendar.getToday();

  selectedOwner: ResourceFullNameAndAccountDto;

  /** FORMS **/
  phoneForm = new FormGroup({
    'phoneNumber': new FormControl(null, Validators.pattern("^[+]*[(]?[0-9]{1,4}[)]?[-\\s\\./0-9]*$")),
    'phoneModel': new FormControl(null),
    'phoneImei': new FormControl(null),
    'serialNumber': new FormControl(null),
    'receptionDate': new FormControl(null, [Validators.required]),
    'comment': new FormControl(null),
  });
  constructor(private activeModal: NgbActiveModal,
              private notificationService: NotificationService,
              private loadingService: LoadingService,
              private calendar: NgbCalendar) {
  }

  ngOnInit() {
    this.phoneForm.setValidators(phoneRequiredValidator());
    if (!this.isCreation) {
      this.setForm(this.resourcePhoneDto);
    } else {
      this.clearForm();
    }
  }

  /**
   * Closes the modal.
   */
  closeModal() {
    if (this.phoneForm.pristine || window.confirm('Are you sure you want to discard your changes?')) {
      this.activeModal.close();
    }
  }

  /**
   * Clear the form.
   */
  clearForm() {
    this.phoneForm.reset();
  }

  /**
   * Sets the values of the phone to the form.
   * @param resourcePhone the phone to patch.
   */
  setForm(resourcePhone: ResourcePhoneDto) {
    this.phoneNumber.patchValue(resourcePhone.phoneNumber);
    if(resourcePhone.phone) {
      this.phoneModel.patchValue(resourcePhone.phone.phoneModel);
      this.phoneImei.patchValue(resourcePhone.phone.phoneImei);
      this.serialNumber.patchValue(resourcePhone.phone.serialNumber);
    }
    this.receptionDate.patchValue(DateConvertorService.getNgbDateStructFromString(resourcePhone.receptionDate));
    this.comment.patchValue(resourcePhone.comment);
    if(this.isLinked) {
      this.phoneNumber.disable();
    }
  }

  get phoneNumber(): AbstractControl {
    return this.phoneForm.get('phoneNumber');
  }
  get phoneModel(): AbstractControl {
    return this.phoneForm.get('phoneModel');
  }
  get phoneImei(): AbstractControl {
    return this.phoneForm.get('phoneImei');
  }
  get serialNumber(): AbstractControl {
    return this.phoneForm.get('serialNumber');
  }
  get receptionDate(): AbstractControl {
    return this.phoneForm.get('receptionDate');
  }
  get comment(): AbstractControl {
    return this.phoneForm.get('comment');
  }


  /**
   * Save changes
   */
  saveChanges() {
    if(this.phoneForm.invalid){
      if(this.phoneForm.errors && this.phoneForm.errors.fieldsRequired) {
        this.notificationService.addErrorToast('The phone number or the phone IMEI should be set');
      }
      if(this.phoneForm.errors && this.phoneForm.errors.missingModel) {
        this.notificationService.addErrorToast('The phone model is required if the phone IMEI is set');
      }
      if(this.phoneForm.errors && this.phoneForm.errors.missingImei) {
        this.notificationService.addErrorToast('The phone IMEI is required if the phone model is set');
      }
    } else {
      this.savePhone({
        resourcePhoneId: this.resourcePhoneDto ? this.resourcePhoneDto.resourcePhoneId : null,
        phone: this.phoneImei.value && this.phoneModel.value ? {
          phoneImei: this.phoneImei.value,
          serialNumber: this.serialNumber.value,
          phoneModel: this.phoneModel.value,
          phoneId:  this.resourcePhoneDto && this.resourcePhoneDto.phone ? this.resourcePhoneDto.phone.phoneId : null
        } : null,
        receptionDate: DateConvertorService.convertDateToString(this.receptionDate.value),
        phoneNumber: this.phoneNumber.value,
        resource: null,
        comment: this.comment.value,
      } as ResourcePhoneDto);
    }
  }

  /**
   * Close the modal with a phone owner Dto if a owner was provide otherwise a resourcePhoneDto
   */
  savePhone(resourcePhoneDto: ResourcePhoneDto){
    if(this.isOwner) {
      let newOwner = this.owner;
      if(this.isCreation) {
        newOwner = {
          id: this.selectedOwner.id,
          account: this.selectedOwner.account,
          fullName: this.selectedOwner.fullName,
          candidate: this.selectedOwner.candidate
        }
      }
      const owner: PhoneOwnerDto = {
        owner: newOwner,
        resourcePhoneDto: resourcePhoneDto
      }
      this.activeModal.close(owner);
    } else {
      this.activeModal.close(resourcePhoneDto);
    }
  }
}
