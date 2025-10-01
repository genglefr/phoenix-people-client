/* tslint:disable */

import {Moment} from "moment";

export interface AccessTokenDto {
    accessToken: string;
}

export interface AccountCompanyStatusDto {
    companies: string[];
    statusIds: number[];
    jobStatuses: string[];
    accountRoles: SRHiringTeamMemberDto[];
}

export interface AccountDto {
    account: string;
}

export interface AdUserDto {
    account: string;
    groups: string[];
}

export interface AdministrationCandidateFilterDto extends FilterDto {
    fullname?: string;
    status?: string[];
    companies?: string[];
    account?: string;
    startDate?: string;
    types?: string[];
    laptops?: string[];
    keyboards?: string[];
    newgraduate?: boolean;
    workPermitNecessary?: boolean;
}

export interface AdministrationResourceFilterDto extends FilterDto {
    fullname?: string;
    account?: string;
    companies?: string[];
    types?: string[];
    startDate?: string;
    endDate?: string;
    activity?: string;
}

export interface AlarmCodeDto {
    id?: number;
    floor: string;
    code?: string;
    comment?: string;
    accountList?: ResourceFullNameAndAccountDto[];
}

export interface AlarmCodeFilterDto extends FilterDto {
    floor?: string;
    code?: string;
    owner?: string;
}

export interface AnonymizeDto {
    account?: string;
    accountReplacement?: string;
    firstNameReplacement?: string;
    lastNameReplacement?: string;
}

export interface AssetDto {
    id: number;
    name: string;
    setByDefault: boolean;
}

export interface BoardResourceDto {
    firstName?: string;
    lastName?: string;
}

export interface CandidateDto extends FullResourceDto {
    status: string;
    laptopModel: string;
    keyboardModel: string;
    operatingSystem: string;
    projectAssignment: string;
    newGraduate: boolean;
    hardware: HardwareDto;
    workPermitNecessary: boolean;
}

export interface CandidateEmployeeProposalDto extends CandidateProposalDto {
    address?: string;
    jobPosition: string;
    jobTitle: string;
    rullingCategory?: string;
    isNewGraduate?: boolean;
    salary: string;
    carCategory: string;
    insurancePackage: boolean;
    mealVouchers: boolean;
    gsm: boolean;
}

export interface CandidateFreelanceProposalDto extends CandidateProposalDto {
    contractingCompany?: string;
    companyAddress?: string;
    vatNumber?: string;
    legalRepresentative?: string;
    customer?: string;
    customerContractNumber?: string;
    customerAddress?: string;
    durationWorkingDay?: string;
    price?: string;
    professionalEmailAddress?: string;
    description?: string;
}

export interface CandidateProposalDto extends ITemplateData {
    type?: string;
    firstName: string;
    lastName: string;
    gender?: string;
    isWorkPermitNecessary?: boolean;
    startDate: string;
    endDate?: string;
    referrerAccount?: string;
    referrer?: string;
    resourceType: string;
    company: string;
    manager?: string;
    inductionResponsible?: string;
    mentor?: string;
    srCandidateId: string;
    hardware: HardwareDto;
    laptopModel: string;
    keyboardModel: string;
    operatingSystem: string;
    onSite: boolean;
    isLaptopNecessary?: boolean;
}

export interface CandidateRequestAuthorDto {
    srCandidateId: string;
    srJobId: string;
    lastRequest: string;
    author: string;
}

export interface CarPolicyDto extends TemplateCertificateContentDto {
}

export interface CheckSanityDto {
    rowIndex: number;
    accountAsString: string;
    lastNameAsString: string;
    firstNameAsString: string;
    typeAsString: string;
    payrollAsString: string;
    costAsString: string;
    costValidFromAsString: string;
    companyAsString: string;
    account: string;
    lastName: string;
    firstName: string;
    type: string;
    payroll: string;
    cost: number;
    costValidFrom: Moment;
    company: string;
}

export interface ChurnDto {
    reason: string;
    comment: string;
}

export interface CompanyDto {
    company: string;
    country: string;
}

export interface ComparisResourceDto {
    resourceId: number;
    lastName: string;
    firstName: string;
    account: string;
}

export interface CountryDto {
    countryCode: string;
    countryName: string;
}

export interface CvDto {
    cvId: number;
    function: string;
    summary: string;
    specificExp: string;
    socialSkill: string;
    organisationalSkill: string;
    technicalSkill: string;
    communicationSkill: string;
    artSkill: string;
    otherSkill: string;
    itStartDate: Moment;
    changeDate: Moment;
    name: string;
    highestEducation: string;
    successfulEducationalYears: number;
    account: string;
}

export interface DatesBetweenWrapperDto {
    from: Moment;
    to: Moment;
}

export interface EmailDto {
    email: string;
}

export interface EmergencyCommentDto {
    id: number;
    resource: CurrentResourceEntity;
    comment: string;
}

export interface EmergencyContactDto {
    id: number;
    resource: CurrentResourceEntity;
    fullName?: string;
    relationship?: string;
    phoneNumber?: string;
}

export interface EmployeeCacheUpdateDto {
    name: string;
    lastName: string;
    firstName: string;
    email: string;
    account: string;
    resourceType: string;
    startDate: Moment;
    startDateAsString: string;
    endDate: Moment;
    endDateAsString: string;
    id: number;
    title: string;
    historyResource: EmployeeDto[];
    active: boolean;
    sex: string;
    overhead: boolean;
}

