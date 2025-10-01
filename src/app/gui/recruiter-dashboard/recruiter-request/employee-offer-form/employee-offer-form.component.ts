import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormDataDto} from '../../../../model';
import {merge, Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
import {environment} from '../../../../../environments/environment.prod';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {CompanyService} from '../../../../services/Company/company.service';

declare const accentFold: any;

@Component({
  selector: 'app-employee-offer-form',
  templateUrl: './employee-offer-form.component.html',
  styleUrls: ['./employee-offer-form.component.sass']
})
export class EmployeeOfferFormComponent implements OnInit {
  readonly NO_CAR_CATEGORY = 'No car';
  carCategories = [
    this.NO_CAR_CATEGORY,
    'A',
    'B',
    'C',
    'D'
  ];

  @ViewChild('instanceJobPosition') instanceJobPosition: NgbTypeahead;
  @ViewChild('instanceJobTitle') instanceJobTitle: NgbTypeahead;

  @Input()
  formData: FormDataDto;
  @Input()
  titles: string[] = [];
  @Input()
  company: AbstractControl;
  @Input()
  type: AbstractControl;

  isEligibleToRulling = false;

  clickJobTitle$ = new Subject<string>();

  proposalRequestInformationForm = new FormGroup({
    'address': new FormControl(null),
    'youngGraduate': new FormControl(null),
    'jobPosition': new FormControl(null, Validators.required),
    'jobTitle': new FormControl(null, Validators.required),
  });

  packageForm = new FormGroup({
    'salary': new FormControl(null, Validators.required),
    'carCategory': new FormControl(null, Validators.required),
    'insurancePackage': new FormControl(false, Validators.required),
    'mealVouchers': new FormControl(false, Validators.required),
    'gsm': new FormControl(false, Validators.required),
    'hasSecondSalary': new FormControl(false),
    'secondSalary': new FormControl(null)
  });

  formatterString = (x: { x: string }) => `${x}`;

  displaySalaryWarning = false;

  constructor(private companyService: CompanyService) { }

  ngOnInit() {
    this.checkSecondSalary();
    this.hasSecondSalary.valueChanges.subscribe(
      hasSecondSalary => this.checkSecondSalary(hasSecondSalary)
    );
    this.checkCarCategory();
    this.carCategory.valueChanges.subscribe(
      carCategory => this.checkCarCategory(carCategory)
    );
    this.checkSalaryDifferences();
    this.salary.valueChanges.subscribe(
      () => this.checkSalaryDifferences()
    );
    this.secondSalary.valueChanges.subscribe(
      () => this.checkSalaryDifferences()
    );
  }

  /**
   * Return the address control from the proposal request information form.
   */
  get address() {
    return this.proposalRequestInformationForm.get('address');
  }

  /**
   * Return the youngGraduate control from the proposal request information form.
   */
  get youngGraduate() {
    return this.proposalRequestInformationForm.get('youngGraduate');
  }

  /**
   * Return the jobPosition control from the proposal request information form.
   */
  get jobPosition() {
    return this.proposalRequestInformationForm.get('jobPosition');
  }

  /**
   * Return the jobTitle control from the proposal request information form.
   */
  get jobTitle() {
    return this.proposalRequestInformationForm.get('jobTitle');
  }

  /**
   * Return the salary control from the package form.
   */
  get salary() {
    return this.packageForm.get('salary');
  }

  /**
   * Return the hasSecondSalary control from the package form.
   */
  get hasSecondSalary() {
    return this.packageForm.get('hasSecondSalary');
  }

  /**
   * Return the secondSalary control from the package form.
   */
  get secondSalary() {
    return this.packageForm.get('secondSalary');
  }

  /**
   * Return the carCategory control from the package form.
   */
  get carCategory() {
    return this.packageForm.get('carCategory');
  }

  /**
   * Return the insurancePackage control from the package form.
   */
  get insurancePackage() {
    return this.packageForm.get('insurancePackage');
  }

  /**
   * Return the mealVouchers control from the package form.
   */
  get mealVouchers() {
    return this.packageForm.get('mealVouchers');
  }

  /**
   * Return the gsm control from the package form.
   */
  get gsm() {
    return this.packageForm.get('gsm');
  }

  /**
   * Set the search for job title.
   * @param text$ search job title.
   */
  searchJobTitle = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(environment.searchInputDelay), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickJobTitle$.pipe(filter(() => !this.instanceJobTitle.isPopupOpen()));

    return merge(debouncedText$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.titles
        : this.titles.filter(v => (`${accentFold(v.toLowerCase())}`)
          .includes(accentFold(term.toLowerCase())))).slice(0, 10))
    );
  }

  /**
   * Check second salary checkbox to disable/enable second salary amount field
   * @param hasSecondSalary
   */
  checkSecondSalary(hasSecondSalary = this.hasSecondSalary.value) {
    if (hasSecondSalary) {
      this.secondSalary.enable();
      this.secondSalary.setValidators(Validators.required);
    } else {
      this.secondSalary.clearValidators();
      this.secondSalary.setValue(null);
      this.secondSalary.disable();
    }
  }


  /**
   * Check car category and disable second salary if no car category is selected
   * @param carCategory
   */
  checkCarCategory(carCategory = this.carCategory.value) {
    if(!carCategory || carCategory === this.NO_CAR_CATEGORY) {
      this.hasSecondSalary.disable();
      this.hasSecondSalary.setValue(false);
    } else {
      this.hasSecondSalary.enable();
    }
  }

  /**
   * Check salary differences and set true to flag if Salary without car <=  Salary with car
   * @param salaryWithCar salary with car
   * @param salaryWithoutCar salary without car
   */
  checkSalaryDifferences(salaryWithCar = this.salary.value, salaryWithoutCar = this.secondSalary.value) {
    this.displaySalaryWarning = salaryWithCar && salaryWithoutCar && salaryWithCar >= salaryWithoutCar;
  }

}
