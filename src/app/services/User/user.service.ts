import {Injectable} from '@angular/core';
import {PreferencesListDto, UserAppDto, UserPreferencesDto} from '../../model';
import {HttpClient} from '@angular/common/http';
import {ApiInformation} from '../../utils/ApiInformation';
import {cacheable} from '../../decorator/cacheable';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: UserAppDto;

  ADMIN_ROLE = 'USOURCE_ADMINISTRATOR';
  USOURCE_READ = 'USOURCE_READ';
  USOURCE_READ_BADGE = 'USOURCE_BADGE_ACCESS';
  REFERRAL_MANAGER = 'REFERRAL_MANAGER';
  ENTITY_MANAGER = 'ENTITY_MANAGER';
  MANAGER_ONBOARDING = 'MANAGER_ONBOARDING';
  RECRUITER = 'RECRUITER';

  constructor(private httpClient: HttpClient) {
  }

  /**
   * Fetch the userconnected trough the CAS
   */
  @cacheable()
  getAuthenticatedUser(): Promise<UserAppDto> {
    if (!this.user) {
      return this.httpClient.get<UserAppDto>(`${ApiInformation.API_ENDPOINT}${ApiInformation.USERS_ENDPOINT}user`)
          .toPromise().then(
            res => {
              this.user = res;
              return Promise.resolve(res);
            },
          error => Promise.reject(error)
          );
    } else {
      return Promise.resolve(this.user);
    }
  }

  /**
   * Returns true if the current user has the administrator role assigned
   */
  isAdministrator(): Promise<boolean> {
    if (!this.user) {
      return this.httpClient.get<UserAppDto>(`${ApiInformation.API_ENDPOINT}${ApiInformation.USERS_ENDPOINT}user`)
          .toPromise().then(
            res => {
              this.user = res;
              return Promise.resolve(this.user.authorities.some(auth => this.ADMIN_ROLE === auth.authority));
            },
          error => Promise.reject(error)
          );
    } else {
      return Promise.resolve(this.user.authorities.some(auth => this.ADMIN_ROLE === auth.authority));
    }
  }

  /**
   * Returns true if the current user (entity manager) is in the same entity as the candidate he's trying to modify
   */
  isEntityManagerSameEntity(id:number): Promise<boolean> {
    return this.httpClient.post<boolean>(`${ApiInformation.API_ENDPOINT}${ApiInformation.USERS_ENDPOINT}manager`, id).toPromise();
  }

  /**
   * Returns true if the current user has the administrator role assigned
   */
  isAdminRead(): Promise<boolean> {
    if (!this.user) {
      return this.httpClient.get<UserAppDto>(`${ApiInformation.API_ENDPOINT}${ApiInformation.USERS_ENDPOINT}user`)
          .toPromise().then(
            res => {
              this.user = res;
              return Promise
                .resolve(this.user.authorities.some(auth => this.ADMIN_ROLE === auth.authority || auth.authority === this.USOURCE_READ));
            },
          error => Promise.reject(error)
          );
    } else {
      return Promise.resolve(
        this.user.authorities.some(auth => this.ADMIN_ROLE === auth.authority || auth.authority === this.USOURCE_READ)
      );
    }
  }

  /**
   * Returns true if the current user has the read role assigned
   */
  hasReadRole(): Promise<boolean> {
    if (!this.user) {
      return this.httpClient.get<UserAppDto>(`${ApiInformation.API_ENDPOINT}${ApiInformation.USERS_ENDPOINT}user`)
          .toPromise().then(
            res => {
              this.user = res;
              return Promise.resolve(this.user.authorities.some(auth => auth.authority.includes(this.USOURCE_READ)));
            },
          error => Promise.reject(error)
          );
    } else {
      return Promise.resolve(this.user.authorities.some(auth => auth.authority.includes(this.USOURCE_READ)));
    }
  }

  /**
   * Returns true if the current user has the read role assigned
   */
  hasAdminRole(): Promise<boolean> {
    if (!this.user) {
      return this.httpClient.get<UserAppDto>(`${ApiInformation.API_ENDPOINT}${ApiInformation.USERS_ENDPOINT}user`)
          .toPromise().then(
            res => {
              this.user = res;
              return Promise.resolve(this.user.authorities.some(auth => auth.authority.includes(this.ADMIN_ROLE)));
            },
          error => Promise.reject(error)
          );
    } else {
      return Promise.resolve(this.user.authorities.some(auth => auth.authority.includes(this.ADMIN_ROLE)));
    }
  }

  /**
   * Returns true if the current user is Administration or READ of an entity/Read only.
   */
  isAdminOrRead(): Promise<boolean> {
    return this.hasUserRoles([this.USOURCE_READ, this.ADMIN_ROLE]);
  }

  /**
   * Returns true if the current user is Usource read access
   */
  isReadBadge(): Promise<boolean> {
    return this.hasUserRoles([this.USOURCE_READ_BADGE])
  }

  /**
   * Returns true if the current user is referral manager
   */
  isReferralManager(): Promise<boolean> {
    return this.hasUserRoles([this.REFERRAL_MANAGER])
  }

  /**
   * Returns true if the current user is ManagerOnBoarding.
   */
  isManagerOnBoarding(): Promise<boolean> {
    return this.hasUserRoles([this.MANAGER_ONBOARDING]);
  }

  /**
   * Returns true if the current user is Recruiter.
   */
  isRecruiter(): Promise<boolean> {
    return this.hasUserRoles([this.RECRUITER]);
  }

  /**
   * Returns true if the current user is EntityManager.
   */
  isEntityManager(): Promise<boolean> {
    return this.hasUserRoles([this.ENTITY_MANAGER]);
  }

  /**
   * Returns true if the current user is Administration or READ of an entity/Read only.
   */
  isAdministrationMenuViewable(): Promise<boolean> {
    return this.hasUserRoles([this.USOURCE_READ, this.ADMIN_ROLE, this.ENTITY_MANAGER, this.USOURCE_READ_BADGE]);
  }

  /**
   * Returns true if the current user is EntityManager or ManagerOnboarding or Recruiter.
   */
  isOnBoardingMenuViewable(): Promise<boolean> {
    return this.hasUserRoles([this.ENTITY_MANAGER, this.MANAGER_ONBOARDING, this.RECRUITER]);
  }

  /**
   * Check if the user has one of the role.
   * @param roles to check.
   */
  hasUserRoles(roles: string[]): Promise<boolean> {
    if (!this.user) {
      return this.getAuthenticatedUser().then(
        res => {
          this.user = res;
          return Promise.resolve(
            this.user.authorities.some(auth => roles.some(elt => auth.authority.includes(elt)))
          );
        },
        error => Promise.reject(error)
      );
    } else {
      return Promise.resolve(
        this.user.authorities.some(auth => roles.some(elt => auth.authority.includes(elt)))
      );
    }
  }

  /**
   * Fetch home page preferences
   */
  getHomePagePreferences(): Promise<PreferencesListDto> {
    return this.httpClient.get<PreferencesListDto>(`${ApiInformation.API_ENDPOINT}${ApiInformation.USERS_ENDPOINT}preferences/list`)
      .toPromise();
  }

  /**
   * Fetch current user preferences and return it as a promise
   */
  getUserPreferences() {
    return this.getUserPreferences$().toPromise();
  }

  /**
   * Fetch current user preferences and return it as an Observable
   */
  getUserPreferences$() {
    return this.httpClient.get<UserPreferencesDto>(`${ApiInformation.API_ENDPOINT}${ApiInformation.USERS_ENDPOINT}preferences`);
  }

  /**
   * Set current user preferences.
   */
  setUserPreferences(userPreference: UserPreferencesDto) {
    return this.httpClient.post(`${ApiInformation.API_ENDPOINT}${ApiInformation.USERS_ENDPOINT}preferences`, userPreference).toPromise();
  }
}