export interface EmployeeDto {
    email: string;
    name: string;
    lastName: string;
    firstName: string;
    account: string;
    id: number;
    resourceType: string;
    company: string;
    active: boolean;
    startDate: string;
    endDate: string;
    sex: string;
    overhead: boolean;
}

export interface EmployeeFlagDto {
    account: string;
    pictureFlag: boolean;
}

export interface EmployeePlusFilterDto {
    companies: string[];
    resourceTypes: string[];
    date: string;
}

export interface EnvelopeDto<T> {
    message: T;
}

export interface ErrorResponseDto {
    message: string;
}

export interface EvokoPinDto {
    account: string;
    update: boolean;
}

export interface EvokoProfileDto {
    name: string;
    type: string;
    pin: string;
}

export interface EvokoResponseDto {
    username: string;
    profile: EvokoProfileDto;
}

export interface FileWithDataDto {
    filename: string;
    hashedFilename?: string;
    data?: any;
}

export interface FilterDto {
    sortingRow?: string;
    ascending?: boolean;
}

export interface FormDataDto extends LightFormDataDto {
    customers: string[];
    departments: string[];
    titles: string[];
    customersContracts: string[];
    partners: string[];
}

export interface FullResourceDto extends LightResourceDto {
    resourceType: string;
    startDate: string;
    endDate: string;
    birthDate: string;
    workPermitDate: string;
    overhead: boolean;
    department: string;
    title: string;
    historizedResource: boolean;
    newResource: boolean;
    newContract: boolean;
    customerContract: string;
    partner: string;
    historyResource: FullResourceDto[];
    comment: string;
    workTimePercent: number;
    base64Picture: string;
    arhsLaptopNecessary: boolean;
    referrerId: number;
    emergencyContacts: EmergencyContactDto[];
    emergencyComment: EmergencyCommentDto;
    churn: ChurnDto;
    endProbation: string;
    securityClearanceDtoList?: SecurityClearanceDto[];
    resourcePhoneList?: ResourcePhoneDto[];
    rullingCategoryId?: number;
    rullingCategoryCategory?: string;
    accountUsed?: boolean;
    currentContract?: boolean;
    workingTime?: number;
    resouceHistoryIdLinked?: number;
    manager?: string;
    inductionResponsible?: string;
    mentor?: string;
    srCandidateId?: string;
    beaconId?: string;
    badgeDtoList?: BadgeDto[];
    badgesToDelete?: BadgeDto[];
    medicalCheck?: boolean;
    medicalCheckEndDate?: string;
    resourceId?: number;
    administrated?: boolean;
    hasReadAccess?: boolean;
    workerId?: string;
    yearlyCePool?: number;
    workPermitIssueDate?: string;
    workPermitId?: string;
    workPermitDocumentType?: string;
    residencePermitId?: string;
    residencePermitIssueDate?: string;
    residencePermitDate?: string;
    residencePermitDocumentType?: string;
    socialSecurityConsentAgreement?: boolean;
    socialSecurityNumber?: string;
    a1DeclarationStatus?: string;
    a1DeclarationExpirationDate?: string;
    limosaDeclarationStatus?: string;
    publicSshKeysYaml?: string;
    accentureMail?: string;
    partnerId?: number;
    active: boolean;
}

export interface FullResourceNoHistoryDto extends LightResourceDto {
    resourceType: string;
    startDate: string;
    endDate: string;
    birthDate: string;
    workPermitDate: string;
    overhead: boolean;
    department: string;
    title: string;
    newResource: boolean;
    newContract: boolean;
    customerContract: string;
    partner: string;
    comment: string;
    workTimePercent: number;
    base64Picture: string;
    arhsLaptopNecessary: boolean;
    referrerId: number;
    emergencyContacts: EmergencyContactDto[];
    emergencyComment: EmergencyCommentDto;
    securityClearanceDtoList: SecurityClearanceDto[];
    beaconId: string;
    endProbation: string;
    active: boolean;
}

export interface HardwareDto {
    screens: number;
    assets: AssetDto[];
    comments: string;
    hardwareRequired: boolean;
    assetList?: string;
}

export interface HardwareRequestResourceDto {
    account: string;
    name: string;
    company: string;
    startDate: string;
    endDate: string;
    deadlineDate: string;
    resourceType: string;
    arhsLaptopNecessary: boolean;
    laptopModel: string;
    keyboardModel: string;
    operatingSystem: string;
    hardware: HardwareDto;
}

export interface HolarisEmployeeDto extends EmployeeCacheUpdateDto {
    company: ECompany;
    companyAsString: string;
    comment?: string;
    actionAccount: string;
}

export interface HolarisRequestDto {
    id: number;
    from: number;
    halfDayFrom: boolean;
    to: number;
    halfDayTo: boolean;
    status: string;
    type: string;
    fromLD: LocalDate;
    toLD: LocalDate;
}

export interface HomePagePreferencesDto {
    name: string;
    displayName: string;
    url: string;
}

export interface JobAnniversaryDto extends LightResourceDto {
    totalYears: number;
}

export interface JobPositionDto {
    name: string;
    domain: string;
    orderRank: number;
    domainOrderRank: number;
}

export interface LDAPResourceDto {
    lastName: string;
    firstName: string;
    account: string;
    mobilePhone: string;
    landLinePhone: string;
    company: string;
    jobPosition: string;
    title: string;
    email: string;
    ldapNecessary: boolean;
    uuid: string;
}

