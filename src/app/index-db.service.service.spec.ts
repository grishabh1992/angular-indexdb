import { TestBed, inject } from '@angular/core/testing';

import { IndexDbServiceService } from './index-db.service.service';

describe('IndexDbServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IndexDbServiceService]
    });
  });

  it('should be created', inject([IndexDbServiceService], (service: IndexDbServiceService) => {
    expect(service).toBeTruthy();
  }));
});
