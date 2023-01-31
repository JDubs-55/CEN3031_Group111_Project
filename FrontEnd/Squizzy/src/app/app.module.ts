import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlashCardComponent } from './flash-card/flash-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { MainMenuComponent } from './main-menu/main-menu.component';
import {MatCardModule} from '@angular/material/card';
import { DeckSelectionComponent } from './deck-selection/deck-selection.component';
import { DeckEditorComponent } from './deck-editor/deck-editor.component';
import { StudyComponent } from './study/study.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { SelectedDeckDisplayComponent } from './selected-deck-display/selected-deck-display.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTabsModule} from '@angular/material/tabs';
import { FlashCardTesterComponent } from './flash-card-tester/flash-card-tester.component';

@NgModule({
  declarations: [
    AppComponent,
    FlashCardComponent,
    MainMenuComponent,
    DeckSelectionComponent,
    DeckEditorComponent,
    StudyComponent,
    SelectedDeckDisplayComponent,
    FlashCardTesterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
