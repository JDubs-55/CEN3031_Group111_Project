import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CardData } from '../MyClasses/CardData';
import { ProgramStateService } from '../program-state.service';

@Component({
  selector: 'app-deck-editor',
  templateUrl: './deck-editor.component.html',
  styleUrls: ['./deck-editor.component.css']
})
export class DeckEditorComponent {
  deckNameControl = new FormControl();
  selectedCard?: CardData;

  constructor(public programState: ProgramStateService){
    this.programState.onSelectedDeckChange.subscribe(selectedDeck=>{
      if(selectedDeck == undefined){
        this.deckNameControl.disable();
        return;
      }

      this.deckNameControl.enable();
      this.deckNameControl.setValue(selectedDeck.name);
      
    });

    this.deckNameControl.valueChanges.subscribe(value=>{
      if(value == undefined || value == null || value == "") return;//If the value of the deck name is empty do not save that name as it is invalid
      if(this.programState.selectedDeck == undefined) return;//If there is no selected deck then nothing should happen when you change the name field
      if(value == this.programState.selectedDeck.name)return;//If the current value equals the current name of the selected deck, nothing needs to happen
      console.log(value);

      //TODO: Add a delay to this
      this.programState.selectedDeck.name = value;
    })
  }

  selectCard(card: CardData): void{
    this.selectedCard = card;
    console.log(this.selectedCard);
  }

  onCloseEditor(): void{
    //save deck
    if(this.deckNameControl.value == undefined || this.deckNameControl.value == null || this.deckNameControl.value == ""){
      //If the current listed deck name is empty
      //Prompt the user to give a valid name
      //Do no let the user continue off the deck editor until a valid name is given 
    }
  }
}
