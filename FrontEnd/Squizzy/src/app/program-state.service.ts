import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProgramStateService {

  

  constructor() { }


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


  

}
