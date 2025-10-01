import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgbCalendar, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged, exhaustMap, filter, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment.prod';
import {
  CandidateDto,
  DatesBetweenWrapperDto,
  FormDataDto,
  ResourceFullNameAndAccountDto,
  ShortResourceDto
} from '../../model';
import {ActivatedRoute} from '@angular/router';
import {merge, Observable, Subject} from 'rxjs';
import {DailyEmailsService} from '../../services/DailyEmail/daily-emails.service';
import {NotificationService} from '../../services/notification.service';
import * as moment from 'moment';
import {CandidateService} from '../../services/Candidate/candidate.service';

declare const accentFold: any;

@Component({
  selector: 'app-daily-emails',
  templateUrl: './daily-emails.component.html',
  styleUrls: ['./daily-emails.component.sass']
})
export class DailyEmailsComponent implements OnInit {
  endContractMonth: string;
  endContractFreelancerMonth: string;
  accountToCreate: CandidateDto;
  resourceToUpdate: ShortResourceDto;
  jobAnniversaryResource: ResourceFullNameAndAccountDto;
  refereeMonth: number;
  resourcesEligibleForSEMonth: string;
  endContractChosenDate: any;

  scheduleManual = 'Manual';
  scheduleAuto = 'Automatic';
  scheduleAllDays = '0 0 8 * * ?';
  scheduleLastDayOfMonth = 'Last working day every month';
  scheduleFri = '0 0 8 ? * FRI';
  today = this.calendar.getToday();

  resourceUpdateForm = new FormGroup({
    'comersFromDate': new FormControl(''),
    'comersToDate': new FormControl('')
  });

  birthdayForm = new FormGroup({
    'birthDateFrom': new FormControl(''),
    'birthDateTo': new FormControl('')
  });


  candidates: CandidateDto[];
  referrers: ShortResourceDto[];
  resources: ResourceFullNameAndAccountDto[];
  clickResourceUpdate$ = new Subject<string>();
  clickResourceCreate$ = new Subject<string>();
  clickJobAnniversary$ = new Subject<string>();

  selectedCandidates: string[] = [];

  fromMinDate: { month: number; year: number; day: number };
  fromMaxDate: { month: number; year: number; day: number };
  toMinDate: { month: number; year: number; day: number };
  toMaxDate: { month: number; year: number; day: number };

  @ViewChild('resourceUpdate') instanceResourceUpdate: NgbTypeahead;
  @ViewChild('resourceCreate') instanceResourceCreate: NgbTypeahead;
  @ViewChild('jobAnniversaryResourceTh') jobAnniversaryResourceTh: NgbTypeahead;
  @ViewChild('exitButton') exitButton: ElementRef;

  callSubject = new Subject<() => Promise<any>>();

  /**
   * function of Bootstrap.
   * @param x - The text to parse.
   */
  formatter = (x: { name: string }) => `${x.name}`;

  /**
   * function of Bootstrap.
   * @param x - The text to parse.
   */
  fullNameFormatter = (x: { fullName: string }) => `${x.fullName}`;

  constructor(private route: ActivatedRoute, private calendar: NgbCalendar, private emailService: DailyEmailsService,
              private candidateService: CandidateService, private notificationService: NotificationService) {

    const now = new Date().getTime();
    const dateToSet = new Date();
    const weekMilliseconds = (1000 * 60 * 60 * 24 * 7);

    dateToSet.setTime(now - (weekMilliseconds * 4)); // 1 month before
    this.fromMinDate = {
      year: dateToSet.getFullYear(),
      month: dateToSet.getMonth() + 1,
      day: dateToSet.getDate()
    };

    dateToSet.setTime(now + weekMilliseconds); // 1 week later
    this.fromMaxDate = {
      year: dateToSet.getFullYear(),
      month: dateToSet.getMonth() + 1,
      day: dateToSet.getDate()
    };

    dateToSet.setTime(now - weekMilliseconds); // 1 week before
    this.toMinDate = {
      year: dateToSet.getFullYear(),
      month: dateToSet.getMonth() + 1,
      day: dateToSet.getDate()
    };

    dateToSet.setTime(now + (weekMilliseconds * 4)); // 1 month later
    this.toMaxDate = {
      year: dateToSet.getFullYear(),
      month: dateToSet.getMonth() + 1,
      day: dateToSet.getDate()
    };
  }

