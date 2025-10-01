import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneConsumptionComponent } from './phone-consumption.component';

describe('PhoneConsumptionComponent', () => {
  let component: PhoneConsumptionComponent;
  let fixture: ComponentFixture<PhoneConsumptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneConsumptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
