import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPositionSelectComponent } from './job-position-select.component';

describe('JobPositionSelectComponent', () => {
  let component: JobPositionSelectComponent;
  let fixture: ComponentFixture<JobPositionSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobPositionSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobPositionSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
