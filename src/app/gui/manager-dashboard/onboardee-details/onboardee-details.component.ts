import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {
  ManagerBoardFilterDto,
  ManagerBoardResourceDto, OnboardingStepDto, OnboardingStepFilterDto,
  ResourceFullNameAndAccountDto, SRBoardColumnDto,
  SRCandidateAttachmentDto
} from '../../../model';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import * as fileSaver from 'file-saver';
import {DateConvertorService} from '../../../services/date-convertor.service';
import {ResponsibleAtArhsComponent} from '../../responsible-at-arhs/responsible-at-arhs.component';
import {OnBoardingService} from '../../../services/OnBoarding/on-boarding.service';
import {NotificationService} from '../../../services/notification.service';
import {StringUtils} from '../../../utils/StringUtils';
import {FormCanDeactivateOnboardee} from '../../../guards/can-deactivate-edit/FormCanDeactivateOnboardee';
import {FilterService} from '../../../services/Filter/filter.service';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {ConfirmModalComponent} from '../../modal/confirm-modal/confirm-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ViewportScroller} from '@angular/common';

@Component({
  selector: 'app-onboardee-details',
  templateUrl: './onboardee-details.component.html',
  styleUrls: ['./onboardee-details.component.sass']
})
export class OnboardeeDetailsComponent extends FormCanDeactivateOnboardee implements OnInit, AfterViewInit {

  onboardee: ManagerBoardResourceDto;
  employeeList: ResourceFullNameAndAccountDto[] = [];
  dueDates: string[] = [];
  onboardingSteps: OnboardingStepDto[] = [];

  activityRadio = new Subject<string>();
  fullNameInput = new Subject<string>();

  @ViewChild('responsibleAtArhsComponent') responsibleAtArhsComponent: ResponsibleAtArhsComponent;

  onboardeeForm = new FormGroup({
    'firstName': new FormControl(''),
    'lastName': new FormControl(''),
    'startDate': new FormControl(''),
    'endDate': new FormControl(''),
    'jobPosition': new FormControl(''),
    'jobTitle': new FormControl(''),
    'resourceType': new FormControl(''),
    'referrer': new FormControl(''),
    'company': new FormControl('')
  });
  isCreateSuccess = false;
  onboardeeFilter: OnboardingStepFilterDto = this.filterService.getOnboardeeStepFilterDto();


  constructor(private route: ActivatedRoute, private onboardingService: OnBoardingService,
              private notificationService: NotificationService, private filterService: FilterService,
              private modalService: NgbModal, private viewportScroller: ViewportScroller) {
    super();
  }

  ngOnInit() {
    this.onboardee = this.route.snapshot.data['rsc'].onboardee;
    this.onboardingSteps = this.route.snapshot.data['rsc'].steps;
    this.dueDates = this.route.snapshot.data['rsc'].dueDates;
    this.employeeList = this.route.snapshot.data['employees'];
    this.initForm();

    this.activityRadio.pipe(
      debounceTime(environment.changeRadioButtonDelay),
      distinctUntilChanged()
    ).subscribe(
      () => {
        this.fetchAllSteps();
      }
    );
    this.fullNameInput.pipe(
      debounceTime(environment.searchInputDelay),
      distinctUntilChanged()
    ).subscribe(
      (input: string) => {
        this.fetchAllSteps();
      }
    );
  }

  ngAfterViewInit() {
    document.getElementById('inductionResponsible').parentElement.classList.add('');
    document.getElementById('mentor').parentElement.classList.add('');
  }

  formatterEmployee = (x: { lastName: string, firstName: string, account: string}) => `${x.lastName} ${x.firstName} (${x.account})`;

  /**
   * Return firstName from onboardee form.
   */
  get firstName() {
    return this.onboardeeForm.get('firstName');
  }

  /**
   * Return lastName from onboardee form.
   */
  get lastName() {
    return this.onboardeeForm.get('lastName');
  }

  /**
   * Return startDate from onboardee form.
   */
  get startDate() {
    return this.onboardeeForm.get('startDate');
  }

  /**
   * Return endDate from onboardee form.
   */
  get endDate() {
    return this.onboardeeForm.get('endDate');
  }

  /**
   * Return jobPosition from onboardee form.
   */
  get jobPosition() {
    return this.onboardeeForm.get('jobPosition');
  }

  /**
   * Return jobTitle from onboardee form.
   */
  get jobTitle() {
    return this.onboardeeForm.get('jobTitle');
  }

  /**
   * Return resourceType from onboardee form.
   */
  get resourceType() {
    return this.onboardeeForm.get('resourceType');
  }

  /**
   * Return referrer from onboardee form.
   */
  get referrer() {
    return this.onboardeeForm.get('referrer');
  }

  /**
   * Return company from onboardee form.
   */
  get company() {
    return this.onboardeeForm.get('company');
  }

