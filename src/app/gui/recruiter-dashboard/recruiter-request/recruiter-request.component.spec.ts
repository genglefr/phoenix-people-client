import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterRequestComponent } from './recruiter-request.component';

describe('RecruiterRequestComponent', () => {
  let component: RecruiterRequestComponent;
  let fixture: ComponentFixture<RecruiterRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruiterRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiterRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
