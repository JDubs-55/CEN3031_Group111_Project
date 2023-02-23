import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DeckManagerService } from '../deck-manager.service';
import { CardData } from '../MyClasses/CardData';
import { ProgramStateService } from '../program-state.service';


//Perhaps a delay should be added to the updating of text data on the front end
//This would require a function that saves the temporary data immediately upon switching off the editor
//Tracking when this event occurs could be more effort than it is worth

@Component({
  selector: 'app-deck-editor',
  templateUrl: './deck-editor.component.html',
  styleUrls: ['./deck-editor.component.css']
})
export class DeckEditorComponent {
  deckNameControl = new FormControl();
  selectedCard?: CardData;

  isFavoriteControl = new FormControl();

  newTagControl = new FormControl();

  frontTextControl = new FormControl();
  backTextControl = new FormControl();


  get tags(): Readonly<string[]>{
    if(this.programState.selectedDeck == undefined){
      return [];
    }

    return Array.from(this.programState.selectedDeck.tags).sort();
  }

  constructor(public programState: ProgramStateService, private deckManager: DeckManagerService){
    this.programState.onSelectedDeckChange.subscribe(selectedDeck=>{
      if(selectedDeck == undefined){
        this.deckNameControl.disable();
        return;
      }

      this.selectedCard = undefined;

      this.deckNameControl.enable();
      this.deckNameControl.setValue(selectedDeck.name);
      this.isFavoriteControl.setValue(selectedDeck.isFavorite);

      this.frontTextControl.setValue("");
      this.backTextControl.setValue("");
    });

    this.deckNameControl.valueChanges.subscribe(value=>{
      if(value == undefined || value == null || value == "") return;//If the value of the deck name is empty do not save that name as it is invalid
      if(this.programState.selectedDeck == undefined) return;//If there is no selected deck then nothing should happen when you change the name field
      if(value == this.programState.selectedDeck.name)return;//If the current value equals the current name of the selected deck, nothing needs to happen

      this.programState.selectedDeck.name = value;
    })

    this.isFavoriteControl.valueChanges.subscribe(value=>{
      if(this.programState.selectedDeck == undefined) return;//If there is no selected deck then nothing should happen when you change the name field
      if(value == this.programState.selectedDeck.isFavorite)return;//If the current value equals the current name of the selected deck, nothing needs to happen

      this.programState.selectedDeck.isFavorite = value;
    })

    this.frontTextControl.valueChanges.subscribe(value=>{
      if(value == undefined || value == null){
        value = "";
      }
      if(this.programState.selectedDeck == undefined) return;//If there is no selected deck then nothing should happen when you change the name field
      if(this.selectedCard == undefined) return;//If no card is selected then ingore
      if(value == this.selectedCard.frontText)return;//If the current value equals the current name of the selected deck, nothing needs to happen

      this.selectedCard.frontText = value;

      this.programState.selectedDeck.editCard(this.selectedCard);
    })

    this.backTextControl.valueChanges.subscribe(value=>{
      if(value == undefined || value == null){
        value = "";
      }
      if(this.programState.selectedDeck == undefined) return;//If there is no selected deck then nothing should happen when you change the name field
      if(this.selectedCard == undefined) return;//If no card is selected then ingore
      if(value == this.selectedCard.backText)return;//If the current value equals the current name of the selected deck, nothing needs to happen

      this.selectedCard.backText = value;

      this.programState.selectedDeck.editCard(this.selectedCard);
    })

    this.programState.selectedPage = "Deck Editor";
  }

  selectCard(card: CardData | undefined): void{
    this.selectedCard = card;
    console.log(this.selectedCard);

    if(card != undefined){
      this.frontTextControl.setValue(card.frontText);
      this.backTextControl.setValue(card.backText);
    }else{
      this.frontTextControl.setValue("");
      this.backTextControl.setValue("");
    }
    
  }

  addTag(): void{
    let value = this.newTagControl.value;
    if(value == undefined || value == null || value == "") return;//If the value of the new tag is empty do not save that tag as it is invalid
    if(this.programState.selectedDeck == undefined) return;//If there is no selected deck, then there is nothing that can be changed



    this.programState.selectedDeck.tags.add(value);
  }

  removeTag(value: string): void{
    if(value == undefined || value == null || value == "") return;//If the value of the new tag is empty do not save that tag as it is invalid
    if(this.programState.selectedDeck == undefined) return;//If there is no selected deck, then there is nothing that can be changed

    this.programState.selectedDeck.tags.delete(value);

  }

  save(){
    this.deckManager.saveDirty();
  }

  addCard(){
    if(this.programState.selectedDeck == undefined) return;//If no deck is selected there is nothing to do

    this.selectCard(this.programState.selectedDeck.addCard());
  }

  removeCard(){
    if(this.programState.selectedDeck == undefined) return;//If no deck is selected there is nothing to do
    if(this.selectedCard == undefined) return;//If no card is selected there is nothing to do

    this.programState.selectedDeck.removeCard(this.selectedCard);
    this.selectCard(undefined);
  }
}
