import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeckEditorComponent } from './deck-editor/deck-editor.component';
import { FlashCardTesterComponent } from './flash-card-tester/flash-card-tester.component';


const routes: Routes = [
  {path: "DeckEditor", component:DeckEditorComponent},
  {path: "FlashCardTester", component:FlashCardTesterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
