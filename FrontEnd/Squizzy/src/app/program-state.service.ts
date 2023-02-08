import { Injectable } from '@angular/core';
import { DeckInfoProviderService } from './deck-info-provider.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramStateService {
  private _selectedDeck = new BehaviorSubject<string>("");

  constructor(private deckInfoProvider: DeckInfoProviderService) { }

  set selectedDeck(value: string){
    if(this.deckInfoProvider.deckNameList.includes(value)){
      this._selectedDeck.next(value);
    }else{
      this._selectedDeck.next("");
    }
  }

  get selectedDeck(): string{
    return this._selectedDeck.value;
  }

  get onSelectedDeckChange() : Observable<string>{
    return this._selectedDeck.asObservable();
  }
}
