import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckSelectionComponent } from './deck-selection.component';

describe('DeckSelectionComponent', () => {
  let component: DeckSelectionComponent;
  let fixture: ComponentFixture<DeckSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeckSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeckSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  let placeholder = "placeholder";
  it('placeholder', () => {
    expect(placeholder).toEqual("placeholder");
  });
});
