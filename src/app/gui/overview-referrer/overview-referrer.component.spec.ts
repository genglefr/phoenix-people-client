import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewReferrerComponent } from './overview-referrer.component';

describe('OverviewReferrerComponent', () => {
  let component: OverviewReferrerComponent;
  let fixture: ComponentFixture<OverviewReferrerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewReferrerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewReferrerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
