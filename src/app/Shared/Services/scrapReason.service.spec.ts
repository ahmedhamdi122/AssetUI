/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ScrapReasonService } from './scrapReason.service';

describe('Service: ScrapReason', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScrapReasonService]
    });
  });

  it('should ...', inject([ScrapReasonService], (service: ScrapReasonService) => {
    expect(service).toBeTruthy();
  }));
});
