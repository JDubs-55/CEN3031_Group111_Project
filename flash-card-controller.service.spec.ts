import { TestBed } from '@angular/core/testing';

import { FlashCardControllerService } from './flash-card-controller.service';

describe('FlashCardControllerService', () => {
  let service: FlashCardControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlashCardControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