export interface LaptopKeyboardDto {
    laptopName: string;
    keyboardName: string;
    linkType: EDefaultLaptopCompanyType;
    onSiteType: EDefaultLaptopOnSiteType;
}

export interface LeavingOrCancelledResourceDto {
    account: string;
    lastName: string;
    firstName: string;
    company: string;
    resourceType: string;
}

export interface LeavingResourceDto {
    name: string;
    account: string;
    resourceType: string;
    endDate: string;
    company: string;
    arhsLaptopNecessary: boolean;
    contract: string;
}

export interface LightFormDataDto {
    jobpositions: JobPositionDto[];
    jobtypes: WrapperEJobTypeDto[];
    candidateStates: WrapperECandidateStatusDto[];
    companies: string[];
    laptopModels: string[];
    keyboardModels: string[];
    operatingSystems: string[];
    hardwareAssets: AssetDto[];
    securityLevels: ESecurityLevel[];
    rullingCategoryDtoList: RullingCategoryDto[];
}

export interface LightResourceDto {
    account: string;
    lastName: string;
    firstName: string;
    company: string;
    jobPosition: string;
    jobTitle: string;
    name: string;
    mobilePhone: string;
    landLinePhone: string;
    customerName: string;
    customerEmail: string;
    instantMessagingAddress: string;
    professionalMail: string;
    email: string;
    birthSend: boolean;
    showJobAnniversary: boolean;
    usePicture: boolean;
    nationality: string;
    residentialCountry: string;
    sex: string;
    inHoliday: boolean;
    color: string;
    resourceUuid: string;
    ldapNecessary: boolean;
    id: number;
}

export interface LightResourceInfoDto {
    fullName: string;
    account: string;
    active: boolean;
}

export interface MailDto {
    fromMail: string;
    toMails: EmailDto[];
    ccMails: EmailDto[];
    bccMails: EmailDto[];
    subject: string;
    body: string;
    attachments: FileWithDataDto[];
    candidateProposalDtoList?: CandidateProposalDtoUnion[];
}

export interface ManagerBoardFilterDto extends FilterDto {
    search?: string;
    resourceTypes: string[];
    status: EOnboardingStatus;
    account?: string;
}

export interface ManagerBoardResourceDto extends BoardResourceDto {
    account: string;
    fullName: string;
    startDate: string;
    endDate: string;
    resourceType: string;
    jobPosition: string;
    jobTitle: string;
    status: string;
    srCandidateId: string;
    company?: string;
    inductionResponsible?: string;
    mentor?: string;
    referrer?: string;
    attachments?: SRCandidateAttachmentDto[];
    isCandidate?: boolean;
}

export interface MissingCostIncorrectDateDto {
    account: string;
    lastName: string;
    firstName: string;
    type: string;
    company: string;
    startDate: Moment;
    endDate: Moment;
    timesheetMandatory: boolean;
    missingCostEntry: boolean;
    incorrectDateInCostTable: boolean;
    hadMultipleContracts: string;
}

export interface NamedOidcUserDto extends DefaultOidcUser {
    username: string;
    entitiesAccessibleThroughEva: string[];
}

export interface OnboardingStepDto {
    id: number;
    step: string;
    dueDate: string;
    note: string;
    isStepDone: boolean;
    link: string;
    rscId?: number;
    candidateId?: number;
}

export interface OnboardingStepFilterDto extends FilterDto {
    stepSearch: string;
    stepDone: EOnboardingStepDone;
    dueDates: string[];
    account: string;
    isCandidate: boolean;
    rscId?: number;
}

export interface OnboardingStepWrapperDto {
    steps: OnboardingStepDto[];
    account: string;
    isCandidate: boolean;
}

export interface OwnerDto {
    id?: number;
    ownerPhoneId?: number;
    account: string;
    fullName: string;
    candidate: boolean;
}

export interface PageCandidateDto {
    id: number;
    lastName: string;
    firstName: string;
    account: string;
    status: string;
    company: string;
    startDate: string;
    laptopModel: string;
    keyboardModel: string;
    newGraduate: boolean;
    name: string;
    resourceType: string;
    color: string;
    checked: boolean;
    workPermitNecessary: boolean;
    administrated: boolean;
    residentialCountry: string;
}

export interface PageDto<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    first: boolean;
    last: boolean;
}

export interface PageResourceDto {
    id: number;
    account: string;
    lastName: string;
    firstName: string;
    company: string;
    resourceType: string;
    name: string;
    startDate: string;
    endDate: string;
    color: string;
    jobPosition: string;
    jobTitle: string;
    email: string;
    mobilePhone: string;
    landLinePhone: string;
    inHoliday: boolean;
    resourceUuid: string;
    active: boolean;
}

export interface PartnerDto {
    partnerId?: number;
    legalName: string;
    type?: string;
    contactName?: string;
    contactFirstName?: string;
    contactBusinessTitle?: string;
    contactEmail?: string;
    companyEstablishmentCountry?: string;
    plannedAmount?: string;
    anticorruptionProcessType?: string;
    anticorruptionStatus?: string;
    contractingPartnerStaffingAgency?: string;
    contractingAgencyName?: string;
    remarks?: string;
    resourceAccounts?: string[];
    countriesOfExecution?: string[]
}

export interface PartnerFilterDto extends FilterDto {
    legalName?: string;
    type?: string;
    resourceName?: string;
    account?: string;
    active?: boolean;
}

