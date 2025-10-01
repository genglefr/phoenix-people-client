import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import {CompanyDto, HomePagePreferencesDto, UserPreferencesDto} from '../../../model';
import {FormControl, FormGroup} from '@angular/forms';
import {UserService} from '../../../services/User/user.service';
import {NotificationService} from '../../../services/notification.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.sass']
})
export class PreferencesComponent implements OnInit {
  @Input() homePageList: HomePagePreferencesDto[] = [];
  @Input() resourceCompanyList: CompanyDto[] = [];
  @Input() userPreferenceDto: UserPreferencesDto;
  homepageTab = 'homepage';
  activeTab: string = this.homepageTab;
  entityTab = 'entityTab';
  homepageFrom = new FormGroup({
    'homepagePreferences': new FormControl(null),
  });
  selectedCompanies: CompanyDto[] = [];
  constructor(public activeModal: NgbActiveModal,
              private userService: UserService,
              private notificationService: NotificationService) { }

  ngOnInit() {
    if (this.userPreferenceDto.homePagePreferencesDto) {
      this.homepageFrom.patchValue({homepagePreferences: this.userPreferenceDto.homePagePreferencesDto.name});
    }

    if (this.userPreferenceDto.companyDto) {
      this.selectedCompanies = this.userPreferenceDto.companyDto;
    }
  }

  /**
   * Save selected user preferences
   */
  savePreferences() {
    const preference = {
      homePagePreferencesDto: this.getHomePageDto(this.homepageFrom.get('homepagePreferences').value),
      companyDto: this.selectedCompanies
    } as UserPreferencesDto;
    this.userService.setUserPreferences(preference).then(() => {
      this.notificationService.addSuccessToast('Preferences have been saved');
      this.activeModal.close();
    }, error => {
      this.notificationService.addErrorToast(error.error.message);
    });
  }

  /**
   * Change tab in GUI
   * @param $event the tab change event
   */
  updateTab($event: NgbTabChangeEvent) {
    this.activeTab = $event.nextId;
  }

  /**
   * Return home page dto from page name
   * @param name name to find
   */
  private getHomePageDto(name: string) {
    return this.homePageList.find(c => c.name === name);
  }

  /**
   * Update selected companies
   * @param $event list of selected companies
   */
  changeCompanies($event: CompanyDto[]) {
    this.selectedCompanies = $event;
  }
}
