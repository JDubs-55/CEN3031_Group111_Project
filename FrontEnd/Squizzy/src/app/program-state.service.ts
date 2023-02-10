import { Injectable } from '@angular/core';
import { Deck } from './MyClasses/Deck';
import { CardData } from './MyClasses/CardData';

@Injectable({
  providedIn: 'root'
})
export class ProgramStateService {
  selectedDeck?: Deck;


  constructor() { }


  getCardList(): readonly CardData[]{
    if(this.selectedDeck == undefined){
      return [];
    }
    return Object.values(this.selectedDeck.cards);
  }


}
