import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerOfferFormComponent } from './freelancer-offer-form.component';

describe('FreelancerOfferFormComponent', () => {
  let component: FreelancerOfferFormComponent;
  let fixture: ComponentFixture<FreelancerOfferFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelancerOfferFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelancerOfferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
