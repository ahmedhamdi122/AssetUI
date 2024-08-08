import { TestBed } from '@angular/core/testing';

import { WorkOrderTypeService } from './work-order-type.service';

describe('WorkOrderTypeService', () => {
  let service: WorkOrderTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkOrderTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
