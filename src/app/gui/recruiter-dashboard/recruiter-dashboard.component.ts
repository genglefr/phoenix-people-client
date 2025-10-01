import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import {
  AssetDto, CandidateDto,
  CandidateRequestAuthorDto,
  FormDataDto,
  PageDto,
  RecruiterBoardResourceDto,
  RecruiterCandidateFilterDto,
  RecruiterMailDefaultRequestDto,
  RecruiterMailRequestDto,
  SRJobLightDto,
  SRStatusDto
} from '../../model';
import { FilterService } from '../../services/Filter/filter.service';
import { MailService } from '../../services/Mail/mail.service';
import { NotificationService } from '../../services/notification.service';
import { OnBoardingService } from '../../services/OnBoarding/on-boarding.service';
import { ReferrersService } from '../../services/Referrer/referrers.service';
import { ResourceService } from '../../services/Resource/resource.service';
import { MailUtils } from '../../utils/MailUtils';
import { StringUtils } from '../../utils/StringUtils';
import { SendMailComponent } from '../modal/send-mail/send-mail.component';

@Component({
  selector: 'app-recruiter-dashboard',
  templateUrl: './recruiter-dashboard.component.html',
  styleUrls: ['./recruiter-dashboard.component.sass']
})
export class RecruiterDashboardComponent implements OnInit {

  companies: string[] = [];
  subStatuses: SRStatusDto[] = [];
  jobs: SRJobLightDto[] = [];
  lastRequests: string[] = [];
  requestAuthors: string[] = [];
  candidates: PageDto<RecruiterBoardResourceDto>;
  formData: FormDataDto;
  assets: AssetDto[];

  candidateFilter: RecruiterCandidateFilterDto = this.filterService.getRecruiterCandidateFilterDto();

  pageIndex = 0;
  pageSize = 25;

  laptopModelList: string[];

  readonly SR_JOB_DETAILS_URL = 'https://www.smartrecruiters.com/app/jobs/details/';
  readonly CANDIDATE_PATH_URL = '/usource/#/administration/candidates/';

  constructor(private route: ActivatedRoute, private filterService: FilterService,
              private onboardingService: OnBoardingService, private router: Router,
              private mailService: MailService, private modalService: NgbModal,
              private resourceService: ResourceService,
              private notificationService: NotificationService,
              private referrersService: ReferrersService) {

  }

  ngOnInit() {
    this.companies = this.route.snapshot.data['config'][0];
    this.subStatuses = this.route.snapshot.data['config'][1];
    this.jobs = this.route.snapshot.data['config'][2];
    this.lastRequests = this.route.snapshot.data['config'][3];
    this.requestAuthors = this.route.snapshot.data['config'][4];
    this.candidates = this.route.snapshot.data['candidates'][0];
    this.candidateFilter = this.route.snapshot.data['candidates'][1];
    this.formData = this.route.snapshot.data['formData'];
    this.laptopModelList = this.formData['laptopModels'].map(elt => StringUtils.trimValueIfExist(elt));
    this.assets = this.formData.hardwareAssets;
  }

  /**
   * Fetch all the onboarding resources.
   */
  fetchAllResources() {
    this.onboardingService.getResourceForRecruiterBoard(this.candidateFilter, this.pageSize, this.pageIndex).then(data => {
      this.filterService.setRecruiterCandidateFilterDto(this.candidateFilter);
      this.candidates = data;
    });
  }

  /**
   * Change the company and fetch resources.
   * @param filter the filter values.
   */
  changeCompany(filter) {
    this.candidateFilter.companies = filter;
  }

  /**
   * Change the status and fetch resources.
   * @param filter the filter values.
   */
  changeStatus(filter) {
    this.candidateFilter.statusIds = filter;
  }

  /**
   * Change the job and fetch resources.
   * @param filter the filter values.
   */
  changeJobs(filter) {
    this.candidateFilter.jobIds = filter;
  }

  /**
   * Change the last request and fetch resources.
   * @param filter the filter values.
   */
  changeLastRequest(filter) {
    this.candidateFilter.lastRequests = filter;
  }

  /**
   * Change the request author and fetch resources.
   * @param filter the filter values.
   */
  changeRequestAuthor(filter) {
    this.candidateFilter.requestAuthors = filter;
  }

  /**
   * Change column to sort
   * @param event column
   */
  changeSort(event) {
    if (this.candidateFilter.sortingRow === event) {
      this.candidateFilter.ascending = !this.candidateFilter.ascending;
    } else {
      this.candidateFilter.sortingRow = event;
      this.candidateFilter.ascending = true;
    }
    this.pageIndex = 0;
    this.fetchAllResources();
  }

  /**
   * Change page size and fetch all onboarding resources.
   */
  changePageSize() {
    this.pageIndex = 0;
    this.fetchAllResources();
  }

  /**
   * Change the index value of the page
   * @param pageIndex the new value
   */
  changePage(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.fetchAllResources();
  }

  /**
   * Navigate to the create request component.
   * @param candidate to use in request.
   */
  navigateToCreateRequest(candidate: RecruiterBoardResourceDto) {
    this.router.navigate(['/onboarding/recruiter-dashboard/create'],
      { queryParams: { srCandidateId: candidate.srCandidateId, srJobId: candidate.srJobId, fullName: candidate.fullName } });
  }

