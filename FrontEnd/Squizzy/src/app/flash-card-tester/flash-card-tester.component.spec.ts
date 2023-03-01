import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashCardTesterComponent } from './flash-card-tester.component';

import { MatCardModule } from '@angular/material/card';4
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FlashCardTesterComponent', () => {
  let component: FlashCardTesterComponent;
  let fixture: ComponentFixture<FlashCardTesterComponent>;

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
      declarations: [ FlashCardTesterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlashCardTesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(FlashCardTesterComponent).toBeTruthy();
  });
});