export interface PartnerTableDto {
    legalName: string;
    type: string;
    resources: LightResourceInfoDto[];
    partnerId: number;
}

export interface PartnerWithResourcesDto {
    jobPartner: string;
    resourceDtos: LightResourceDto[];
}

export interface PreferencesListDto {
    homepagePreferences: HomePagePreferencesDto[];
    companyDtos: CompanyDto[];
}

export interface PublicHolidayDto {
    id: number;
    name: string;
    year: number;
    month: number;
    day: number;
    company: CompanyDto;
}

export interface PublicSSHKeysDto {
    account: string;
    arhsEmail: string;
    accentureEmail: string;
    sshPublicKeys: any;
}

export interface RecruiterBoardResourceDto extends BoardResourceDto {
    rscId?: number;
    fullName: string;
    company: string;
    usourceCompany: string;
    srCandidateId: string;
    srJobId: string;
    jobTitle: string;
    subStatus: string;
    lastRequest: string;
    requestAuthor: string;
    candidateAccount?: string;
    hardware?: HardwareDto;
    laptopModel?: string;
    keyboardModel?: string;
    operatingSystem?: string;
    ecompany: ECompany;
    isBelgianEntity: boolean;
}

export interface RecruiterCandidateFilterDto {
    fullNameSearch?: string;
    companies?: string[];
    statusIds?: number[];
    jobIds?: number[];
    lastRequests?: string[];
    requestAuthors?: string[];
    sortingRow?: string;
    ascending?: boolean;
}

export interface RecruiterMailDefaultRequestDto extends RecruiterMailRequestDto {
    candidateProposal: CandidateProposalDtoUnion;
}

export interface RecruiterMailEmployeeRequestDto extends RecruiterMailRequestDto {
    employeeProposal: CandidateEmployeeProposalDto;
}

export interface RecruiterMailFreelanceRequestDto extends RecruiterMailRequestDto {
    freelanceProposal: CandidateFreelanceProposalDto;
}

export interface RecruiterMailRequestDto extends IRequestMail {
    type: string;
    mail: MailDto;
    requestAuthor: CandidateRequestAuthorDto;
}

export interface ReferralProgramDetailsDto {
    resourceName: string;
    startDate: string;
    typeResource: string;
    referrerName: string;
    entity: string;
}

export interface ReferredDto {
    id: number;
    referredName: string;
    referredAccount: string;
    referrerName: string;
    referrerAccount: string;
    company: string;
    color: string;
    type: string;
    status: string;
}

export interface ReferredFilterDto extends FilterDto {
    referredName?: string;
    referrerName?: string;
    companies?: string[];
    types?: string[];
    status?: string;
}

export interface RefreshTokenDto {
    refreshToken: string;
    expirationDate: Moment;
}

export interface ResourceFilterDto extends FilterDto {
    fullSearch?: string;
    companies?: string[];
}

export interface ResourceFullNameAndAccountDto {
    account: string;
    lastName: string;
    firstName: string;
    fullName: string;
    id: number;
    candidate: boolean;
}

export interface ResourceHistoryDto {
    resourceId: number;
    resourceHistoryId: number;
    startDate: string;
    endDate: string;
    company: string;
    typeResource: string;
}

export interface ResourcePictureDto {
    account: string;
    base64Picture: string;
    filename: string;
}

export interface ResourceReferralDto {
    id: number;
    tempResourceId: number;
    currentResourceId: number;
    referrerId: number;
    name: string;
    referrerName: string;
}

export interface RullingCategoryDto {
    id: number;
    category: string;
}

export interface SRBoardColumnDto {
    id?: number;
    columnName: string;
    order: number;
    statuses: number[];
}

export interface SRBoardFilterDto {
    fullSearch?: string;
    companies?: string[];
    statuses?: string[];
    hiringTeamMembers?: SRHiringTeamMemberDto[];
}

export interface SRCandidateAttachmentDto {
    id: string;
    name: string;
    contentType: string;
    type: string;
}

export interface SRHiringTeamMemberDto {
    account: string;
    fullName: string;
    roles: string[];
    memberRoles: SRHiringTeamRoleDto[];
}

export interface SRHiringTeamRoleDto {
    role: EHiringTeamRole;
}

export interface SRJobLightDto {
    id: number;
    srJobId: string;
    title: string;
}

export interface SRStatusDto {
    status: string;
    hiringProcess: string;
    id: number;
    subStatuses: SRStatusDto[];
}

export interface SecurityClearanceDto {
    id: number;
    organization: string;
    securityLevel: ESecurityLevel;
    checked: boolean;
}

export interface SeniorityWithContractDateDto extends JobAnniversaryDto {
    contractDate: string;
    endDate: string;
}

export interface SeniorityWithGapDto extends SeniorityWithContractDateDto {
    withGap: boolean;
}

export interface ShortResourceDto {
    id: number;
    account: string;
    name: string;
    sex: string;
    picture: any;
    company: string;
    birthdate: string;
    jobPosition: string;
}

export interface TemplateCertificateContentDto extends ITemplateData {
    firstName: string;
    lastName: string;
    startDate: string;
    endDate: string;
    managingDirector?: string;
    companyLogo: string;
    companyLegalName: string;
    street: string;
    postCode: string;
    city: string;
    tel: string;
    fax: string;
    vatNumber: string;
    tradeNumber: string;
    bankAccount: string;
    website: string;
}

export interface TimesheetEmployeeDto extends EmployeeCacheUpdateDto {
    company: string;
}

