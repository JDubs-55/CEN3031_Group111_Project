import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckEditorComponent } from './deck-editor.component';

import { MatCardModule } from '@angular/material/card'; 4
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SelectedDeckDisplayComponent } from '../selected-deck-display/selected-deck-display.component';
import { CardSelectorComponent } from '../card-selector/card-selector.component';

describe('DeckEditorComponent', () => {
  let component: DeckEditorComponent;
  let fixture: ComponentFixture<DeckEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatDividerModule,
        MatButtonModule,
        BrowserAnimationsModule,
      ],
      declarations: [
        DeckEditorComponent,
        SelectedDeckDisplayComponent,
        CardSelectorComponent
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DeckEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  let placeholder = "placeholder";
  it('placeholder', () => {
    expect(placeholder).toEqual("placeholder");
  });
});
