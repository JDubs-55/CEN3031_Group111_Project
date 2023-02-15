import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';


import { SelectedDeckDisplayComponent } from './selected-deck-display/selected-deck-display.component';
import { DeckPreviewComponent } from './deck-preview/deck-preview.component';
import { DeckEditorComponent } from './deck-editor/deck-editor.component';
import { CardSelectorComponent } from './card-selector/card-selector.component';
import { FlashCardTesterComponent } from './flash-card-tester/flash-card-tester.component';

//TODO: figure out why angular is reporting a problem every time I force an update to the display
//(note) the code does what I intend to do, but I am probably doing something in an unintended way
//(not) it seems as if something is configured incorrectly

//Warning it could become hard to understand how this code works due to the use of event handlers
//Each part responds accordingly, but it not immeadiately obvious what things respond when any particular variable changes.
//The way the code works currently means that things "just work"
//It should be easily expandable as a result


@NgModule({
  declarations: [
    AppComponent,
    SelectedDeckDisplayComponent,
    DeckPreviewComponent,
    DeckEditorComponent,
    CardSelectorComponent,
    FlashCardTesterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatDividerModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
