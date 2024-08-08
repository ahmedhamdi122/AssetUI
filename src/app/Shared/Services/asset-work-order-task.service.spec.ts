import { TestBed } from '@angular/core/testing';

import { AssetWorkOrderTaskService } from './asset-work-order-task.service';

describe('AssetWorkOrderTaskService', () => {
  let service: AssetWorkOrderTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetWorkOrderTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
