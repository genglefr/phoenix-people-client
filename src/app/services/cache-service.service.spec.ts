import { TestBed } from '@angular/core/testing';

import { CacheService } from './cache.service';

describe('CacheServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CacheService = TestBed.get(CacheService);
    expect(service).toBeTruthy();
  });
});
