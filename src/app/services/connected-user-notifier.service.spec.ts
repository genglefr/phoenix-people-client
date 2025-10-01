import { TestBed } from '@angular/core/testing';

import { ConnectedUserNotifierService } from './connected-user-notifier.service';

describe('ConnectedUserNotifierService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConnectedUserNotifierService = TestBed.get(ConnectedUserNotifierService);
    expect(service).toBeTruthy();
  });
});
