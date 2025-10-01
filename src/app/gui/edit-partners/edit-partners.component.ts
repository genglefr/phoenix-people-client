import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PartnerDto} from '../../model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ComponentCanDeactivateEdit} from '../../guards/can-deactivate-edit/ComponentCanDeactivateEdit';
import {PartnerService} from '../../services/Partner/partner.service';
import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-edit-partners',
  templateUrl: './edit-partners.component.html',
  styleUrls: ['./edit-partners.component.sass']
})
export class EditPartnersComponent extends ComponentCanDeactivateEdit implements OnInit {

  onEdit: string;
  partner: PartnerDto;
  countries: string[] = [];

  partnerForm = new FormGroup({
    legalName: new FormControl(null, [Validators.required, Validators.maxLength(250)]),
    type: new FormControl(null),
    intermediaryName: new FormControl(null, Validators.maxLength(250)),
    intermediaryFirstName: new FormControl(null, Validators.maxLength(250)),
    intermediaryEmail: new FormControl(null, [Validators.email, Validators.maxLength(400)]),
    intermediaryTitle: new FormControl(null, [Validators.maxLength(400)]),
    countriesOfExecution: new FormControl([]),
    countryOfEstablishment: new FormControl(null),
    annualCompensation: new FormControl(null),
    antiCorruptionProcess: new FormControl({value: '', disabled: true}),
    antiCorruptionStatus: new FormControl(null),
    contractedThroughAgency: new FormControl(null),
    staffingAgencyName: new FormControl({value: null}, Validators.maxLength(250)),
    remarks: new FormControl(null, Validators.maxLength(1000))
  });

  readonly TYPES = ['Company', 'Freelancer'];
  readonly ANNUAL_COMPENSATION_VALUES = ['1-50k', '51k-100k', '101k-250k', '251k-500k', '500k-1M', 'Greater than 1M'];
  readonly ANTI_CORRUPTION_STATUS = ['To do', 'Done'];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private partnerService: PartnerService,
              private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    const data = {
      ...this.route.snapshot.data,
      ...this.route.snapshot.data.data
    };
    this.onEdit = data.type;
    this.partner = !!data.partner ? data.partner : {};
    this.countries = data.countries.map(element => element.countryName);
    this.type.valueChanges.subscribe(element => {
      if (element === 'Freelancer') {
        this.antiCorruptionProcess.setValue('BIAL');
      } else {
        if(element === 'Company') {
          this.antiCorruptionProcess.setValue('BI tool');
        } else {
          this.antiCorruptionProcess.reset();
        }
      }
    });
    data.partner !== null && this.partner.contractingPartnerStaffingAgency === 'yes' ? this.staffingAgencyName.enable() : this.staffingAgencyName.disable();

