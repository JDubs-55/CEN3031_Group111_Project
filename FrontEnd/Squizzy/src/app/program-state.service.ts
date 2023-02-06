import { Injectable } from '@angular/core';
import { FlashCardControllerService } from './flash-card-controller.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramStateService {
  private _selectedDeck = new BehaviorSubject<string>("");

  constructor(private deckInfoProvider: FlashCardControllerService) { }

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