export interface UpdateAccountDto {
    oldAccount: string;
    newAccount: string;
}

export interface UserAppDto extends User {
    entitiesAccessibleThroughEva: string[];
}

export interface UserPreferencesDto {
    homePagePreferencesDto: HomePagePreferencesDto;
    companyDto: CompanyDto[];
}

export interface WebCompanyDto {
    id: number;
    companyName: string;
    phoneNumber: string;
    faxNumber: string;
    email: string;
    address: string;
    postalCode: string;
    city: string;
    vatCode: string;
    country: string;
}

export interface WebSRBoardCandidateDto extends BoardResourceDto {
    candidateId: string;
    email: string;
    createdOn: Moment;
    updatedOn: Moment;
    jobId: string;
    jobTitle: string;
    company: string;
    status: string;
    subStatus: string;
    jobStatus: string;
    hiringTeamRole: string;
    hiringProcess: string;
}

export interface WebSRCandidateDto {
    email: string;
    company: string;
    status: string;
    sr_candidate_id: string;
    last_name: string;
    first_name: string;
    created_on: Moment;
    updated_on: Moment;
    sr_job_id: string;
    title: string;
    sub_status: string;
    job_status: string;
    hiring_team_role: string;
    hiring_process: string;
    last_request: string;
    request_author: string;
    is_belgian_entity: boolean;
}

export interface WebStatusDto {
    id: number;
    status: string;
    parent: number;
    hiring_process: string;
}

export interface WhoIsWhoResourceDto {
    lastName: string;
    firstName: string;
    account: string;
    company: string;
    jobPosition: string;
    jobTitle: string;
    email: string;
    inHoliday: boolean;
    color: string;
    mobilePhone: string;
    landLinePhone: string;
    instantMessagingAddress: string;
    resourceUuid: string;
    languages: string;
}

export interface WorkingCertificateDto extends TemplateCertificateContentDto {
    jobPosition: string;
    birthDate?: string;
    templatePath: string;
    currentDate: string;
    gender?: boolean;
    managingDirectorGender: boolean;
}

export interface WorkingRemoteDto {
    countryCode: string;
    countryLabel: string;
    remoteDays: number;
    orderRank: number;
}

export interface WrapperECandidateStatusDto {
    status: string;
    description: string;
    sortWeight: number;
}

export interface WrapperEJobTypeDto {
    jobType: string;
    description: string;
}

export interface WrapperProposalDto {
    mailDto: MailDto;
    proposalDto: CandidateProposalDtoUnion;
    request: string;
    offerMail: boolean;
}

export interface AccessTypeDto {
    id: number;
    accessType: string;
    ticketCreation: boolean;
    jiraId: string;
}

export interface BadgeAccessDto {
    badgeNumber: string;
    accessTypes: string[];
}

export interface BadgeDto {
    id?: number;
    badgeNumber: string;
    resource: ResourceFullNameAndAccountDto;
    accessTypes?: string[];
    accessTypesAsString: string;
    comment?: string;
    company?: string;
    returnDate?: string;
    attributionDate?: string;
    administrated?: boolean;
}

export interface BadgeFilterDto extends FilterDto {
    badgeNumber?: string;
    owner?: string;
    accessTypes?: string[];
    comment?: string;
    additionalSpecification?: Specification<BadgeEntity>;
}

export interface BadgeHistoryDto extends BadgeDto {
    revisionDate?: string;
    revisionUser?: string;
    revisionTimestamp?: number;
}

export interface BadgeHistoryFilterDto extends FilterDto {
    badgeId: number;
}

export interface BadgeTicketDto {
    printerMessage: string;
    commentMessage: string;
    accessTypeDtoList: AccessTypeDto[];
}

export interface LightBadgeDto {
    id?: number;
    badgeNumber: string;
    accessTypes?: string[];
    comment?: string;
}

export interface PendingResourceDto {
    id: number;
    account: string;
    lastName: string;
    firstName: string;
    company: string;
    resourceType: string;
    startDate: string;
    endDate: string;
    department: string;
    title: string;
    jobPosition: string;
    mobilePhone: string;
    landLinePhone: string;
    email: string;
    type: string;
    keyboard: string;
    laptop: string;
    os: string;
    screens: number;
    hardware: string;
    comments: string;
    fullName: string;
}

export interface PendingResourceFilterDto extends FilterDto {
    account?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    companies?: string[];
    resourceType?: string;
    startDate?: string;
    endDate?: string;
    title?: string;
    jobPosition?: string;
    type?: string;
    resourceFilterOption?: EResourceFilterOption;
    status?: EDisabledResourceStatus;
    excludedResourceAccount: string[];
    companiesRoles: string[];
    admin: boolean;
}

export interface ResourceToDisableDto extends PendingResourceDto {
    status: string;
}

export interface NaosResourceDto {
    firstName: string;
    lastName: string;
    account: string;
    mail: string;
    beaconId: string;
    pictureUrl: string;
}

export interface AverageExtractDto {
    account: string;
    average: number;
}

export interface ConsumptionDto {
    rowIndex: number;
    invoiceDate: Moment;
    phoneNumber: string;
    subscriberName: string;
    description: string;
    priceVATExcludedAsString: string;
    vatAmountAsString: string;
}

export interface FileConsumptionImportDto {
    fileConsumptionId: number;
    createdOn: Moment;
    fileName: string;
    finishedOn: Moment;
    status: EFileConsumptionStatus;
}

