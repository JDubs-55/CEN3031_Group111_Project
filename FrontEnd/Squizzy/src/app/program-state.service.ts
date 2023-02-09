import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DeckInfoService } from './deck-info.service';
import { Deck } from './MyClasses/Deck';


@Injectable({
  providedIn: 'root'
})
export class ProgramStateService {

  

  constructor(private deckInfo: DeckInfoService) {
    this.deckInfo.getDecksByID(this.deckInfo.getAllDeckIDs()[0])
  }


  //Deck Selection
  private _selectedDeckID = new BehaviorSubject<string>("");

  get selectedDeckID(): string {
    return this._selectedDeckID.value;
  }

  set selectedDeckID(ID: string){
    this._selectedDeckID.next(ID);
  }

  get onSelectedDeckChange(): Observable<string>{
    return this._selectedDeckID.asObservable();
  }


  get selectedDeck(): Deck{
    return this.deckInfo.getDecksByID(this.selectedDeckID)[0];
  }

}
