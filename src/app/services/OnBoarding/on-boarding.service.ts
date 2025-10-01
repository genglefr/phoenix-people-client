import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ApiInformation} from '../../utils/ApiInformation';
import {
  ManagerBoardFilterDto,
  ManagerBoardResourceDto,
  OnboardingStepDto,
  OnboardingStepFilterDto,
  OnboardingStepWrapperDto,
  PageDto,
  RecruiterBoardResourceDto,
  RecruiterCandidateFilterDto,
  SRBoardColumnDto,
  SRBoardFilterDto,
  SRHiringTeamMemberDto,
  SRStatusDto,
  WebSRBoardCandidateDto
} from '../../model';

@Injectable({
  providedIn: 'root'
})
export class OnBoardingService {

  params: HttpParams;

  constructor(private http: HttpClient) { }

  /**
   * Retrieve the smart recruiter company names for the current user.
   */
  getSmartRecruiterCompanyNames(): Promise<string> {
    return this.http.get<string>(`${ApiInformation.API_ENDPOINT}${ApiInformation.ONBOARDING_ENDPOINT}companies`)
      .toPromise();
  }

  /**
   * Retrieve the smart recruiter statuses for the current user.
   */
  getSmartRecruiterStatuses(): Promise<SRStatusDto[]> {
    return this.http.get<SRStatusDto[]>(`${ApiInformation.API_ENDPOINT}${ApiInformation.ONBOARDING_ENDPOINT}statuses`)
      .toPromise();
  }

  /**
   * Retrieve the sub-statuses from the parent status.
   */
  getSubStatuses(parentName: string): Promise<SRStatusDto[]> {
    return this.http.get<SRStatusDto[]>(`${ApiInformation.API_ENDPOINT}${ApiInformation.ONBOARDING_ENDPOINT}sub-statuses/${parentName}`)
      .toPromise();
  }

  /**
   * Retrieve all the request authors.
   */
  getRequestAuthors(): Promise<string[]> {
    return this.http.get<string[]>(`${ApiInformation.API_ENDPOINT}${ApiInformation.ONBOARDING_ENDPOINT}request-authors`)
      .toPromise();
  }

  /**
   * Retrieve all the last requests display names.
   */
  getLastRequests(): Promise<string[]> {
    return this.http.get<string[]>(`${ApiInformation.API_ENDPOINT}${ApiInformation.ONBOARDING_ENDPOINT}last-requests`)
      .toPromise();
  }

  /**
   * Retrieve all the jobs.
   */
  getJobs(): Promise<string[]> {
    return this.http.get<string[]>(`${ApiInformation.API_ENDPOINT}${ApiInformation.ONBOARDING_ENDPOINT}jobs`)
      .toPromise();
  }

  /**
   * Retrieve the hiring team roles.
   */
  getHiringTeamRole(): Promise<string> {
    return this.http.get<string>(`${ApiInformation.API_ENDPOINT}${ApiInformation.ONBOARDING_ENDPOINT}hiring-roles`)
      .toPromise();
  }

