import { Component } from '@angular/core';

import { FormControl } from '@angular/forms';
import { ProgramStateService } from '../program-state.service';
import { DeckManagerService } from '../deck-manager.service';

import { Observable, map, startWith, Subscription, timer } from 'rxjs';

//TODO: Write comments
//TODO: Write unit tests

//If a deck editor is every closed. It will save the data to the server


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


  constructor(private programState: ProgramStateService, private deckManager: DeckManagerService) {

    //When the selected deck changes we need to
    this.programState.onSelectedDeckChange.subscribe((deck) => {
      this.deckNameControl.setValue(deck?.name);
      this.deckIDControl.setValue("Deck ID: " + deck?.ID)
      this.unselectCard();
    })

    //When the value listed as the deck name changes we need to
    this.deckNameControl.valueChanges.subscribe((value) => {
      //Check if the name has actually changed
      if (value == this.programState.selectedDeck?.name) {
        return;
      }

      //Refresh the delay timer
      if (this.nameDelay != undefined) {
        this.nameDelay.unsubscribe();
      }

      //Schedule the saving of the data to occur "saveDelay" milliseconds later
      this.nameDelay = timer(this.saveDelay).subscribe(() => {
        this.saveDeckName();
      });
    })

    //When the value listed for the front text changes we need to
    this.cardFrontTextControl.valueChanges.subscribe((value) => {
      //Check is a deck is selected
      if (this.programState.selectedDeck == undefined) {
        return;
      }
      //Check is a card has been selected
      if (this.selectedCardID == undefined) {
        return;
      }
      //Check that the card exists
      if (this.programState.selectedDeck.cards[this.selectedCardID] == undefined) {
        return;
      }
      //Check that front text actually changed
      if (value == this.programState.selectedDeck.cards[this.selectedCardID].FrontText) {
        return;
      }


      //Refresh the delay timer
      if (this.frontTextDelay != undefined) {
        this.frontTextDelay.unsubscribe();
      }

      //Schedule the saving of the data to occur "saveDelay" milliseconds later
      this.frontTextDelay = timer(this.saveDelay).subscribe(() => {
        this.saveCardFrontText();
      });

    })

    //When the value listed for the back text changes we need to
    this.cardBackTextControl.valueChanges.subscribe((value) => {
      //Check is a deck is selected
      if (this.programState.selectedDeck == undefined) {
        return;
      }
      //Check is a card has been selected
      if (this.selectedCardID == undefined) {
        return;
      }
      //Check that the card exists
      if (this.programState.selectedDeck.cards[this.selectedCardID] == undefined) {
        return;
      }
      //Check that front text actually changed
      if (value == this.programState.selectedDeck.cards[this.selectedCardID].BackText) {
        return;
      }


      //Refresh the delay timer
      if (this.backTextDelay != undefined) {
        this.backTextDelay.unsubscribe();
      }

      //Schedule the saving of the data to occur "saveDelay" milliseconds later
      this.backTextDelay = timer(this.saveDelay).subscribe(() => {
        this.saveCardBackText();
      });
    })

    //The controls for the deck ID and card ID are disabled because those are not allowed to be changed
    this.deckIDControl.disable();
    this.cardIDControl.disable();
  }

  ngOnDestroy() {
    //If the user clicks off the deck editor, save the data immeadiately (ignore the save delay)
    this.saveDeckName();
    this.saveCardFrontText();
    this.saveCardBackText();

    //This line saves all the decks that have changed data
    this.deckManager.saveDirty();
  }


  //These save functions push the displayed data to the local deck storage
  //These do not save the data to the server
  saveDeckName(): void {
    if (this.programState.selectedDeck != undefined) {
      this.programState.selectedDeck.name = this.deckNameControl.value;
    }
  }

  saveCardFrontText(): void {
    if (this.programState.selectedDeck != undefined && this.selectedCardID != "") {
      this.programState.selectedDeck.editCard({
        ID: this.selectedCardID,
        FrontText: this.cardFrontTextControl.value
      })
    }
  }

  saveCardBackText(): void {
    if (this.programState.selectedDeck != undefined && this.selectedCardID != "") {
      this.programState.selectedDeck.editCard({
        ID: this.selectedCardID,
        BackText: this.cardBackTextControl.value
      })
    }
  }

  selectCard(cardID: string): void {

    if(this.selectedCardID != cardID){
      this.saveCardFrontText();
      this.saveCardBackText();
    }

    this.selectedCardID = cardID;

    if (this.programState.selectedDeck != undefined) {
      let card = this.programState.selectedDeck.cards[cardID];
      this.cardIDControl.setValue("Card ID: " + cardID);
      this.cardFrontTextControl.setValue(card.FrontText);
      this.cardBackTextControl.setValue(card.BackText);
    }

  }

  unselectCard(): void {
    this.selectedCardID = "";
    this.cardIDControl.reset();
    this.cardFrontTextControl.reset();
    this.cardBackTextControl.reset();
  }

  makeNewCard(): void{
    function makeid(length: number): string {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
    }


    //Check if a deck has been selected
    if(this.programState.selectedDeck == undefined){
      return;
    }

    //Make a new ID for the new card
    let newID = makeid(10);

    //Ensure that it doesn't conflict with other cards
    let attempts = 0;
    while(this.programState.getCardList().some(card=>card.ID==newID)){
      newID = makeid(attempts++);
    }

    this.programState.selectedDeck.addCard({
      ID: newID,
      IsFavorite: false,
      FrontText: "",
      BackText: ""
    })

    this.selectCard(newID);
  }

  removeCard(): void{
    //Check if a deck has been selected
    if(this.programState.selectedDeck == undefined){
      return;
    }

    //Check if a card has been selected
    if(this.selectedCardID == ""){
      return;
    }

    this.programState.selectedDeck.removeCard({
      ID: this.selectedCardID
    });
    this.unselectCard();
  }

  async makeNewDeck(): Promise<void>{
    let newName = "Default Deck Name";
    
    let newDeck = await this.deckManager.generateDeck();
    newDeck.name = newName;
    this.programState.selectedDeck = newDeck;

    
  }

  deleteDeck(): void{
    this.programState.deleteSelectedDeck();
  }

  saveDeck(): void{
    if(this.programState.selectedDeck != undefined)
      this.deckManager.saveDecks(this.programState.selectedDeck.ID);
  }
}
