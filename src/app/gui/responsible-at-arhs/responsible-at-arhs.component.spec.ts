import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsibleAtArhsComponent } from './responsible-at-arhs.component';

describe('ResponsibleAtArhsComponent', () => {
  let component: ResponsibleAtArhsComponent;
  let fixture: ComponentFixture<ResponsibleAtArhsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsibleAtArhsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsibleAtArhsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
