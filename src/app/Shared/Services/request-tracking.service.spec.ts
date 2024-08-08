import { TestBed } from '@angular/core/testing';

import { RequestTrackingService } from './request-tracking.service';

describe('RequestTrackingService', () => {
  let service: RequestTrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
