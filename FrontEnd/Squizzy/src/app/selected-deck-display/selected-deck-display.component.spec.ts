import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedDeckDisplayComponent } from './selected-deck-display.component';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SelectedDeckDisplayComponent', () => {
  let component: SelectedDeckDisplayComponent;
  let fixture: ComponentFixture<SelectedDeckDisplayComponent>;

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
      declarations: [ SelectedDeckDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedDeckDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  let placeholder = "placeholder";
  it('placeholder', () => {
    expect(placeholder).toEqual("placeholder");
  });
});
