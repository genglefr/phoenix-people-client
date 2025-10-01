import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CompanyDto, PhoneFixedCostDto} from '../../../model';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {NotificationService} from '../../../services/notification.service';
import {LoadingService} from '../../../services/loading.service';
import {PhoneConsumptionService} from '../../../services/PhoneConsumption/phone-consumption.service';

@Component({
  selector: 'app-edit-fixed-cost',
  templateUrl: './edit-fixed-cost.component.html',
  styleUrls: ['./edit-fixed-cost.component.sass']
})
export class EditFixedCostComponent implements OnInit {
  @Input()
  phoneFixedCostDto: PhoneFixedCostDto;

  @Input()
  companyList: CompanyDto[];

  @ViewChild('exitButton') exitButton;

  today = this.calendar.getToday();

  /** FORMS **/
  costForm = new FormGroup({
    'period': new FormControl(null, [Validators.pattern(/\d{4}(0[1-9]|1[0-2])/), Validators.required]),
    'company': new FormControl(null, Validators.required),
    'cost': new FormControl(null, [Validators.required, Validators.min(0)])
  });
  constructor(private activeModal: NgbActiveModal,
              private notificationService: NotificationService,
              private loadingService: LoadingService,
              private calendar: NgbCalendar,
              private phoneConsumptionService: PhoneConsumptionService) { }

  ngOnInit() {

    if (this.phoneFixedCostDto) {
      this.setForm(this.phoneFixedCostDto);
    } else {
      this.clearForm();
    }
  }


  /**
   * Closes the modal.
   */
  closeModal() {
    if (this.costForm.pristine || window.confirm('Are you sure you want to discard your changes?')) {
      this.activeModal.close();
    }
  }

  /**
   * Clear the form.
   */
  clearForm() {
    this.costForm.reset();
  }

  /**
   * Sets the values of the phone fixed cost to the form.
   * @param phoneFixedCostDto the phone fixed cost to patch.
   */
  setForm(phoneFixedCostDto: PhoneFixedCostDto) {
    this.period.patchValue(phoneFixedCostDto.period);
    const companyDto = this.companyList.find(elt => elt.company === phoneFixedCostDto.companyDto.company);
    if(companyDto) {
      this.company.patchValue(companyDto);
    }
    this.cost.patchValue(phoneFixedCostDto.fixedCost);
  }

  /**
   * Retrieve the period control.
   */
  get period(): AbstractControl {
    return this.costForm.get('period');
  }

  /**
   * Retrieve the company control.
   */
  get company(): AbstractControl {
    return this.costForm.get('company');
  }

  /**
   * Retrieve the cost
   */
  get cost(): AbstractControl {
    return this.costForm.get('cost');
  }

  /**
   * Save changes
   */
  saveChanges() {
    this.saveFixedCost({
      id: this.phoneFixedCostDto ? this.phoneFixedCostDto.id : null,
      period: this.period.value,
      companyDto: this.company.value,
      fixedCost: this.cost.value
    } as PhoneFixedCostDto);
  }

  /**
   * Saves the phone fixed cost.
   */
  saveFixedCost(phoneFixedCostDto: PhoneFixedCostDto) {
    this.phoneConsumptionService.saveFixedCost(phoneFixedCostDto).then(result => this.activeModal.close(result));
  }
}