  /**
   * Init the values of the form.
   */
  initForm() {
    this.firstName.setValue(this.onboardee.firstName);
    this.lastName.setValue(this.onboardee.lastName);
    this.startDate.setValue(DateConvertorService.getNgbDateStructFromString(this.onboardee.startDate));
    this.endDate.setValue(this.onboardee.endDate);
    this.jobPosition.setValue(this.onboardee.jobPosition);
    this.jobTitle.setValue(this.onboardee.jobTitle);
    this.resourceType.setValue(this.onboardee.resourceType);
    this.referrer.setValue(this.onboardee.referrer);
    this.company.setValue(this.onboardee.company);
  }

  /**
   * Launch the download of the chosen attachment.
   * @param attachment to download.
   */
  downloadAttachment(attachment: SRCandidateAttachmentDto) {
    this.onboardingService.downloadAttachment(attachment.id).then(res => {
      const blob: any = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      fileSaver.saveAs(url, attachment.name);
    });
  }

  /**
   * Bind the value from the form to the onboardee.
   */
  bindFormDataToOnboardee() {
    this.onboardee.jobTitle = StringUtils.trimValueIfExist(this.jobTitle.value);
    this.onboardee.inductionResponsible = this.responsibleAtArhsComponent.getInductionResponsible();
    this.onboardee.mentor = this.responsibleAtArhsComponent.getMentor();
  }

  /**
   * Update the onboardee information.
   */
  updateOnboardeeInformation() {
    if (this.responsibleAtArhsComponent.responsibleForm.invalid) {
      if (this.responsibleAtArhsComponent.inductionResponsible.invalid) {
        this.notificationService.addErrorToast('Please select a valid induction responsible.');
      }
      if (this.responsibleAtArhsComponent.mentor.invalid) {
        this.notificationService.addErrorToast('Please select a valid mentor.');
      }
    } else {
      this.bindFormDataToOnboardee();
      Promise.all([
        this.onboardingService.updateOnboardeeDetails(this.onboardee).then(() => {
          this.notificationService.addSuccessToast('The resource has been updated');
          this.isCreateSuccess = true;
        }),
        this.onboardingService.updateOnboardingSteps({
          account: this.onboardee.account,
          isCandidate: this.onboardee.isCandidate,
          steps: this.onboardingSteps
        }).then(() => {
          this.notificationService.addSuccessToast('The steps have been updated');
        })
      ]);
    }
  }

  /**
   * Return the responsible form.
   */
  get responsibleForm(): FormGroup {
    return this.responsibleAtArhsComponent.responsibleForm;
  }

  /**
   * Fetch all the steps.
   */
  fetchAllSteps() {
    this.onboardingService.getOnboardingSteps(this.onboardeeFilter).then(data => {
      this.onboardingSteps = data;
    });
  }

  /**
   * Change column to sort.
   * @param event column.
   */
  changeSort(event) {
    if (this.onboardeeFilter.sortingRow === event) {
      this.onboardeeFilter.ascending = !this.onboardeeFilter.ascending;
    } else {
      this.onboardeeFilter.sortingRow = event;
      this.onboardeeFilter.ascending = true;
    }
    this.fetchAllSteps();
  }

  /**
   * Toggle the step.
   * @param step to toggle.
   */
  toggleStep(step: OnboardingStepDto) {
    step.isStepDone = !step.isStepDone;
  }

  /**
   * Change the done status.
   * @param isDone The done status.
   */
  changeDone(isDone) {
    this.activityRadio.next(isDone);
  }

  /**
   * Change the step search value.
   * @param step - value.
   */
  changeStep(step) {
    if (step.length > 2 || step.length === 0) {
      this.fullNameInput.next(step);
    }
  }

  /**
   * Change the due date search value.
   * @param event Array of values.
   */
  changeDueDate(event) {
    this.onboardeeFilter.dueDates = event;
    this.fetchAllSteps();
  }

  /**
   * Delete a step. Make a backend call when step exists in database else just delete it
   * from the object.
   *
   * @param step to delete.
   * @param index of the column.
   */
  deleteStep(step: OnboardingStepDto, index: number) {
    if (step.id) {
      const modal = this.modalService.open(ConfirmModalComponent, {centered: true});
      modal.componentInstance.confirmationMessage = 'Are you sure that you want to delete this step ?';
      modal.componentInstance.confirmationTitle = 'Delete step';
      modal.result.then(result => {
        if (result) {
          this.onboardingService.deleteStep(step.id).then(() => {
            this.notificationService.addSuccessToast('Step deleted');
            this.onboardingSteps.splice(index, 1);
          });
        }
      });
    } else {
      this.onboardingSteps.splice(index, 1);
    }
  }

  /**
   * Add a step.
   */
  addStep() {
    this.onboardingSteps.push({
      isStepDone: false,
      step: ''
    } as OnboardingStepDto);
    this.viewportScroller.scrollToAnchor('last-item');
  }

  /**
   * Open the link in a new tab.
   * @param link to open.
   */
  goToLink(link: string) {
    window.open(link, '_blank');
  }
}
