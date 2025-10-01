import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {merge, Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment.prod';
import {FilterUtils} from '../../utils/FilterUtils';
import {CandidateDto, FullResourceDto, ResourceFullNameAndAccountDto} from '../../model';
import {StringUtils} from '../../utils/StringUtils';
import {ResourceService} from '../../services/Resource/resource.service';
import {CandidateService} from '../../services/Candidate/candidate.service';

@Component({
  selector: 'app-responsible-at-arhs',
  templateUrl: './responsible-at-arhs.component.html',
  styleUrls: ['./responsible-at-arhs.component.sass']
})
export class ResponsibleAtArhsComponent implements OnInit {

  responsibleForm = new FormGroup({
    'manager': new FormControl(null),
    'inductionResponsible': new FormControl(null),
    'mentor': new FormControl(null)
  });

  @ViewChild('instanceManager') instanceManager: NgbTypeahead;
  @ViewChild('instanceInductionResponsible') instanceInductionResponsible: NgbTypeahead;
  @ViewChild('instanceMentor') instanceMentor: NgbTypeahead;

  clickManager$ = new Subject<string>();
  clickInductionResponsible$ = new Subject<string>();
  clickMentor$ = new Subject<string>();

  @Input()
  startDate: AbstractControl;

  @Input()
  employeeList: ResourceFullNameAndAccountDto[] = [];

  @Input()
  userToShow: FullResourceDto;

  @Input()
  isEditCandidate = false;

  @Input()
  isEditResource = false;

  @Input()
  isInductionResponsibleAvailable = true;

  formatterEmployee = (x: { lastName: string, firstName: string, account: string}) => `${x.lastName} ${x.firstName} (${x.account})`;

  constructor(private resourceService: ResourceService, private candidateService: CandidateService) { }

  ngOnInit() {
    this.initResponsibleForm(this.userToShow);

    this.manager.valueChanges.subscribe(() => {
      if (this.manager.value && !this.employeeList.includes(this.manager.value)) {
        this.manager.setErrors({notInList: true});
      }
    });
    this.mentor.valueChanges.subscribe(() => {
      if (this.mentor.value && !this.employeeList.includes(this.mentor.value)) {
        this.mentor.setErrors({notInList: true});
      }
    });
    this.inductionResponsible.valueChanges.subscribe(() => {
      if (this.inductionResponsible.value && !this.employeeList.includes(this.inductionResponsible.value)) {
        this.inductionResponsible.setErrors({notInList: true});
      } else if (this.startDate.value) {
        this.checkInductionResponsibleAvailability();
      }
    });
  }

  /**
   * Get the manager.
   */
  get manager() {
    return this.responsibleForm.get('manager');
  }

  /**
   * Get the manager.
   */
  getManager() {
    return this.manager.value
      ? this.manager.value.account
      : null;
  }

  /**
   * Get the inductionResponsible.
   */
  get inductionResponsible() {
    return this.responsibleForm.get('inductionResponsible');
  }

  /**
   * Get the inductionResponsible.
   */
  getInductionResponsible() {
    return this.inductionResponsible.value
      ? this.inductionResponsible.value.account
      : null;
  }

  /**
   * Get the mentor.
   */
  get mentor() {
    return this.responsibleForm.get('mentor');
  }

  /**
   * Get the mentor.
   */
  getMentor() {
    return this.mentor.value
      ? this.mentor.value.account
      : null;
  }

  /**
   * Initialize the responsible form.
   * @param userToShow The data that should be displayed.
   */
  initResponsibleForm(userToShow: FullResourceDto) {
    if (userToShow) {
      if (userToShow.manager) {
        this.responsibleForm.get('manager')
          .setValue(this.resourceService.findEmployeeInListByAccount(this.employeeList, userToShow.manager));
      }
      if (userToShow.inductionResponsible) {
        this.responsibleForm.get('inductionResponsible')
          .setValue(this.resourceService.findEmployeeInListByAccount(this.employeeList, userToShow.inductionResponsible));
      }
      if (userToShow.mentor) {
        this.responsibleForm.get('mentor')
          .setValue(this.resourceService.findEmployeeInListByAccount(this.employeeList, userToShow.mentor));
      }
    }
  }

  /**
   * Check if the induction responsible is available for the start date.
   */
  checkInductionResponsibleAvailability() {
    if (this.inductionResponsible.value) {
      this.candidateService.isInductionResponsibleAvailable(this.inductionResponsible.value.account,
        StringUtils.formatHyphen(this.startDate.value)).then(value => {
        this.isInductionResponsibleAvailable = value;
      });
    }
  }

  /**
   * function of bootstrap for manager autocomplete.
   * @param text$ - The text of the autocomplete.
   */
  searchManager = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(environment.searchInputDelay), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickManager$.pipe(filter(() => !this.instanceManager.isPopupOpen()));

    return merge(debouncedText$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.employeeList
        : this.employeeList.filter(v => FilterUtils.isMatchingWithFirstNameLastNameOrAccount(v, term)))
        .slice(0, environment.nbElementsAutoComplete))
    );
  }

  /**
   * function of bootstrap for induction responsible autocomplete.
   * @param text$ - The text of the autocomplete.
   */
  searchInductionResponsible = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(environment.searchInputDelay), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickInductionResponsible$.pipe(filter(() => !this.instanceInductionResponsible.isPopupOpen()));

    return merge(debouncedText$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.employeeList
        : this.employeeList.filter(v => FilterUtils.isMatchingWithFirstNameLastNameOrAccount(v, term)))
        .slice(0, environment.nbElementsAutoComplete))
    );
  }

  /**
   * function of bootstrap for mentor autocomplete.
   * @param text$ - The text of the autocomplete.
   */
  searchMentor = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(environment.searchInputDelay), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickMentor$.pipe(filter(() => !this.instanceMentor.isPopupOpen()));

    return merge(debouncedText$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.employeeList
        : this.employeeList.filter(v => FilterUtils.isMatchingWithFirstNameLastNameOrAccount(v, term)))
        .slice(0, environment.nbElementsAutoComplete))
    );
  }

}
