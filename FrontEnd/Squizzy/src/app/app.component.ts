import { Component } from '@angular/core';
import { FlashCardControllerService } from './flash-card-controller.service';
import { DeckInfoService } from './deck-info.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private deckInfo: DeckInfoService){
    console.log(deckInfo.getDecksByName("hi"));
  }
}
