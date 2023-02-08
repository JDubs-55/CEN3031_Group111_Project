import { TestBed } from '@angular/core/testing';

import { DeckInfoService } from './deck-info.service';

describe('DeckInfoService', () => {
  let service: DeckInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeckInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
