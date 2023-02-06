import { Component } from '@angular/core';
import { ProgramStateService } from '../program-state.service';

@Component({
  selector: 'app-selected-deck-display',
  templateUrl: './selected-deck-display.component.html',
  styleUrls: ['./selected-deck-display.component.css']
})
export class SelectedDeckDisplayComponent {
  constructor(public programState: ProgramStateService){}
}
