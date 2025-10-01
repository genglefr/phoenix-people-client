import { TestBed } from '@angular/core/testing';

import { SanityService } from './sanity.service';

describe('SanityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SanityService = TestBed.get(SanityService);
    expect(service).toBeTruthy();
  });
});
