import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareRequestComponent } from './hardware-request.component';

describe('HardwareRequestComponent', () => {
  let component: HardwareRequestComponent;
  let fixture: ComponentFixture<HardwareRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
