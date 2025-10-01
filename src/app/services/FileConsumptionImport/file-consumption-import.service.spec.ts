import { TestBed } from '@angular/core/testing';

import { FileConsumptionImportService } from './file-consumption-import.service';

describe('FileConsumptionImportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileConsumptionImportService = TestBed.get(FileConsumptionImportService);
    expect(service).toBeTruthy();
  });
});