export interface FileConsumptionImportFilterDto extends FilterDto {
    fileConsumptionId?: number;
    fileName?: string;
    createdOn?: string;
    finishedOn?: string;
    status?: string;
}

export interface PhoneConsumptionCostFilterDto {
    companyList: string[];
}

export interface PhoneConsumptionDto {
    resourcePhone: ResourcePhoneDto;
    phoneNumber: string;
    subscriberName?: string;
    resourceName?: string;
    resourceAccount?: string;
    resourceMail?: string;
    period: string;
    invoiceDate: string;
    amountVATIncluded: number;
    amountVATExcluded: number;
    description?: string;
    status: EPhoneConsumptionStatus;
}

export interface PhoneConsumptionFilterDto extends FilterDto {
    resourceName?: string;
    phoneNumber?: string;
    subscriberName?: string;
    companies?: string[];
    periods?: string[];
    phoneConsumptionStatus?: EPhoneConsumptionStatus;
    invoiceDate?: string;
    amountExclVat?: string;
    amountInclVat?: string;
}

export interface PhoneDto {
    phoneId: number;
    phoneModel: string;
    phoneImei: string;
    serialNumber: string;
}

export interface PhoneFilterDto extends FilterDto {
    phoneId?: number;
    ownerId?: number;
    isCandidate?: boolean;
    name?: string;
    account?: string;
    phoneNumber?: string;
    phoneModel?: string;
    phoneImei?: string;
    serialNumber?: string;
    receptionDate?: string;
    phoneComment?: string;
}

export interface PhoneFixedCostDto {
    id: number;
    period: string;
    companyDto: CompanyDto;
    fixedCost: number;
}

export interface PhoneFixedCostFilterDto extends FilterDto {
    companies?: string[];
    periods?: string[];
}

export interface PhoneOwnerDto {
    owner: OwnerDto;
    resourcePhoneDto: ResourcePhoneDto;
}

export interface ResourcePhoneDto {
    resourcePhoneId: number;
    phone?: PhoneDto;
    phoneNumber?: string;
    receptionDate: string;
    comment?: string;
}

export interface WrapperAccountPeriodDto {
    account: string;
    period: string;
    amount: number;
}

export interface TemplateDto<T> {
    pathToTemplate: string;
    extension: string;
    data: T;
    keyValueObjectList: WrapperEJobTypeDto[];
}

export interface ITemplateData {
}

export interface CurrentResourceEntity extends ResourceEntity {
    id: number;
    historyEntityList: HistorisedResourceEntity[];
    temporaryMailingEntityList: TemporaryMailingEntity[];
    arhsLaptopNecessary: boolean;
    resourceReferral: ResourceReferralEntity;
    resourceReferrals: ResourceReferralEntity[];
    emergencyContacts: EmergencyContactEntity[];
    emergencyComment: EmergencyCommentEntity;
    resourceUuid: ResourceUuidEntity;
    rullingCategory: RullingCategoryEntity;
    resouceHistoryIdLinked: number;
    inductionResponsible: string;
    mentor: string;
    srCandidateId: string;
    onboardingStep: OnboardingStepEntity[];
    beaconId: string;
    workerId: string;
    yearlyCePool: number;
    socialSecurityConsentAgreement: boolean;
    socialSecurityNumber: string;
    a1DeclarationStatus: string;
    a1DeclarationExpirationDate: string;
    limosaDeclarationStatus: string;
    publicSshKeysYaml: string;
    accentureMail: string;
    partnerEntity: PartnerEntity;
}

export interface LocalDate extends BaseLocal, ReadablePartial {
    year: number;
    dayOfMonth: number;
    dayOfWeek: number;
    dayOfYear: number;
    era: number;
    weekOfWeekyear: number;
    centuryOfEra: number;
    yearOfCentury: number;
    yearOfEra: number;
    weekyear: number;
    monthOfYear: number;
}

export interface GrantedAuthority {
    authority: string;
}

export interface OidcIdToken extends AbstractOAuth2Token, IdTokenClaimAccessor {
}

export interface OidcUserInfo extends StandardClaimAccessor {
}

export interface URL {
}

export interface AddressStandardClaim {
    country: string;
    region: string;
    locality: string;
    postalCode: string;
    formatted: string;
    streetAddress: string;
}

export interface DefaultOidcUser extends DefaultOAuth2User, OidcUser {
}

export interface IRequestMail {
}

export interface User extends UserDetails, CredentialsContainer {
}

export interface Specification<T> {
}

export interface BadgeEntity {
    id: number;
    number: string;
    comment: string;
    returnDate: Moment;
    attributionDate: Moment;
    accessTypes: BadgeAccessTypeEntity[];
    badgeResourceEntity: BadgeResourceEntity;
    badgeTempResourceEntity: BadgeTempResourceEntity;
    resourceHistoryEntities: BadgeResourceHistoryEntity[];
    badgeTempResourceHistoryEntities: BadgeTempResourceHistoryEntity[];
    badgeAccessHistoryEntityList: BadgeAccessHistoryEntity[];
}

export interface HistorisedResourceEntity extends ResourceEntity {
    id: number;
    arhsLaptopNecessary: boolean;
    churnEntity: ChurnEntity;
    rullingCategory: RullingCategoryEntity;
    socialSecurityConsentAgreement: boolean;
    socialSecurityNumber: string;
    a1DeclarationStatus: string;
    a1DeclarationExpirationDate: string;
    limosaDeclarationStatus: string;
    currentContract: boolean;
}

