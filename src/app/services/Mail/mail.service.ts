import { Injectable } from '@angular/core';
import {ApiInformation} from '../../utils/ApiInformation';
import {
  EmailDto,
  MailDto,
  RecruiterMailDefaultRequestDto, RecruiterMailEmployeeRequestDto,
  RecruiterMailFreelanceRequestDto,
  RecruiterMailRequestDto
} from '../../model';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CacheService} from "../cache.service";

@Injectable({
  providedIn: 'root'
})
export class MailService {

  mailsSubject: Subject<any> = new Subject<any>();

  constructor(
    private httpClient: HttpClient,
    private cache: CacheService
  ) {
  }

  /**
   * Notify the mails observers.
   */
  mailsNotifier() {
    this.mailsSubject.next();
  }

  /**
   * Send the new mail information to the backend to be proceeded.
   * @param mail the mail information.
   */
  sendNewMail(mail: MailDto): Promise<MailDto> {
    return this.httpClient.post<MailDto>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.MAILS_ENDPOINT}send`,
      mail
    ).toPromise().then(
      res => {
        this.mailsNotifier();
        return Promise.resolve(res);
      }
    );
  }

  /**
   * Retrieve all the arhs mails and mails from database.
   */
  retrieveAllMails(): Promise<any> {
      return this.cache.get(`${ApiInformation.API_ENDPOINT}${ApiInformation.MAILS_ENDPOINT}`)
        .toPromise();
  }

  /**
   * Retrieve the current user email.
   */
  retrieveCurrentUserMail(): Promise<EmailDto> {
    return this.cache.get<EmailDto>(`${ApiInformation.API_ENDPOINT}${ApiInformation.MAILS_ENDPOINT}current`)
      .toPromise();
  }

  /**
   * Retrieve all the mails used for the chosen resource.
   * @param account of the resource.
   */
  retrieveAllMailsForResource(account: string): Promise<string[]> {
    return this.httpClient.get<string[]>(`${ApiInformation.API_ENDPOINT}${ApiInformation.MAILS_ENDPOINT}accounts/${account}`)
      .toPromise();
  }

  /**
   * Send the recruiter request.
   * @param recruiterRequest to send.
   */
  sendRecruiterRequest(recruiterRequest: RecruiterMailRequestDto): Promise<boolean> {
    return this.httpClient.post<boolean>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.MAILS_ENDPOINT}recruiter/request`,
      recruiterRequest
    ).toPromise();
  }

  /**
   * Send the default recruiter request.
   * @param recruiterRequest to send.
   */
  sendDefaultRecruiterRequest(recruiterRequest: RecruiterMailDefaultRequestDto): Promise<boolean> {
    return this.httpClient.post<boolean>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.MAILS_ENDPOINT}recruiter/request/default`,
      recruiterRequest
    ).toPromise();
  }

  /**
   * Send the employee recruiter request.
   * @param recruiterRequest to send.
   */
  sendEmployeeRecruiterRequest(recruiterRequest: RecruiterMailEmployeeRequestDto): Promise<boolean> {
    return this.httpClient.post<boolean>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.MAILS_ENDPOINT}recruiter/request/employee`,
      recruiterRequest
    ).toPromise();
  }

  /**
   * Send the freelance recruiter request.
   * @param recruiterRequest to send.
   */
  sendFreelanceRecruiterRequest(recruiterRequest: RecruiterMailFreelanceRequestDto): Promise<boolean> {
    return this.httpClient.post<boolean>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.MAILS_ENDPOINT}recruiter/request/freelance`,
      recruiterRequest
    ).toPromise();
  }
}
