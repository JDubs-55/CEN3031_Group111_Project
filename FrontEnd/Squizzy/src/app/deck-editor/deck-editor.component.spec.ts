import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckEditorComponent } from './deck-editor.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SelectedDeckDisplayComponent } from '../selected-deck-display/selected-deck-display.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DeckEditorComponent', () => {
  let component: DeckEditorComponent;
  let fixture: ComponentFixture<DeckEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatFormFieldModule, ReactiveFormsModule, FormsModule, MatCardModule, MatInputModule, BrowserAnimationsModule ],
      declarations: [ DeckEditorComponent, SelectedDeckDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeckEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
