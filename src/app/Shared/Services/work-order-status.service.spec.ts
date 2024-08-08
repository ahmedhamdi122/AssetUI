import { TestBed } from '@angular/core/testing';

import { WorkOrderStatusService } from './work-order-status.service';

describe('WorkOrderStatusService', () => {
  let service: WorkOrderStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkOrderStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
