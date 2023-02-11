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

  previewDeck: Deck;

  constructor(private deckManager: DeckManagerService) {
    for(let i = 0; i < 13; i++){
      this.generateRandomDeck(5);
    }
    

    this.previewDeck = this.deckManager.searchDecksByName("D")[0];
  }

  ngOnInit(){
    this.deckManager.loadAllDeckNames();
  }

  private generateRandomDeck(numberOfCards: number = 1): void {
    function makeid(length: number): string {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
    }

    let deck = this.deckManager.generateDeck();
    deck.name = "Deck" + Object.keys(this.deckManager.loadedDecks).length + " " + makeid(5);

    for(let i = 0; i < numberOfCards; i++){
      deck.addCard({
        ID: makeid(10),
        isFavorite: false,
        frontText: "front: " + makeid(10),
        backText: "back: " + makeid(10),
      });
    }
  }

  changeFrontText(): void{
    function makeid(length: number): string {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
    }


    this.deckManager.searchDecksByName("D")[0].editCard({
      ID: Object.keys(this.deckManager.searchDecksByName("D")[0].cards)[0],
      frontText: "frontText " + makeid(2)
    })
  }
}
