import {AssetDto} from '../model';

export class MailUtils {
  public static readonly DEFAULT_CREATE_CONTRACT_TITLE = 'Request to create a contract - Send';
  public static readonly DEFAULT_CREATE_OFFER_TITLE = 'Request to create an offer - Send';
  public static readonly DEFAULT_UPDATE_OFFER_TITLE = 'Request to update an offer - Send';
  public static readonly DEFAULT_ASK_WORK_PERMIT_TITLE = 'Request to ask for work permit - Send';

  private static DEFAULT_CREATE_CONTRACT_SUBJECT = 'Request to create a contract';
  private static DEFAULT_CREATE_OFFER_SUBJECT = 'Request to create an offer';
  private static DEFAULT_UPDATE_OFFER_SUBJECT = 'Request to update an offer';
  private static DEFAULT_ASK_WORK_PERMIT_SUBJECT = 'Request to ask for work permit';

  private static MEGANE_MAIL = 'Megane.Bruvry@arhs-developments.com';
  private static OPHELIE_MAIL = 'Ophelie.Spader@arhs-developments.com';
  private static SARAH_MAIL = 'Sarah.Devresse@arhs-developments.com';
  private static EMMANUEL_MAIL = 'Emmanuel.Bauwens@arhs-developments.com';
  private static SEBASTIEN_MAIL = 'Sebastien.Braun@arhs-consulting.com';
  private static CHRISTOPHE_MAIL = 'Christophe.Grosjean@arhs-spikeseed.com';
  private static ALEXANDRE_MAIL = 'Alexandre.Defays@arhs-spikeseed.com';
  private static LARA_MAIL = 'Lara.Vanneste@fleetback.com';
  private static JOURDAN_MAIL = 'Jourdan.Serderidis@arhs-developments.com';
  private static HR_MAIL = 'arhs.hr@arhs-developments.com';
  private static RECRUITER_MAIL = 'recruitment-LU@arhs-developments.com';


  /**
   * Create the ask work permit subject with the candidate name.
   * @param candidateName of the candidate.
   */
  public static createWorkPermitSubject(candidateName: string) {
    return `${candidateName} - ${this.DEFAULT_ASK_WORK_PERMIT_SUBJECT}`;
  }

  /**
   * Create the contract subject with the candidate name.
   * @param candidateName of the candidate.
   */
  public static createContractSubject(candidateName: string, companyName: string) {
    if (companyName) {
      return `${candidateName} (${companyName}) - ${this.DEFAULT_CREATE_CONTRACT_SUBJECT}`;
    }
    return `${candidateName} - ${this.DEFAULT_CREATE_CONTRACT_SUBJECT}`;
  }

  /**
   * Create the offer subject with the candidate name.
   * @param candidateName of the candidate.
   */
  public static createCreateOfferSubject(candidateName: string) {
    return `${candidateName} - ${this.DEFAULT_CREATE_OFFER_SUBJECT}`;
  }

  /**
   * Create the update offer subject with the candidate name.
   * @param candidateName of the candidate.
   */
  public static createUpdateOfferSubject(candidateName: string) {
    return `${candidateName} - ${this.DEFAULT_UPDATE_OFFER_SUBJECT}`;
  }

  /**
   * Create the ask work permit body with the candidate name.
   * @param candidateName of the candidate.
   */
  public static createAskWorkPermitBody(candidateName: string) {
    return `Dear HR team, \n\n` +
      `Could you please ask the work permit for candidate ${candidateName} ? \n\n` +
      `Best regards, \n` +
      `ARHS recruitement team`;
  }

  /**
   * Create the contract body with the candidate name.
   * @param candidateName of the candidate.
   */
  public static createCreateContractBody(candidateName: string) {
    return `Dear HR team, \n\n` +
           `Could you please create a contract for ${candidateName} ? \n\n` +
           `Best regards, \n` +
           `ARHS recruitement team`;
  }

  /**
   * Create the contract body with the candidate name with address.
   * @param candidateName of the candidate.
   * @param address of the candidate.
   */
  public static createCreateContractWithAddressBody(candidateName: string, address: string, referrer: string, isHardwareUpdated: boolean, comment: string) {
    const referrerLine = (referrer) ? `The referrer is: ${referrer}\n\n` : '';
    const hardwareModified = isHardwareUpdated ? `The hardware information has been modified. \n\n` : '';
    const commentText = (comment) ? `${comment}\n\n` : '';
    return `Dear HR team, \n\n` +
           `Could you please create a contract for ${candidateName} ? \n\n` +
           `${commentText}` +
           `The address for the contract is: ${address}\n\n` +
           `${hardwareModified}`  +
           `${referrerLine}` +
           `Best regards, \n` +
           `ARHS recruitement team`;
  }