  /**
   * Retrieve the hiring team members.
   */
  getHiringTeamMembers(): Promise<SRHiringTeamMemberDto[]> {
    return this.http.get<SRHiringTeamMemberDto[]>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.ONBOARDING_ENDPOINT}hiring-team/members`)
      .toPromise();
  }

  /**
   * Retrieve the job statuses.
   */
  getJobStatuses(): Promise<string> {
    return this.http.get<string>(`${ApiInformation.API_ENDPOINT}${ApiInformation.ONBOARDING_ENDPOINT}job-statuses`)
      .toPromise();
  }

  /**
   * Retrieve the board columns.
   */
  getBoardColumns(): Promise<SRBoardColumnDto[]> {
    return this.http.get<SRBoardColumnDto[]>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.ONBOARDING_ENDPOINT}kanban/columns`)
      .toPromise();
  }

  /**
   * Retrieve the candidates.
   */
  getCandidates(filter: SRBoardFilterDto): Promise<WebSRBoardCandidateDto[]> {
    return this.http.post<WebSRBoardCandidateDto[]>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.ONBOARDING_ENDPOINT}candidates`, filter)
      .toPromise();
  }

  /**
   * Update the board columns.
   */
  updateBoardColumns(boardColumns: SRBoardColumnDto[]): Promise<SRBoardColumnDto[]> {
    return this.http.post<SRBoardColumnDto[]>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.ONBOARDING_ENDPOINT}kanban/columns`, boardColumns)
      .toPromise();
  }

  /**
   * Delete the board columns
   */
  deleteBoardColumn(columnId: number): Promise<boolean> {
    return this.http.delete<boolean>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.ONBOARDING_ENDPOINT}kanban/columns/${columnId}`)
      .toPromise();
  }

  /**
   * Retrieve the resources for the manager board.
   * @param filter to filter on.
   * @param pageSize size of page.
   * @param pageIndex index of page.
   */
  getResourceForManagerBoard(filter: ManagerBoardFilterDto,
                             pageSize: number = 25,
                             pageIndex: number = 0): Promise<PageDto<ManagerBoardResourceDto>> {
    this.params = new HttpParams();
    this.params = this.params.append('pageSize', pageSize + '');
    this.params = this.params.append('pageIndex', pageIndex + '');
    return this.http.post<PageDto<ManagerBoardResourceDto>>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.ONBOARDING_ENDPOINT}manager-board/candidates`,
      filter,
      {params: this.params})
      .toPromise();
  }

  /**
   * Retrieve the resources for the manager board.
   * @param filter to filter on.
   * @param pageSize size of page.
   * @param pageIndex index of page.
   */
  getResourceForRecruiterBoard(filter: RecruiterCandidateFilterDto,
                             pageSize: number = 25,
                             pageIndex: number = 0): Promise<PageDto<RecruiterBoardResourceDto>> {
    this.params = new HttpParams();
    this.params = this.params.append('pageSize', pageSize + '');
    this.params = this.params.append('pageIndex', pageIndex + '');
    return this.http.post<PageDto<RecruiterBoardResourceDto>>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.ONBOARDING_ENDPOINT}recruiter-board/candidates`,
      filter,
      {params: this.params})
      .toPromise();
  }

  /**
   * Retrieve the resources for the manager board by id.
   * @param srCandidateId of the resource
   * @param srJobId of the resource
   */
  getResourceForRecruiterById(srCandidateId: string,
                              srJobId: string): Promise<RecruiterBoardResourceDto> {
    return this.http.get<RecruiterBoardResourceDto>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.ONBOARDING_ENDPOINT}recruiter-board/candidates/${srCandidateId}/${srJobId}`
    ).toPromise();
  }

  /**
   * Get the onboardee details.
   * @param account of the onboardee.
   */
  getOnboardeeDetails(account: string): Promise<ManagerBoardResourceDto> {
    return this.http.get<ManagerBoardResourceDto>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.ONBOARDING_ENDPOINT}candidates/${account}`
    ).toPromise();
  }

  /**
   * Update the information about the onboardee.
   * @param onboardee information.
   */
  updateOnboardeeDetails(onboardee: ManagerBoardResourceDto): Promise<ManagerBoardResourceDto> {
    return this.http.post<ManagerBoardResourceDto>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.ONBOARDING_ENDPOINT}candidates/update`,
      onboardee
    ).toPromise();
  }

  /**
   * Download the attachment from a candidate.
   * @param attachmentId of the candidate.
   */
  downloadAttachment(attachmentId: string) {
    return this.http.get(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.ONBOARDING_ENDPOINT}candidates/attachments/${attachmentId}`,
      {responseType: 'blob'})
      .toPromise();
  }

  /**
   * Get all the steps according to the filter.
   * @param filter to filter on.
   */
  getOnboardingSteps(filter: OnboardingStepFilterDto): Promise<OnboardingStepDto[]> {
    return this.http.post<OnboardingStepDto[]>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.ONBOARDING_ENDPOINT}steps`,
      filter
    ).toPromise();
  }

  /**
   * Update the onboarding steps.
   * @param wrapper containing steps and other information.
   */
  updateOnboardingSteps(wrapper: OnboardingStepWrapperDto): Promise<OnboardingStepDto[]> {
    return this.http.post<OnboardingStepDto[]>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.ONBOARDING_ENDPOINT}steps/update`,
      wrapper
    ).toPromise();
  }

  /**
   * Delete a step by its id.
   * @param id of the step.
   */
  deleteStep(id: number): Promise<boolean> {
    return this.http.delete<boolean>(`${ApiInformation.API_ENDPOINT}${ApiInformation.ONBOARDING_ENDPOINT}steps/${id}`)
      .toPromise();
  }

  /**
   * Get all values possible of due date.
   */
  getOnboardingStepDueDates(): Promise<string[]> {
    return this.http.get<string[]>(`${ApiInformation.API_ENDPOINT}${ApiInformation.ONBOARDING_ENDPOINT}steps/due-dates`)
      .toPromise();
  }

  /**
   * Download file from the server.
   * @param proposal to download
   */
  downloadProposal(proposal: any): Promise<any> {
    return this.http.post(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.ONBOARDING_ENDPOINT}proposal`,
      proposal,
      {responseType: 'blob'}
    ).toPromise();
  }
}
