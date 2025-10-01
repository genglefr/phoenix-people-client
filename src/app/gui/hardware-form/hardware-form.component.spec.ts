import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareFormComponent } from './hardware-form.component';

describe('HardwareFormComponent', () => {
  let component: HardwareFormComponent;
  let fixture: ComponentFixture<HardwareFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