export interface TemporaryMailingEntity {
    temporaryMailingId: number;
    isSent: boolean;
    resource: CurrentResourceEntity;
}

export interface ResourceReferralEntity {
    id: number;
}

export interface EmergencyContactEntity {
    id: number;
    fullName: string;
    relantionship: string;
    phoneNumber: string;
}

export interface EmergencyCommentEntity {
    id: number;
    resource: CurrentResourceEntity;
    comment: string;
}

export interface ResourceUuidEntity {
    resourceUuid: string;
}

export interface RullingCategoryEntity {
    id: number;
    category: string;
}

export interface OnboardingStepEntity {
    id: number;
    step: string;
    dueDate: string;
    note: string;
    isStepDone: boolean;
    link: string;
    rsc: CurrentResourceEntity;
    candidate: CandidateEntity;
}

export interface PartnerEntity {
    partnerId: number;
    legalName: string;
    type: string;
    contactName: string;
    contactFirstName: string;
    contactBusinessTitle: string;
    contactEmail: string;
    companyEstablishmentCountry: string;
    plannedAmount: string;
    anticorruptionProcessType: string;
    anticorruptionStatus: string;
    contractingPartnerStaffingAgency: string;
    contractingAgencyName: string;
    remarks: string;
    executionCountries: PartnerExecutionCountryEntity[];
    resources: CurrentResourceEntity[];
}

export interface ResourceEntity {
    firstName: string;
    lastName: string;
    typeResource: string;
    account: string;
    startDate: Moment;
    endDate: Moment;
    resourceOverhead: boolean;
    sex: string;
    nationality: string;
    company: string;
    department: string;
    title: string;
    loadingDate: Moment;
    birthDate: Moment;
    instantMessagingAddress: string;
    customerName: string;
    customerEmail: string;
    mobilePhone: string;
    landLinePhone: string;
    professionalMail: string;
    lastModificationDate: Moment;
    jobPosition: string;
    workPermitDate: Moment;
    customerContract: string;
    partner: string;
    comment: string;
    workTimePercent: number;
    ldapNecessary: boolean;
    workingTime: number;
    manager: string;
    medicalCheckup: boolean;
    medicalCheckupDate: Moment;
    email: string;
    endProbation: Moment;
    residentialCountry: string;
    workPermitIssueDate: Moment;
    workPermitId: string;
    workPermitDocumentType: string;
    residencePermitId: string;
    residencePermitIssueDate: Moment;
    residencePermitDate: Moment;
    residencePermitDocumentType: string;
}

export interface Chronology {
    zone: DateTimeZone;
}

export interface DateTimeField {
    name: string;
    type: DateTimeFieldType;
    supported: boolean;
    lenient: boolean;
    rangeDurationField: DurationField;
    leapDurationField: DurationField;
    durationField: DurationField;
    maximumValue: number;
    minimumValue: number;
}

export interface DateTimeFieldType {
    name: string;
    rangeDurationType: DurationFieldType;
    durationType: DurationFieldType;
}

export interface BaseLocal extends AbstractPartial {
}

export interface ReadablePartial extends Comparable<ReadablePartial> {
    chronology: Chronology;
}

export interface AbstractOAuth2Token {
    tokenValue: string;
    issuedAt: Date;
    expiresAt: Date;
}

export interface IdTokenClaimAccessor extends StandardClaimAccessor {
    issuer: URL;
    authenticationMethods: string[];
    authorizationCodeHash: string;
    authenticationContextClass: string;
    expiresAt: Date;
    authenticatedAt: Date;
    authorizedParty: string;
    issuedAt: Date;
    audience: string[];
    accessTokenHash: string;
    nonce: string;
}

export interface StandardClaimAccessor extends ClaimAccessor {
    address: AddressStandardClaim;
    locale: string;
    fullName: string;
    zoneInfo: string;
    givenName: string;
    subject: string;
    email: string;
    phoneNumberVerified: boolean;
    preferredUsername: string;
    gender: string;
    website: string;
    phoneNumber: string;
    profile: string;
    familyName: string;
    middleName: string;
    picture: string;
    updatedAt: Date;
    emailVerified: boolean;
    nickName: string;
    birthdate: string;
}

export interface DefaultOAuth2User extends OAuth2User {
}

export interface OidcUser extends OAuth2User, IdTokenClaimAccessor {
    userInfo: OidcUserInfo;
    idToken: OidcIdToken;
}

export interface UserDetails {
    enabled: boolean;
    username: string;
    authorities: GrantedAuthority[];
    credentialsNonExpired: boolean;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    password: string;
}

export interface CredentialsContainer {
}

export interface BadgeAccessTypeEntity {
    id: number;
    badge: BadgeEntity;
    accessType: AccessTypeEntity;
}

export interface BadgeResourceEntity {
    id: number;
    badge: BadgeEntity;
    resource: CurrentResourceEntity;
}

export interface BadgeTempResourceEntity {
    id: number;
    badge: BadgeEntity;
    candidate: CandidateEntity;
}

export interface BadgeResourceHistoryEntity {
    id: number;
    rev: number;
    resource: CurrentResourceEntity;
    badgeEntity: BadgeEntity;
    revisionType: RevisionType;
    revision: RevisionUserEntity;
}

export interface BadgeTempResourceHistoryEntity {
    id: number;
    rev: number;
    candidateEntity: CandidateEntity;
    badgeEntity: BadgeEntity;
    revisionType: RevisionType;
    revision: RevisionUserEntity;
}

