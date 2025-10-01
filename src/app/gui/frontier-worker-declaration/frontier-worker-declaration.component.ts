import {AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {dateEndFormat} from '../../validators/DateEndFormatValidator';
import {NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {FullResourceDto} from '../../model';

@Component({
  selector: 'app-frontier-worker-declaration',
  templateUrl: './frontier-worker-declaration.component.html',
  styleUrls: ['./frontier-worker-declaration.component.sass']
})
export class FrontierWorkerDeclarationComponent implements OnInit, OnChanges {

  readonly RECEIVED = 'RECEIVED';

  constructor(private calendar: NgbCalendar, private cd: ChangeDetectorRef) {
  }

  @Input()
  frontierDeclarationForm = new FormGroup({
    'residentialCountry': new FormControl(null),
    'socialSecurityNumber': new FormControl(null),
    'a1Status': new FormControl('TO_DO'),
    'endOfValidityDate': new FormControl(null, dateEndFormat),
    'limosaStatus': new FormControl(null)
  });

  @Input()
  residentialCountry: string = null;

  @Input()
  socialSecurityNumber: string = null;

  @Input()
  userToShow: FullResourceDto = null;

  @Input()
  readOnly: boolean = false;

  today = this.calendar.getToday();

  get residentialCountryControl() {
    return this.frontierDeclarationForm.get('residentialCountry');
  }

  get socialSecurityNumberControl() {
    return this.frontierDeclarationForm.get('socialSecurityNumber');
  }

  get endOfValidityDateControl() {
    return this.frontierDeclarationForm.get('endOfValidityDate');
  }

  get a1StatusControl() {
    return this.frontierDeclarationForm.get('a1Status');
  }

  get limosaStatusControl() {
    return this.frontierDeclarationForm.get('limosaStatus');
  }

  ngOnInit() {
    this.frontierDeclarationForm.patchValue({
      residentialCountry: this.residentialCountry,
      socialSecurityNumber: this.socialSecurityNumber
    });
    this.endOfValidityDateControl[this.RECEIVED === this.a1StatusControl.value ? 'enable': 'disable']();

    this.a1StatusControl.valueChanges.subscribe(value => {
      const isReceived = this.RECEIVED === value;
      this.endOfValidityDateControl[isReceived && !this.readOnly ? 'enable': 'disable']();
      if (!isReceived) {
        this.endOfValidityDateControl.setValue(null);
      }
    });

    if (this.readOnly) {
      this.a1StatusControl.disable();
      this.endOfValidityDateControl.disable();
      this.limosaStatusControl.disable();
    }
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['residentialCountry'] || changes['socialSecurityNumber']) {
      this.frontierDeclarationForm.patchValue({
        residentialCountry: this.residentialCountry,
        socialSecurityNumber: this.socialSecurityNumber
      });
    }
  }
}
