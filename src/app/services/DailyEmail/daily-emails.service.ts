import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiInformation} from '../../utils/ApiInformation';
import {CandidateDto, DatesBetweenWrapperDto} from '../../model';


@Injectable({
  providedIn: 'root'
})
export class DailyEmailsService {

  constructor(private http: HttpClient) { }

  /**
   * Calls the service to send the daily birthdays email
   */
  sendBirthdays() {
    return this.http.get(`${ApiInformation.API_ENDPOINT}${ApiInformation.MAIL_ENDPOINT}birthday/admin`)
        .toPromise()
  }

  /**
   * Calls the service to send the new comers email
   */
  sendNewComers() {
    return this.http.get(`${ApiInformation.API_ENDPOINT}${ApiInformation.MAIL_ENDPOINT}newcomer/admin`)
        .toPromise()
  }

  /**
   * Calls the service to send the job anniversary mail
   */
  sendJobAnniversaryMail(account) {
    return this.http.get(`${ApiInformation.API_ENDPOINT}${ApiInformation.MAIL_ENDPOINT}job-anniversary/${account}`)
        .toPromise()
  }

  /**
   * Calls the service to send reminder email for contracts ending
   * @param month - yearToMonth (could be null)
   */
  sendEndContracts(month?: string) {
    const url = month ? ('/' + month) : '';
    return this.http.get(`${ApiInformation.API_ENDPOINT}${ApiInformation.MAIL_ENDPOINT}endContract/admin`  + url)
      .toPromise()
  }

  /**
   * Calls the service to send the resources eligible for SE email
   * @param month - yearToMonth (could be null)
   */
  sendResourcesEligibleForSE(month: string): Promise<any> {
    const url = month ? ('/' + month) : '';
    return this.http.get(`${ApiInformation.API_ENDPOINT}${ApiInformation.MAIL_ENDPOINT}resourcesForSE/admin` + url)
      .toPromise();
  }


  /**
   * Calls the service to send reminder email for freelancers contracts ending
   * @param monthYear - month and year
   */
  sendEndContractsFreelancers(monthYear: string) {
    return this.http.get(`${ApiInformation.API_ENDPOINT}${ApiInformation.MAIL_ENDPOINT}endContractsMailForFreeAndSubco/admin/` + monthYear)
        .toPromise()
  }

  /**
   * Calls the service to send all the welcome emails to the selected candidates
   * @param selectedCandidates - list of candidates becoming employer
   */
  sendWelcomes(selectedCandidates: string[]) {
    return this.http.post(`${ApiInformation.API_ENDPOINT}${ApiInformation.MAIL_ENDPOINT}sendWelcomeMail`, selectedCandidates)
        .toPromise()
  }

  /**
   * Calls the service to send to the INFRA team the email to create a new account
   * @param accountToCreate - account to create
   */
  sendAccountCreation(accountToCreate: CandidateDto) {
    return this.http.post(`${ApiInformation.API_ENDPOINT}${ApiInformation.MAIL_ENDPOINT}sendInfraMail`, accountToCreate)
        .toPromise()
  }

  /**
   * Calls the service to send the email to people having work permit expiring to the HRO
   */
  sendEndPermitReminder() {
    return this.http.get(`${ApiInformation.API_ENDPOINT}${ApiInformation.MAIL_ENDPOINT}workEndPermit/admin`)
        .toPromise()
  }

  /**
   * Calls the service to send the email to people having work permit expiring to the resources having a work
   * permit expiring
   */
  sendEndPermitReminderToResources() {
    return this.http.get(`${ApiInformation.API_ENDPOINT}${ApiInformation.MAIL_ENDPOINT}workEndPermit/resources`)
        .toPromise()
  }

  /**
   * Calls the service to send to the INFRA team the email to update an account
   * @param resourceToUpdate - user to update
   */
  sendResourceUpdate(resourceToUpdate: string) {
    return this.http.post(`${ApiInformation.API_ENDPOINT}${ApiInformation.MAIL_ENDPOINT}sendUpdatedResourceInfraMail`, resourceToUpdate)
        .toPromise()
  }

  /**
   * Calls the service to send the email with all the new comers arrived in the range time
   * @param dates - range time
   */
  sendNewArrivalsBetweenDates(dates: DatesBetweenWrapperDto) {
    return this.http.post(`${ApiInformation.API_ENDPOINT}${ApiInformation.MAIL_ENDPOINT}sendNewComersForDatesBetween`, dates)
        .toPromise()
  }

  /**
   * Calls the service to send the email with all the people having a birthday in the range time
   * @param dates - range time
   */
  sendBirthdayBetweenDates(dates: DatesBetweenWrapperDto) {
    return this.http.post(`${ApiInformation.API_ENDPOINT}${ApiInformation.MAIL_ENDPOINT}sendBirthdaysMailForDatesBetween`, dates)
        .toPromise()
  }

  /**
   * Calls the service to send the email to the Referee people
   * @param month - months of the year of the arrival
   */
  sendReferee(month: number) {
    return this.http.get(`${ApiInformation.API_ENDPOINT}${ApiInformation.MAIL_ENDPOINT}referralProgram/admin/` + month)
        .toPromise()
  }

  /**
   * Call the service to send the email if anyone is leaving on the chosen date.
   * @param date - date chosen.
   */
  sendEndContractChosenDate(date: any) {
    return this.http.post(`${ApiInformation.API_ENDPOINT}${ApiInformation.MAIL_ENDPOINT}endContract/chosenDate`, date)
      .toPromise();
  }

  /**
   * Sends a phone notification email to the specified account.
   * @param account the account to send the email to.
   */
  sendPhoneNotification(account: string) {
    return this.http.get(`${ApiInformation.API_ENDPOINT}${ApiInformation.MAIL_ENDPOINT}phone-notification/${account}`)
      .toPromise();
  }

  /**
   * Sends a parking notification email to the specified account.
   * @param account the account to send the email to.
   */
  sendParkingNotification(account: string) {
    return this.http.get(`${ApiInformation.API_ENDPOINT}${ApiInformation.MAIL_ENDPOINT}parking-notification/${account}`)
      .toPromise();
  }
}
