import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckSelectionComponent } from './deck-selection.component';
import { SelectedDeckDisplayComponent } from '../selected-deck-display/selected-deck-display.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('DeckSelectionComponent', () => {
  let component: DeckSelectionComponent;
  let fixture: ComponentFixture<DeckSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatAutocompleteModule, MatInputModule, MatCardModule, FormsModule, ReactiveFormsModule ],
      declarations: [ DeckSelectionComponent, SelectedDeckDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeckSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
