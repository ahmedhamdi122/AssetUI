import { TestBed } from '@angular/core/testing';

import { WorkOrderAttachmentService } from './work-order-attachment.service';

describe('WorkOrderAttachmentService', () => {
  let service: WorkOrderAttachmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkOrderAttachmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
