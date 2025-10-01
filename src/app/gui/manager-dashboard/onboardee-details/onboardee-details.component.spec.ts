import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardeeDetailsComponent } from './onboardee-details.component';

describe('OnboardeeDetailsComponent', () => {
  let component: OnboardeeDetailsComponent;
  let fixture: ComponentFixture<OnboardeeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardeeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardeeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
