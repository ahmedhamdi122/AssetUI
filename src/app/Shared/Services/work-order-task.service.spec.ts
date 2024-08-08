import { TestBed } from '@angular/core/testing';

import { WorkOrderTaskService } from './work-order-task.service';

describe('WorkOrderTaskService', () => {
  let service: WorkOrderTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkOrderTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
