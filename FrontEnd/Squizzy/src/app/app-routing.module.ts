import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DeckEditorComponent } from './deck-editor/deck-editor.component';
import { FlashCardTesterComponent } from './flash-card-tester/flash-card-tester.component';
import { SelectedDeckDisplayComponent } from './selected-deck-display/selected-deck-display.component';

const routes: Routes = [
  {path:"DeckEditor", component: DeckEditorComponent},
  {path:"DeckSelector", component: SelectedDeckDisplayComponent},//TODO: Should I remove this?
  {path:"FlashCardTester", component: FlashCardTesterComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
