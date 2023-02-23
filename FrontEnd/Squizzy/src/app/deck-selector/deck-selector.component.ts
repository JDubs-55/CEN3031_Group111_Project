import { Component, EventEmitter, Output } from '@angular/core';
import { DeckManagerService } from '../deck-manager.service';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith, Subscription, timer } from 'rxjs';
import { Deck } from '../MyClasses/Deck';
import { ProgramStateService } from '../program-state.service';

@Component({
  selector: 'app-deck-selector',
  templateUrl: './deck-selector.component.html',
  styleUrls: ['./deck-selector.component.css']
})
export class DeckSelectorComponent {
  @Output() close = new EventEmitter<void>();//This exists solely so that the application knows when to close the deck selector (Do not use for any other purpose!)

  deckNameControl = new FormControl();
  get filteredOptions(): string[] {
    return this.deckManager.searchDeckNames(this.deckNameControl.value).filter(name => name != "").sort();
  }

  loadDecksDelay?: Subscription;
  loadDecksDelayTime: Readonly<number> = 550;//milliseconds

  
  validDecks: Readonly<Deck[]> = [];

  constructor(private deckManager: DeckManagerService, private programState: ProgramStateService){

    //When the searched deck name stops changing
    //The front end will query the back end for all the decks that contain the contents of the search box
    //It will then refresh the list of used names, to stay up to date
    this.deckNameControl.valueChanges.subscribe(value=>{
      
      //This delay is to prevent the server from being queried every time the user types a key into the search box
      if (this.loadDecksDelay != undefined) {
        this.loadDecksDelay.unsubscribe();
      }

      this.loadDecksDelay = timer(this.loadDecksDelayTime).subscribe(() => {
        //When the selected deck name changes. The decks to be selected from need to be loaded
        //Only load the deck when the searched name changed
        if (this.deckNameControl.value != null && this.deckNameControl.value != "") {
          this.deckManager.loadDecksByName(this.deckManager.searchDeckNames(this.deckNameControl.value)).then(() => {
            this.validDecks = this.deckManager.searchDecksByName(this.deckNameControl.value);
            this.refreshAvailableDeckNames();//The list of availible decks should update
          });
        }else{
          this.validDecks = this.deckManager.searchDecksByName(this.deckNameControl.value);
          this.refreshAvailableDeckNames();
        }
      });
    })
  }

  closeDeckSelector(): void {
    this.close.emit();
    this.onCloseDeckSelector();
  }

  refreshAvailableDeckNames(): void{
    this.deckManager.loadAllDeckNames();
    console.log("Refreshed search list");
  }

  onClickSearchBar(): void{
    //This delay is to prevent the server from being queried every time the user types a key into the search box
    if (this.loadDecksDelay != undefined) {
      this.loadDecksDelay.unsubscribe();
    }

    this.loadDecksDelay = timer(this.loadDecksDelayTime).subscribe(() => {
      //When the selected deck name changes. The decks to be selected from need to be loaded
      //Only load the deck when the searched name changed
      if (this.deckNameControl.value != null && this.deckNameControl.value != "") {
        this.deckManager.loadDecksByName(this.deckManager.searchDeckNames(this.deckNameControl.value)).then(() => {
          this.updateValidDecks();
          this.refreshAvailableDeckNames();//The list of availible decks should update
        });
      }else{
        this.updateValidDecks();
        this.refreshAvailableDeckNames();
      }
    });
  }

  updateValidDecks(): void{
    this.validDecks = this.deckManager.searchDecksByName(this.deckNameControl.value).sort((a, b)=>a.ID.localeCompare(b.ID));
  }


  //This is where behaviors that happen on open and close should be defined
  onOpenDeckSelector(): void {
    console.log("opened deck selector")
    //Load cards
    this.refreshAvailableDeckNames();
  }

  onCloseDeckSelector(): void {
    console.log("closed deck selector")
    //Save decks
  }


  selectDeck(deck: Deck): void{
    this.programState.selectedDeck = deck;
  }
}