  ngOnInit() {
    const [resourcesNeedsLdap, allResources] = this.route.snapshot.data['employee'];

    this.candidates = this.route.snapshot.data['candidatesData'];
    this.candidates = this.candidates.concat(resourcesNeedsLdap.filter(elt => elt.ldapNecessary));
    this.resources = allResources;
    this.referrers = this.route.snapshot.data['referrersData'];
    this.callSubject.asObservable().pipe(
      exhaustMap(callback  => callback().catch(() => null))
    ).subscribe();
  }

  get comersFromDate() {
    return this.resourceUpdateForm.get('comersFromDate');
  }

  get comersToDate() {
    return this.resourceUpdateForm.get('comersToDate');
  }

  get birthDateFrom() {
    return this.birthdayForm.get('birthDateFrom');
  }

  get birthDateTo() {
    return this.birthdayForm.get('birthDateTo');
  }


  /**
   * Search into the list of user to update
   * @param text$ - searching text
   */
  searchUsersToUpdate = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(environment.searchInputDelay), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickResourceUpdate$.pipe(filter(() => !this.instanceResourceUpdate.isPopupOpen()));

    return merge(debouncedText$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.referrers
        : this.referrers.filter(v => (`${accentFold(v.name.toLowerCase())}`)
          .includes(accentFold(term.toLowerCase())))).slice(0, 10))
    );
  }

  /**
   * Search into the list of user to send the welcome email
   * @param text$ - searching text
   */
  searchUsersCreate = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(environment.searchInputDelay), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickResourceCreate$.pipe(filter(() => !this.instanceResourceCreate.isPopupOpen()));

    return merge(debouncedText$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.candidates
        : this.candidates.filter(v => (`${accentFold(v.name.toLowerCase())}`)
          .includes(accentFold(term.toLowerCase())))).slice(0, 10))
    );
  }

  /**
   * Search into the list of user to send the job anniversary mail
   * @param text$ - searching text
   */
  searchJobAnniversaryResource = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(environment.searchInputDelay), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickJobAnniversary$.pipe(filter(() => !this.jobAnniversaryResourceTh.isPopupOpen()));

    return merge(debouncedText$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.resources
        : this.resources.filter(v => (`${accentFold(v.fullName.toLowerCase())}`)
          .includes(accentFold(term.toLowerCase())))).slice(0, 10))
    );
  }

  /**
   * Change candidate value
   * @param list updated
   */
  changeCandidateValue(list) {
    this.selectedCandidates = list;
  }

  /**
   * Send birthday click
   */
  sendBirthdayClick() {
    this.callSubject.next(() => this.sendBirthday());
  }

  /**
   * Calls the service to send birthday email
   */
  sendBirthday() {
    return this.emailService.sendBirthdays().then(() => {
      this.notificationService.addSuccessToast('Emails sent');
    }).catch(() => {
      this.notificationService.addErrorToast('Error sending the email.');
    });
  }

  /**
   * Send new comers click
   */
  sendNewComersClick() {
    this.callSubject.next(() => this.sendNewComers());
  }

  /**
   * Calls the service to send new comers email
   */
  sendNewComers() {
    return this.emailService.sendNewComers().then(() => {
      this.notificationService.addSuccessToast('Emails sent');
    }).catch((err) => {
      this.notificationService.addErrorToast('Error sending the email.');
    });
  }

  /**
   * Send end contracts click
   */
  sendEndContractsClick() {
    this.callSubject.next(() => this.sendEndContracts());
  }

  /**
   * Calls the service to send end contracts email
   */
  sendEndContracts() {
    return this.emailService.sendEndContracts(this.endContractMonth).then(() => {
      this.notificationService.addSuccessToast('Emails sent');
    }).catch(() => {
      this.notificationService.addErrorToast('Error sending the email.');
    });
  }

  sendResourcesEligibleForSEClick() {
    this.callSubject.next(() => this.sendResourcesEligibleForSE());
  }

  /**
   * Calls the service to send the resources eligible for SE email
   */
  sendResourcesEligibleForSE() {
    return this.emailService.sendResourcesEligibleForSE(this.resourcesEligibleForSEMonth)
      .then(() => {
        this.notificationService.addSuccessToast('Email sent');
      }).catch((err) => {
      this.notificationService.addErrorToast('Error sending the email.');
    });
  }

  /**
   * Send end contracts free lancers click
   */
  sendEndContractsFreelancersClick() {
    this.callSubject.next(() => this.sendEndContractsFreelancers());
  }

  /**
   * Calls the service to send end freelancers contracts email
   */
  sendEndContractsFreelancers() {
    return this.emailService.sendEndContractsFreelancers(this.endContractFreelancerMonth).then(() => {
      this.notificationService.addSuccessToast('Emails sent');
    }).catch(() => {
      this.notificationService.addErrorToast('Error sending the email.');
    });
  }

  /**
   * Send welcomes click
   */
  sendWelcomesClick() {
    this.callSubject.next(() => this.sendWelcomes());
  }

  /**
   * Calls the service to send  welcomes emails to each candidates
   */
  sendWelcomes() {
    return this.emailService.sendWelcomes(this.selectedCandidates).then(() => {
      this.notificationService.addSuccessToast('Emails sent');
    }).catch(() => {
      this.notificationService.addErrorToast('Error sending the email.');
    });
  }

  /**
   * Send account creation click
   */
  sendAccountCreationClick() {
    this.callSubject.next(() => this.sendAccountCreation());
  }

  /**
   * Calls the service to send an email to infra to create the user
   */
  sendAccountCreation() {
    const candidateDto = this.candidates
      .find(candidate => candidate.account === this.accountToCreate.account);
    if (candidateDto) {
      return this.emailService.sendAccountCreation(candidateDto).then(() => {
        this.notificationService.addSuccessToast('Emails sent');
      });
    }
    return Promise.resolve();
  }

  /**
   * Send end permit reminder click
   */
  sendEndPermitReminderClick() {
    this.callSubject.next(() => this.sendEndPermitReminder());
  }

  /**
   * Calls the service to send the reminder email about work permission (to the HRO)
   */
  sendEndPermitReminder() {
    return this.emailService.sendEndPermitReminder().then(() => {
      this.notificationService.addSuccessToast('Emails sent');
    }).catch(() => {
      this.notificationService.addErrorToast('Error sending the email.');
    });
  }

  /**
   * Send end permit reminder to resources click
   */
  sendEndPermitReminderToResourcesClick() {
    this.callSubject.next(() => this.sendEndPermitReminderToResources());
  }

  /**
   * Calls the service to send the reminder email about work permission to all the
   * resources having a work permit expiring in few days
   */
  sendEndPermitReminderToResources() {
    return this.emailService.sendEndPermitReminderToResources().then(() => {
      this.notificationService.addSuccessToast('Emails sent');
    }).catch(() => {
      this.notificationService.addErrorToast('Error sending the email.');
    });
  }

  /**
   * Send resource updated click
   */
  sendResourceUpdateClick() {
    this.callSubject.next(() => this.sendResourceUpdate());
  }

  /**
   * Calls the service to send an email to infra to update the user
   */
  sendResourceUpdate() {
    return this.emailService.sendResourceUpdate(this.resourceToUpdate.account).then(() => {
      this.notificationService.addSuccessToast('Emails sent');
    }).catch(() => {
      this.notificationService.addErrorToast('Error sending the email.');
    });
  }

  /**
   * Send resource  job anniversary  click
   */
  sendJobAnniversaryClick() {
    this.callSubject.next(() => this.sendJobAnniversary());
  }

  /**
   * Calls the service to email job anniversary mail
   */
  sendJobAnniversary() {
    return this.emailService.sendJobAnniversaryMail(this.jobAnniversaryResource.account).then(() => {
      this.notificationService.addSuccessToast('Emails sent');
    }).catch((res) => {
      this.notificationService.addErrorToast('Error sending the email');
    });
  }

  /**
   * Send new arrivals between dates click
   */
  sendNewArrivalsBetweenDatesClick() {
    this.callSubject.next(() => this.sendNewArrivalsBetweenDates());
  }

  /**
   * Calls the service to send an email containing all the new comers in the range time
   */
  sendNewArrivalsBetweenDates() {
    if (!this.comersFromDate.value || !this.comersToDate.value) {
      this.notificationService.addErrorToast('Date format invalid.');
      return Promise.reject();
    }

     const dates: DatesBetweenWrapperDto = {
      from: moment(`${this.comersFromDate.value.day}/${this.comersFromDate.value.month}/${this.comersFromDate.value.year}`, 'DD/MM/YYYY'),
      to: moment(`${this.comersToDate.value.day}/${this.comersToDate.value.month}/${this.comersToDate.value.year}`, 'DD/MM/YYYY')
    };

    if (!dates.from.isValid() || !dates.to.isValid()) {
      this.notificationService.addErrorToast('Date format invalid.');
      return Promise.reject();
    }

    if (dates.from.isAfter(dates.to)) {
      this.notificationService.addErrorToast('Date range invalid.');
      return Promise.reject();
    }

    return this.emailService.sendNewArrivalsBetweenDates(dates).then(() => {
      this.notificationService.addSuccessToast('Emails sent');
    }).catch(() => {
      this.notificationService.addErrorToast('Error sending the email.');
    });
  }

  /**
   * Send birthday between dates click
   */
  sendBirthdayBetweenDatesClick() {
    this.callSubject.next(() => this.sendBirthdayBetweenDates());
  }

  /**
   * Calls the service to send an email containing all the birthdays in the range time
   */
  sendBirthdayBetweenDates() {
    if (!this.birthDateFrom.value || !this.birthDateTo.value) {
      this.notificationService.addErrorToast('Date format invalid.');
      return Promise.reject();
    }

    const dates: DatesBetweenWrapperDto = {
      from: moment(`${this.birthDateFrom.value.day}/${this.birthDateFrom.value.month}/${this.birthDateFrom.value.year}`, 'DD/MM/YYYY'),
    to: moment(`${this.birthDateTo.value.day}/${this.birthDateTo.value.month}/${this.birthDateTo.value.year}`, 'DD/MM/YYYY'),
    };

    if (!dates.from.isValid() || !dates.to.isValid()) {
      this.notificationService.addErrorToast('Date format invalid.');
      return Promise.reject();
    }

    if (dates.from.isAfter(dates.to)) {
      this.notificationService.addErrorToast('Date range invalid.');
      return Promise.reject();
    }

    return this.emailService.sendBirthdayBetweenDates(dates).then(() => {
      this.notificationService.addSuccessToast('Emails sent');
    }).catch(() => {
      this.notificationService.addErrorToast('Error sending the email.');
    });
  }

  /**
   * Send referee click
   */
  sendRefereeClick() {
    this.callSubject.next(() => this.sendReferee());
  }

  /**
   * Calls the service to send a remainder email to the referee program
   */
  sendReferee() {
    return this.emailService.sendReferee(this.refereeMonth).then(() => {
      this.notificationService.addSuccessToast('Emails sent');
    }).catch(() => {
      this.notificationService.addErrorToast('Error sending the email.');
    });
  }

  /**
   * Set the date for the end contract chosen date.
   * @param date the chosen date.
   */
  setEndContractChosenDate(date) {
    this.endContractChosenDate = date;
  }

  /**
   * Send end contract
   */
  sendEndContractChosenDateClick() {
    this.callSubject.next(() => this.sendEndContractChosenDate());
  }

  /**
   * Calls the service to send the end contract email.
   */
  sendEndContractChosenDate() {
    return this.emailService.sendEndContractChosenDate(moment(
      `${this.endContractChosenDate.day}/${this.endContractChosenDate.month}/${this.endContractChosenDate.year}`,
      'DD/MM/YYYY')).then(() => {
      this.notificationService.addSuccessToast('Emails sent');
    }).catch(() => {
      this.notificationService.addErrorToast('Error sending the email.');
    });
  }
}
