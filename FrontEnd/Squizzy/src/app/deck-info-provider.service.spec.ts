import { TestBed } from '@angular/core/testing';

import { DeckInfoProviderService } from './deck-info-provider.service';

describe('DeckInfoProviderService', () => {
  let service: DeckInfoProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeckInfoProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
