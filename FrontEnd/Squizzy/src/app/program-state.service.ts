import { Injectable } from '@angular/core';
import { Deck } from './MyClasses/Deck';
import { CardData } from './MyClasses/CardData';
import { DeckManagerService } from './deck-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ProgramStateService {
  private _selectedDeck?: Deck;


  constructor(private deckManager: DeckManagerService) { }


  getCardList(): readonly CardData[]{
    if(this.selectedDeck == undefined){
      return [];
    }
    return Object.values(this.selectedDeck.cards);
  }

  get selectedDeck(): Deck | undefined{
    return this._selectedDeck;
  }

  set selectedDeck(deck: Deck | undefined) {
    if(deck != undefined){
      this._selectedDeck = this.deckManager.getDeck(deck.ID);//This line ensures that the deck that is set as selected is actually loaded
      console.log(this._selectedDeck.cards)
    }
    
  }
  


}
