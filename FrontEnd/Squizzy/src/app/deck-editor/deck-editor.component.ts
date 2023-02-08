import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {ProgramStateService} from "../program-state.service"
import { DeckInfoProviderService } from '../deck-info-provider.service';

@Component({
  selector: 'app-deck-editor',
  templateUrl: './deck-editor.component.html',
  styleUrls: ['./deck-editor.component.css']
})
export class DeckEditorComponent {

  deckNameForm = new FormControl('');
  cardNumberForm = new FormControl(0);
  frontTextForm = new FormControl('');
  backTextForm = new FormControl('');

  constructor(private programState: ProgramStateService, private deckInfo: DeckInfoProviderService){
    this.programState.onSelectedDeckChange.subscribe(()=>{
      this.loadDeck(this.programState.selectedDeck);
    })

    //this.loadDeck(this.programState.selectedDeck);
  }

  ngOnInit() {
    this.deckNameForm.valueChanges.subscribe((value)=>{
      console.log(value);
    });

    this.cardNumberForm.valueChanges.subscribe((value)=>{
      this.loadCard(this.cardNumber);
    });

    this.frontTextForm.valueChanges.subscribe((value)=>{
      if(this.programState.selectedDeck == ""){//The null deck may not be changed
        return;
      }

      if(value == null){
        value = "";
      }

      this.deckInfo.editCard(this.programState.selectedDeck, this.cardNumber, value)
    });

    this.backTextForm.valueChanges.subscribe((value)=>{
      if(this.programState.selectedDeck == ""){//The null deck may not be changed
        return;
      }

      if(value == null){
        value = "";
      }

      this.deckInfo.editCard(this.programState.selectedDeck, this.cardNumber, undefined, value)
    });
  }

  loadDeck(deckName: string): void{
    this.deckNameForm.setValue(this.programState.selectedDeck);
    this.loadCard(0);
  }

  loadCard(cardNumber: number): void{
    if(this.deckInfo.decks[this.programState.selectedDeck].cards[cardNumber] == undefined){
      this.frontTextForm.setValue("");
      this.backTextForm.setValue("");
    }else{
      this.frontTextForm.setValue(this.deckInfo.decks[this.programState.selectedDeck].cards[cardNumber].frontText);
      this.backTextForm.setValue(this.deckInfo.decks[this.programState.selectedDeck].cards[cardNumber].backText);
    }
    
  }


  get cardNumber(): number{
    if(this.cardNumberForm.value == null){
      return 0;
    }
    return this.cardNumberForm.value;
  }
}
