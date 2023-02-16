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
    
  }

  ngOnInit(){
    this.deckManager.loadAllDeckNames();
  }

  dumpDeckData(): void{
    let data: DeckData[] = Object.values(this.deckManager.loadedDecks).map(deck=>deck.data);

    console.log(data);
    
  }

  httpTest(): void{
    fetch("http://localhost:4200/api/echo/hello")
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error))
  }
}
