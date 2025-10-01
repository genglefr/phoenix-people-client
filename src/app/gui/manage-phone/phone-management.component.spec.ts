import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneManagementComponent } from './phone-management.component';

describe('PhoneManagementComponent', () => {
  let component: PhoneManagementComponent;
  let fixture: ComponentFixture<PhoneManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
