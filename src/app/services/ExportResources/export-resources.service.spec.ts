import { TestBed } from '@angular/core/testing';

import { ExportResourcesService } from './export-resources.service';

describe('ExportResourcesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExportResourcesService = TestBed.get(ExportResourcesService);
    expect(service).toBeTruthy();
  });
});
