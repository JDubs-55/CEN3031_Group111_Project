import { Component } from '@angular/core';

import { DeckManagerService } from './deck-manager.service';

import { DeckData } from './MyClasses/DeckData';
import { Deck } from './MyClasses/Deck';
import { CardData } from './MyClasses/CardData';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private deckManager: DeckManagerService) {
    let deck = this.deckManager.generateDeck();
    deck.name = "hi";

    let deck2 = this.deckManager.generateDeck();
    deck2.name = "ho";

    let deck3 = this.deckManager.generateDeck();
    deck3.name = "no";

    
  }
}
