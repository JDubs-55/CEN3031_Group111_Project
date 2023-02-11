import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProgramStateService } from '../program-state.service';

import { Observable, map, startWith, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-deck-editor',
  templateUrl: './deck-editor.component.html',
  styleUrls: ['./deck-editor.component.css']
})
export class DeckEditorComponent {

  deckNameControl = new FormControl();


  saveDelay: Readonly<number> = 500;//milliseconds
  nameDelay?: Subscription;


  constructor(private programState: ProgramStateService){
    this.programState.onSelectedDeckChange.subscribe((deck)=>{
      this.deckNameControl.setValue(deck?.name);
    })

    this.deckNameControl.valueChanges.subscribe((value)=>{
      if(value == this.programState.selectedDeck?.name){
        return;
      }

      if(this.nameDelay != undefined){
        this.nameDelay.unsubscribe();
      }

      this.nameDelay = timer(this.saveDelay).subscribe(()=>{
        this.saveDeckName();
      });

      
    })
  }


  saveDeckName(): void{
    console.log("hi")
    if(this.programState.selectedDeck != undefined){
      this.programState.selectedDeck.name = this.deckNameControl.value;
    }
  }


}
