import { TestBed } from '@angular/core/testing';

import { RequestDocumentService } from './request-document.service';

describe('RequestDocumentService', () => {
  let service: RequestDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
