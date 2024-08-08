import { TestBed } from '@angular/core/testing';

import { WorkOrderPeriorityService } from './work-order-periority.service';

describe('WorkOrderPeriorityService', () => {
  let service: WorkOrderPeriorityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkOrderPeriorityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
