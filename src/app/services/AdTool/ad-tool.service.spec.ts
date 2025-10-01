import { TestBed } from '@angular/core/testing';

import { AdToolService } from './ad-tool.service';

describe('AdToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdToolService = TestBed.get(AdToolService);
    expect(service).toBeTruthy();
  });
});
