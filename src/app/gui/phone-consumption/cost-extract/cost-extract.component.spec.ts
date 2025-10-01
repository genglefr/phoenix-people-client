import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostExtractComponent } from './cost-extract.component';

describe('CostExtractComponent', () => {
  let component: CostExtractComponent;
  let fixture: ComponentFixture<CostExtractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostExtractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostExtractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
