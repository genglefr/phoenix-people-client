import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AlarmCodeManagementComponent} from './alarm-code-management.component';

describe('AlarmCodeManagementComponent', () => {
  let component: AlarmCodeManagementComponent;
  let fixture: ComponentFixture<AlarmCodeManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmCodeManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmCodeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
