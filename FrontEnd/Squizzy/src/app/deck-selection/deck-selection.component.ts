import { Component } from '@angular/core';

@Component({
  selector: 'app-deck-selection',
  templateUrl: './deck-selection.component.html',
  styleUrls: ['./deck-selection.component.css']
})
export class DeckSelectionComponent {
  options: string[] = ["hi", "bye"];
}
