import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckSanityComponent } from './check-sanity.component';

describe('CheckSanityComponent', () => {
  let component: CheckSanityComponent;
  let fixture: ComponentFixture<CheckSanityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckSanityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckSanityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
