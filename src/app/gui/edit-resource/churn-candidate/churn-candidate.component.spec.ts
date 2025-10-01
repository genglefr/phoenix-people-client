import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChurnCandidateComponent } from './churn-candidate.component';

describe('ChurnCandidateComponent', () => {
  let component: ChurnCandidateComponent;
  let fixture: ComponentFixture<ChurnCandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChurnCandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChurnCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
