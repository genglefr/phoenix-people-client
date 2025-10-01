import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { USourceComponent } from './usource.component';

describe('USourceComponent', () => {
  let component: USourceComponent;
  let fixture: ComponentFixture<USourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ USourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(USourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
