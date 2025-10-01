import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePhoneNumbersComponent } from './manage-phone-numbers.component';

describe('ManagePhoneNumbersComponent', () => {
  let component: ManagePhoneNumbersComponent;
  let fixture: ComponentFixture<ManagePhoneNumbersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePhoneNumbersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePhoneNumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
