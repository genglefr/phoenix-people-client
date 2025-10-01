import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedCostTabComponent } from './fixed-cost-tab.component';

describe('FixedCostTabComponent', () => {
  let component: FixedCostTabComponent;
  let fixture: ComponentFixture<FixedCostTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedCostTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedCostTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