  /**
   * Open the modal with the common values.
   */
  async openUpdateOfferMailModal(candidate: RecruiterBoardResourceDto) {
    const modal = await this.openMailModal(candidate);
    modal.componentInstance.candidate = candidate;
    modal.componentInstance.defaultSubject = MailUtils.createUpdateOfferSubject(candidate.fullName);
    modal.componentInstance.defaultBody = MailUtils.createUpdateOfferBody(candidate.fullName);
    modal.componentInstance.title = MailUtils.DEFAULT_UPDATE_OFFER_TITLE;
    modal.result.then(mail => {
      if (mail) {
        const requestAuthor: CandidateRequestAuthorDto = {
          author: '',
          lastRequest: 'Update an offer',
          srCandidateId: candidate.srCandidateId,
          srJobId: candidate.srJobId
        };
        const recruiterRequest: RecruiterMailDefaultRequestDto = {
          type: 'default',
          mail: mail,
          requestAuthor: requestAuthor,
          candidateProposal: null
        };
        this.mailService.sendRecruiterRequest(recruiterRequest).then(() => {
          this.notificationService.addSuccessToast('Update offer mail sent');
          this.fetchAllResources();
        });
      }
    });
  }

  /**
   * Open the modal with the common values.
   * @param candidate to request.
   */
  async openMailModal(candidate: RecruiterBoardResourceDto) {
    const mailsInfo = await Promise.all([
      this.mailService.retrieveAllMails(),
      this.mailService.retrieveCurrentUserMail(),
      this.referrersService.getReferrers()
    ]).then(res => {
      return {
        mailList: res[0],
        currentUserMail: res[1],
        resources: res[2]
      };
    });
    const ngbModalOptions: NgbModalOptions = {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    };
    const modal = this.modalService.open(SendMailComponent, ngbModalOptions);
    const recipients = MailUtils.retrieveRecruiterMail(candidate.usourceCompany);
    recipients.cc.push(mailsInfo.currentUserMail.email);
    modal.componentInstance.selectedMails = recipients.to;
    modal.componentInstance.selectedCCMails = recipients.cc;
    modal.componentInstance.mailList = mailsInfo.mailList;
    modal.componentInstance.resourceList = mailsInfo.resources.map(res => res.name);
    modal.componentInstance.assets = this.assets;
    modal.componentInstance.formData = this.formData;
    modal.componentInstance.laptopModelList = this.formData['laptopModels'].map(elt => StringUtils.trimValueIfExist(elt));
    return modal;
  }

  /**
   * Open the mail modal with the create contract parameter.
   * @param candidate to request contract.
   */
  async openCreateContractMailModal(candidate: RecruiterBoardResourceDto) {
    const modal = await this.openMailModal(candidate);
    modal.componentInstance.defaultSubject = MailUtils.createContractSubject(candidate.fullName, candidate.usourceCompany);
    modal.componentInstance.candidate = candidate;
    modal.componentInstance.addressRequired = true;
    modal.componentInstance.commentAvailable = true;
    modal.componentInstance.referrerOption = true;
    modal.componentInstance.defaultBody = MailUtils.createCreateContractBody(candidate.fullName);
    modal.componentInstance.title = MailUtils.DEFAULT_CREATE_CONTRACT_TITLE;
    modal.componentInstance.showHardwareTab = !!candidate.rscId;
    modal.result.then(mail => {
      if (mail) {
        const requestAuthor: CandidateRequestAuthorDto = {
          author: '',
          lastRequest: 'Create a contract',
          srCandidateId: candidate.srCandidateId,
          srJobId: candidate.srJobId
        };
        const recruiterRequest: RecruiterMailRequestDto = {
          type: 'RecruiterMailRequestDto',
          mail: mail,
          requestAuthor: requestAuthor
        };
        this.mailService.sendRecruiterRequest(recruiterRequest).then(() => {
          this.notificationService.addSuccessToast('Create contract mail sent');
          this.fetchAllResources();
        });
      }
    });
  }

  /**
   * Open the mail modal with the create contract parameter.
   * @param candidate to request contract.
   */
  async openAsKWorkPermitMailModal(candidate: RecruiterBoardResourceDto) {
    const modal = await this.openMailModal(candidate);
    modal.componentInstance.defaultSubject = MailUtils.createWorkPermitSubject(candidate.fullName);
    modal.componentInstance.defaultBody = MailUtils.createAskWorkPermitBody(candidate.fullName);
    modal.componentInstance.title = MailUtils.DEFAULT_ASK_WORK_PERMIT_TITLE;
    modal.result.then(mail => {
      if (mail) {
        const requestAuthor: CandidateRequestAuthorDto = {
          author: '',
          lastRequest: 'Ask for work permit',
          srCandidateId: candidate.srCandidateId,
          srJobId: candidate.srJobId
        };
        const recruiterRequest: RecruiterMailRequestDto = {
          type: 'RecruiterMailRequestDto',
          mail: mail,
          requestAuthor: requestAuthor
        };
        this.mailService.sendRecruiterRequest(recruiterRequest).then(() => {
          this.notificationService.addSuccessToast('Create contract mail sent');
          this.fetchAllResources();
        });
      }
    });
  }

  /**
   * Open the candidate usource page for the candidatE.
   * @param candidate the candidate.
   */
  openResourceForCandidate(candidate: RecruiterBoardResourceDto) {
    const url = `${this.CANDIDATE_PATH_URL}${candidate.candidateAccount}`;

    window.open(url, '_blank');
  }

  /**
   * Search with filter applied
   */
  searchWithFilter() {
    this.changePage(0);
  }
}
