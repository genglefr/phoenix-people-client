import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditAlarmCodeComponent} from './edit-alarm-code.component';

describe('EditBadgeComponent', () => {
  let component: EditAlarmCodeComponent;
  let fixture: ComponentFixture<EditAlarmCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAlarmCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAlarmCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