    this.countriesOfExecution.valueChanges.subscribe( listOfCountry => {
      if(listOfCountry && listOfCountry.length > 0) {
        this.countryOfEstablishment.enable();
        if(!this.countriesOfExecution.value.includes(this.countryOfEstablishment.value)) {
          this.countryOfEstablishment.reset();
        }
      } else {
        this.countryOfEstablishment.reset();
        this.countryOfEstablishment.disable();
      }
    });
    this.setModelData(this.partner);
  }

  /**
   * Handle the change of the contract type
   * @param event the event data
   */
  handleChangeContractType(event: any) {
    if(event.target.value === 'yes') {
      this.staffingAgencyName.enable();
    } else {
      this.staffingAgencyName.reset();
      this.staffingAgencyName.disable();
    }
  }

  /**
   * Saves the partner.
   */
  savePartner() {
    const partner = this.getModelData();
    this.partnerService.savePartner(partner)
      .then((result) => {
        this.partnerForm.markAsUntouched();
        this.notificationService.addSuccessToast(`The partner has been ${partner.partnerId ? 'updated': 'saved'}`);
        this.router.navigate(['administration/partners/', result.partnerId]);
      });
  }

  /**
   * Map the partner id and the values of form values to a partner object.
   */
  getModelData(): PartnerDto {
    return {
      partnerId: this.partner.partnerId,
      legalName: this.legalName.value,
      type: this.type.value,
      contactName: this.intermediaryName.value,
      contactFirstName: this.intermediaryFirstName.value,
      contactBusinessTitle: this.intermediaryTitle.value,
      contactEmail: this.intermediaryEmail.value,
      countriesOfExecution: this.countriesOfExecution.value,
      companyEstablishmentCountry: this.countryOfEstablishment.value,
      plannedAmount: this.annualCompensation.value,
      anticorruptionProcessType: this.antiCorruptionProcess.value,
      anticorruptionStatus: this.antiCorruptionStatus.value,
      contractingPartnerStaffingAgency: this.contractedThroughAgency.value,
      contractingAgencyName: this.staffingAgencyName.value,
      remarks: this.remarks.value
    }
  }

  /**
   * Sets the model data based on partner values.
   * @param partner the partner to patch the values from.
   */
  setModelData(partner: PartnerDto): void {
    this.partnerForm.patchValue({
      legalName: partner.legalName,
      type: partner.type,
      intermediaryName: partner.contactName,
      intermediaryFirstName: partner.contactFirstName,
      intermediaryTitle: partner.contactBusinessTitle,
      intermediaryEmail: partner.contactEmail,
      countryOfEstablishment: partner.companyEstablishmentCountry,
      countriesOfExecution: partner.countriesOfExecution,
      annualCompensation: partner.plannedAmount,
      antiCorruptionProcess: partner.anticorruptionProcessType,
      antiCorruptionStatus: partner.anticorruptionStatus ? partner.anticorruptionStatus : 'To do',
      contractedThroughAgency: partner.contractingPartnerStaffingAgency ? partner.contractingPartnerStaffingAgency : 'no',
      staffingAgencyName: partner.contractingAgencyName,
      remarks: partner.remarks
    });
  }

  /**
   * Changes the countries of execution on modification of the dropdown
   * @param countries the array of selected countries
   */
  loadCountriesOfExecution(countries: string[]) {
    this.countriesOfExecution.setValue(countries);
    this.countriesOfExecution.markAsDirty();
    this.partnerForm.updateValueAndValidity();
  }

  /**
   * Go to the corresponding link depending on the anti-corruption process value
   */
  goToAntiCorruptionLink() {
    return this.antiCorruptionProcess.value === 'BIAL' ? 'https://ts.accenture.com/sites/LegalTechnology/Site%20Pages/BI%20Express%20Lane%20Home%20Page.aspx' : 'http://ethicscompliancehub-bip.accenture.com';
  }

  /**
   * Get the legal name of the partner.
   */
  get legalName() {
    return this.partnerForm.get('legalName');
  }

  /**
   * Get the type of the partner.
   */
  get type() {
    return this.partnerForm.get('type');
  }

  /**
   * Get the intermediary name of the partner.
   */
  get intermediaryName() {
    return this.partnerForm.get('intermediaryName');
  }

  /**
   * Get the intermediary first name of the partner.
   */
  get intermediaryFirstName() {
    return this.partnerForm.get('intermediaryFirstName');
  }

  /**
   * Get the business title of the partner.
   */
  get intermediaryTitle() {
    return this.partnerForm.get('intermediaryTitle');
  }

  /**
   * Get the email of the partner.
   */
  get intermediaryEmail() {
    return this.partnerForm.get('intermediaryEmail');
  }

  /**
   * Get the execution countries of the partner.
   */
  get countriesOfExecution() {
    return this.partnerForm.get('countriesOfExecution');
  }

  /**
   * Get the establishment country of the partner.
   */
  get countryOfEstablishment() {
    return this.partnerForm.get('countryOfEstablishment');
  }

  /**
   * Get the annual compensation of the partner.
   */
  get annualCompensation() {
    return this.partnerForm.get('annualCompensation');
  }

  /**
   * Get the anti corruption process of the partner.
   */
  get antiCorruptionProcess() {
    return this.partnerForm.get('antiCorruptionProcess');
  }

  /**
   * Get the anti-corruption status of the partner.
   */
  get antiCorruptionStatus() {
    return this.partnerForm.get('antiCorruptionStatus');
  }

  /**
   * Get the contacted through agency status of the partner.
   */
  get contractedThroughAgency() {
    return this.partnerForm.get('contractedThroughAgency');
  }

  /**
   * Get the agency name of the partner.
   */
  get staffingAgencyName() {
    return this.partnerForm.get('staffingAgencyName');
  }

  /**
   * Get the remarks of the partner.
   */
  get remarks() {
    return this.partnerForm.get('remarks');
  }

  /**
   * Checks if the form has been changed by the user.
   */
  canDeactivate() : boolean {
    return !this.partnerForm.touched;
  }
}
