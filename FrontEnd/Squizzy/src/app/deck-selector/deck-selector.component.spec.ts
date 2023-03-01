import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckSelectorComponent } from './deck-selector.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';


//Not sure how I am supposed to do unit tests.
//The behavior of the functions is to modify data found in services.
//The modification of this data then causes a chain reaction of events.

describe('DeckSelectorComponent', () => {
  let component: DeckSelectorComponent;
  let fixture: ComponentFixture<DeckSelectorComponent>;

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
        MatSidenavModule,
        MatIconModule,
        MatButtonToggleModule,
        MatSlideToggleModule,
        MatExpansionModule,
        BrowserAnimationsModule
      ],
      declarations: [ DeckSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeckSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