  /**
   * Create the offer body with the candidate name.
   * @param candidateName of the candidate.
   * @param candidateAccount  account of candidate existing in db
   */
  public static createCreateOfferBody(candidateName: string, candidateAccount: string) {
    return `Dear HR team, \n\n` +
           `Could you please ` +
           (candidateAccount ? 'update' : 'create') +
           ` the candidate ${candidateName} in U-Source and create an offer ? \n\n` +
           `Best regards, \n` +
           `ARHS recruitement team`;
  }

  /**
   * Create the update offer body with the candidate name.
   * @param candidateName of the candidate.
   */
  public static createUpdateOfferBody(candidateName: string) {
    return `Dear HR team, \n\n` +
           `Could you please update the offer of ${candidateName} ? \n\n` +
           `Best regards, \n` +
           `ARHS recruitement team`;
  }

  /**
   * Retrieve the recruiter email corresponding to the company.
   * @param companyName of the company.
   */
  public static retrieveRecruiterMail(company: String): RecipientDto {
    switch (company) {
      case 'ARHS Consulting':
      case 'ARHS Advisory':
      case 'ARHS Cybersec':
        return {
          to: [this.MEGANE_MAIL, this.OPHELIE_MAIL],
          cc: [this.HR_MAIL, this.RECRUITER_MAIL, this.SEBASTIEN_MAIL, this.SARAH_MAIL, this.EMMANUEL_MAIL],
          bcc: []
        };
      case 'ARHS Spikeseed':
        return {
          to: [this.MEGANE_MAIL, this.OPHELIE_MAIL],
          cc: [this.HR_MAIL, this.RECRUITER_MAIL, this.CHRISTOPHE_MAIL, this.ALEXANDRE_MAIL, this.SARAH_MAIL, this.EMMANUEL_MAIL],
          bcc: []
        };
      case 'Fleetback':
      case 'Fleetback France':
        return {
          to: [this.MEGANE_MAIL, this.OPHELIE_MAIL],
          cc: [this.HR_MAIL, this.RECRUITER_MAIL, this.LARA_MAIL, this.JOURDAN_MAIL, this.SARAH_MAIL, this.EMMANUEL_MAIL],
          bcc: []
        };
      case 'ARHS Cube':
      case 'ARHS Data':
      case 'ARHS Belgium':
      case 'ARHS Digital':
      case 'ARHS Italia':
      case 'Nyx':
      case 'ARHS Portugal':
        return {
          to: [],
          cc: [],
          bcc: []
        };
      case 'ARHS':
      case 'ARHS Luxembourg':
      case 'ARHS Beyond Limit':
        return {
          to: [this.MEGANE_MAIL, this.OPHELIE_MAIL],
          cc: [this.HR_MAIL, this.RECRUITER_MAIL, this.SARAH_MAIL, this.EMMANUEL_MAIL],
          bcc: []
        };
      case 'ARHS Hellas':
        return {
        to: ['HR@arhs-dev-hellas.com'],
        cc: [],
        bcc: []
        };
      case 'ARHS Technology':
        return {
          to: ['HR@arhs-technology.com'],
          cc: [],
          bcc: []
        };
      case 'Finartix':
        return {
          to: ['HR@finartix.com'],
          cc: [],
          bcc: []
        };
    }
  }
}

export interface RecipientDto {
  to: string[];
  cc: string[];
  bcc: string[];
}

export interface ProposalMailDto {
  srCandidateId: string;
  firstName: string;
  lastName: string;
  gender: string;
  partReferralProgram: string;
  referrer: string;
  type: string;
  company: string;
  startDate: string;
  endDate: string;
  jobPosition?: string;
  jobTitle?: string;
  newGraduate?: string;
  rullingCategory?: string;
  managerAccount?: string;
  inductionResponsibleAccount?: string;
  mentorAccount?: string;
  onSite: string;
  computerModel: string,
  keyboardLayout: string,
  operatingSystem: string,
  screens: number,
  additionalAssets: AssetDto[]
}
