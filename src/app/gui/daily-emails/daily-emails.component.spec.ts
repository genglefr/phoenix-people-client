import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyEmailsComponent } from './daily-emails.component';

describe('DailyEmailsComponent', () => {
  let component: DailyEmailsComponent;
  let fixture: ComponentFixture<DailyEmailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyEmailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
