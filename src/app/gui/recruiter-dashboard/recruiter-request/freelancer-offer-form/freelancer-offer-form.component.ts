import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-freelancer-offer-form',
  templateUrl: './freelancer-offer-form.component.html',
  styleUrls: ['./freelancer-offer-form.component.sass']
})
export class FreelancerOfferFormComponent implements OnInit {

  contractingCompanyCustomerInformationForm = new FormGroup({
    'contractingCompany': new FormControl(null),
    'companyAddress': new FormControl(null),
    'vatNumber': new FormControl(null),
    'legalRepresentative': new FormControl(null),
    'customer': new FormControl(null),
    'customerContractNumber': new FormControl(null),
    'customerAddress': new FormControl(null)
  });

  consultantMissionForm = new FormGroup({
    'durationInWorkingDays': new FormControl(null),
    'price': new FormControl(null),
    'professionalEmailAddress': new FormControl(null),
    'description': new FormControl(null)
  });

  constructor() { }

  ngOnInit() {
  }

  /**
   * Return the contractingCompany control of the contractingCompanyCustomerInformationForm.
   */
  get contractingCompany() {
    return this.contractingCompanyCustomerInformationForm.get('contractingCompany');
  }

  /**
   * Return the companyAddress control of the contractingCompanyCustomerInformationForm.
   */
  get companyAddress() {
    return this.contractingCompanyCustomerInformationForm.get('companyAddress');
  }

  /**
   * Return the vatNumber control of the contractingCompanyCustomerInformationForm.
   */
  get vatNumber() {
    return this.contractingCompanyCustomerInformationForm.get('vatNumber');
  }

  /**
   * Return the legalRepresentative control of the contractingCompanyCustomerInformationForm.
   */
  get legalRepresentative() {
    return this.contractingCompanyCustomerInformationForm.get('legalRepresentative');
  }

  /**
   * Return the customer control of the contractingCompanyCustomerInformationForm.
   */
  get customer() {
    return this.contractingCompanyCustomerInformationForm.get('customer');
  }

  /**
   * Return the customerContractNumber control of the contractingCompanyCustomerInformationForm.
   */
  get customerContractNumber() {
    return this.contractingCompanyCustomerInformationForm.get('customerContractNumber');
  }

  /**
   * Return the customerAddress control of the contractingCompanyCustomerInformationForm.
   */
  get customerAddress() {
    return this.contractingCompanyCustomerInformationForm.get('customerAddress');
  }

  /**
   * Return the durationInWorkingDays control of the consultantMissionForm.
   */
  get durationInWorkingDays() {
    return this.consultantMissionForm.get('durationInWorkingDays');
  }

  /**
   * Return the price control of the consultantMissionForm.
   */
  get price() {
    return this.consultantMissionForm.get('price');
  }

  /**
   * Return the professionalEmailAddress control of the consultantMissionForm.
   */
  get professionalEmailAddress() {
    return this.consultantMissionForm.get('professionalEmailAddress');
  }

  /**
   * Return the description control of the consultantMissionForm.
   */
  get description() {
    return this.consultantMissionForm.get('description');
  }

}
