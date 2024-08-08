import { TestBed } from '@angular/core/testing';

import { WorkOrderTrackingService } from './work-order-tracking.service';

describe('WorkOrderTrackingService', () => {
  let service: WorkOrderTrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkOrderTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
