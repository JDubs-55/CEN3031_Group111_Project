import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { DeckSelectionComponent } from './deck-selection/deck-selection.component';
import { DeckEditorComponent } from './deck-editor/deck-editor.component';
import { StudyComponent } from './study/study.component';

const routes: Routes = [
  { path: '',   redirectTo: '/MainMenu', pathMatch: 'full' },
  {path:"MainMenu", component: MainMenuComponent},
  {path:"DeckSelection", component: DeckSelectionComponent},
  {path: "DeckEditor", component: DeckEditorComponent},
  {path: "Study", component: StudyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
