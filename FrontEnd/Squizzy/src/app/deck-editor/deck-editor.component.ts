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

  deckIDControl = new FormControl();
  deckNameControl = new FormControl();

  cardIDControl = new FormControl();
    cardFrontTextControl = new FormControl();
  cardBackTextControl = new FormControl();

  selectedCardID: string = "";


  saveDelay: Readonly<number> = 500;//milliseconds
  nameDelay?: Subscription;
  frontTextDelay?: Subscription;
  backTextDelay?: Subscription;


  constructor(private programState: ProgramStateService){
    this.programState.onSelectedDeckChange.subscribe((deck)=>{
      this.deckNameControl.setValue(deck?.name);
      this.deckIDControl.setValue(deck?.ID)
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

    this.cardFrontTextControl.valueChanges.subscribe((value)=>{
      //Do nothing if there is no selected deck or if the text did not actually change
      if(this.programState.selectedDeck == undefined){
        return;
      }
      if(value == this.programState.selectedDeck.cards[this.selectedCardID].frontText){
        return;
      }


      if(this.frontTextDelay != undefined){
        this.frontTextDelay.unsubscribe();
      }

      this.frontTextDelay = timer(this.saveDelay).subscribe(()=>{
        this.saveCardFrontText();
      });

    })

    this.cardBackTextControl.valueChanges.subscribe((value)=>{
      //Do nothing if there is no selected deck or if the text did not actually change
      if(this.programState.selectedDeck == undefined){
        return;
      }
      if(value == this.programState.selectedDeck.cards[this.selectedCardID].backText){
        return;
      }

      if(this.backTextDelay != undefined){
        this.backTextDelay.unsubscribe();
      }

      this.backTextDelay = timer(this.saveDelay).subscribe(()=>{
        this.saveCardBackText();
      });
    })

    this.deckIDControl.disable();
    this.cardIDControl.disable();
  }

  ngOnDestroy(){
    //If the user clicks off the deck editor, save the data immeadiately (ignore the save delay)
    this.saveDeckName();
    this.saveCardFrontText();
    this.saveCardBackText();
  }


  saveDeckName(): void{
    if(this.programState.selectedDeck != undefined){
      this.programState.selectedDeck.name = this.deckNameControl.value;
    }
  }

  saveCardFrontText(): void{
    if(this.programState.selectedDeck != undefined && this.selectedCardID != ""){
      this.programState.selectedDeck.editCard({
        ID: this.selectedCardID,
        frontText: this.cardFrontTextControl.value
      })
    }
  }

  saveCardBackText(): void{
    if(this.programState.selectedDeck != undefined && this.selectedCardID != ""){
      this.programState.selectedDeck.editCard({
        ID: this.selectedCardID,
        backText: this.cardBackTextControl.value
      })
    }
  }

  selectCard(cardID: string): void{
    this.selectedCardID = cardID;

    if(this.programState.selectedDeck != undefined){
      let card = this.programState.selectedDeck.cards[cardID];
      this.cardIDControl.setValue(cardID);
      this.cardFrontTextControl.setValue(card.frontText);
      this.cardBackTextControl.setValue(card.backText);
    }
    
  }
}
