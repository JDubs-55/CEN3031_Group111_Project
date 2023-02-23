import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeckEditorComponent } from './deck-editor/deck-editor.component';


const routes: Routes = [
  {path: "DeckEditor", component:DeckEditorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
