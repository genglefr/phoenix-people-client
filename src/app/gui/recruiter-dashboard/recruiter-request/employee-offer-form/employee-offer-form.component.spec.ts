import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeOfferFormComponent } from './employee-offer-form.component';

describe('EmployeeOfferFormComponent', () => {
  let component: EmployeeOfferFormComponent;
  let fixture: ComponentFixture<EmployeeOfferFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeOfferFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeOfferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