export interface BadgeAccessHistoryEntity {
    id: number;
    rev: number;
    revisionType: RevisionType;
    badgeEntity: BadgeEntity;
    revision: RevisionUserEntity;
    accessType: AccessTypeEntity;
}

export interface ChurnEntity {
    candidateId: number;
    reason: string;
    comments: string;
    updated: Moment;
    resourceEntity: HistorisedResourceEntity;
}

export interface CandidateEntity extends ResourceEntity {
    id: number;
    status: ECandidateStatus;
    laptopModel: LaptopModelEntity;
    keyboardModel: KeyboardModelEntity;
    operatingSystem: EOperatingSystem;
    projectAssignment: string;
    newGraduate: boolean;
    resourceReferral: ResourceReferralEntity;
    hardwareEntity: HardwareEntity;
    churnEntity: ChurnCandidateEntity;
    inductionResponsible: string;
    mentor: string;
    srCandidateId: string;
    onboardingStep: OnboardingStepEntity[];
    rullingCategoryId: number;
    workPermitNecessary: boolean;
    socialSecurityConsentAgreement: boolean;
    socialSecurityNumber: string;
}

export interface PartnerExecutionCountryEntity {
    id: number;
    executionCountry: string;
    partner: PartnerEntity;
}

export interface DateTimeZone {
    id: string;
    fixed: boolean;
}

export interface DurationField extends Comparable<DurationField> {
    name: string;
    type: DurationFieldType;
    supported: boolean;
    unitMillis: number;
    precise: boolean;
}

export interface DurationFieldType {
    name: string;
}

export interface AbstractPartial extends ReadablePartial, Comparable<ReadablePartial> {
    fields: DateTimeField[];
    fieldTypes: DateTimeFieldType[];
    values: number[];
}

export interface ClaimAccessor {
    claims: any;
}

export interface OAuth2User extends OAuth2AuthenticatedPrincipal {
}

export interface AccessTypeEntity {
    id: number;
    accessType: string;
    ticketCreation: boolean;
    jiraId: string;
}

export interface RevisionUserEntity extends DefaultRevisionEntity {
    username: string;
}

export interface LaptopModelEntity {
    laptopModelId: number;
    name: string;
}

export interface KeyboardModelEntity {
    keyboardModelId: number;
    name: string;
}

export interface HardwareEntity {
    candidateId: number;
    screens: number;
    hardwareRequired: string;
    comments: string;
    updated: Moment;
    candidateEntity: CandidateEntity;
    assets: AssetsEntity[];
}

export interface ChurnCandidateEntity {
    candidateId: number;
    reason: string;
    comments: string;
    updated: Moment;
    candidateEntity: CandidateEntity;
}

export interface Comparable<T> {
}

export interface OAuth2AuthenticatedPrincipal extends AuthenticatedPrincipal {
    attributes: any;
    authorities: GrantedAuthority[];
}

export interface DefaultRevisionEntity {
    id: number;
    timestamp: number;
    revisionDate: Moment;
}

export interface AssetsEntity {
    id: number;
    name: string;
    setByDefault: boolean;
    jiraId: number;
}

export interface AuthenticatedPrincipal {
    name: string;
}

export type ESecurityLevel = 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET' | 'ATOMAL' | 'ATOMIC';

export type ECompany = 'COMPANY_PHOENIX_LUX' | 'COMPANY_PHOENIX_BELGIUM' | 'COMPANY_PHOENIX_BULGARIA' | 'COMPANY_PHOENIX_HELLAS';

export type EDefaultLaptopCompanyType = 'DEFAULT' | 'OPTIONAL';

export type EDefaultLaptopOnSiteType = 'BOTH' | 'OFF_SITE' | 'ON_SITE';

export type EOnboardingStatus = 'ALL' | 'ACTIVE' | 'NOT_STARTED';

export type EOnboardingStepDone = 'ALL' | 'YES' | 'NO';

export type EHiringTeamRole = 'RECRUITER' | 'COORDINATOR' | 'EXECUTIVE' | 'HIRING_MANAGER' | 'INTERVIEW_TEAM';

export type EResourceFilterOption = 'ALL' | 'TO_DISABLE' | 'TO_REMOVE' | 'TO_CREATE';

export type EDisabledResourceStatus = 'ACTIVE' | 'INACTIVE' | 'EXCLUDED';

export type EFileConsumptionStatus = 'TODO' | 'ONGOING' | 'DONE' | 'FAILED';

export type EPhoneConsumptionStatus = 'SUCCESS' | 'FAILED';

export type RevisionType = 'ADD' | 'MOD' | 'DEL';

export type ECandidateStatus = 'PROPAL_SENT' | 'PROPAL_ACCEPTED' | 'PROPAL_REFUSED' | 'CONTRACT_DONE' | 'CONTRACT_SIGNED' | 'WAITING_WORK_PERMIT' | 'RECEIVED_WORK_PERMIT' | 'WAITING_BLUE_CARD' | 'RECEIVED_BLUE_CARD' | 'ARCHIVED' | 'NO_STATUS';

export type EOperatingSystem = 'NONE' | 'DEFAULT' | 'LINUX';

export type CandidateProposalDtoUnion = CandidateEmployeeProposalDto | CandidateFreelanceProposalDto;

export type RecruiterMailRequestDtoUnion = RecruiterMailEmployeeRequestDto | RecruiterMailFreelanceRequestDto | RecruiterMailDefaultRequestDto;
