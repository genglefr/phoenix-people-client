import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileImportTabComponent } from './file-import-tab.component';

describe('FileImportTabComponent', () => {
  let component: FileImportTabComponent;
  let fixture: ComponentFixture<FileImportTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileImportTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileImportTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
