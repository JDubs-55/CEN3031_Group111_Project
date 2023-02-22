import { Injectable } from '@angular/core';
import { Deck } from './MyClasses/Deck';
import { CardData } from './MyClasses/CardData';
import { DeckManagerService } from './deck-manager.service';
import { BehaviorSubject, Observable } from "rxjs";

//List of things that can happen



@Injectable({
  providedIn: 'root'
})
export class ProgramStateService {
  private _selectedDeck = new BehaviorSubject<Deck | undefined>(undefined);


  constructor(private deckManager: DeckManagerService) {

    //Whenever a deck is unloaded you need to check if the selected deck was unloaded
    //If the selected deck gets unloaded, it should be set to undefined
    this.deckManager.onUnloadDeck.subscribe(deck=>{
      if(this.selectedDeck == deck){
        this.selectedDeck = undefined;
      }
    })
   }


  //This returns the list of CardData for the selected deck
  getCardList(): readonly CardData[]{
    if(this.selectedDeck == undefined){
      return [];
    }
    return Object.values(this.selectedDeck.cards);
  }


  //These functions should be used exclusively for interacting with the selected deck
  get selectedDeck(): Deck | undefined{
    return this._selectedDeck.value;
  }

  set selectedDeck(deck: Deck | undefined) {
    if(deck != undefined){
      this._selectedDeck.next(this.deckManager.getDeck(deck.ID));//This line ensures that the deck that is set as selected is actually loaded
    }else{
      this._selectedDeck.next(undefined);//This line ensures that the deck that is set as selected is actually loaded
    }
  }
  

  get onSelectedDeckChange(): Observable<Deck | undefined>{
    return this._selectedDeck.asObservable();
  }


  //This does exactly what it is named
  deleteSelectedDeck(): void{
    if(this.selectedDeck == undefined){
      return;
    }

    if(confirm("Are you certain you want to delete this deck.\nYou cannot undo this action.")){
      this.deckManager.deleteDecks(this.selectedDeck.ID);
      this.selectedDeck = undefined;
    }
  }
}
