import { Component  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProgramStateService } from '../program-state.service';
import { Deck } from '../MyClasses/Deck';


import { Observable, map, startWith, Subscription, timer } from 'rxjs';
import { DeckManagerService } from '../deck-manager.service';
import { PageEvent } from '@angular/material/paginator';


//This component will load decks as the user searches for them
//If the deck cannot be found locally or on the server, but it is in the autocomplete list, then upon searching for that deck those entries will be removed
//TODO: write unit tests
//TODO: write comments


//Some user stories that were handled
//I want to be able to get a list of the available decks
//I want to be able to search through the list of available decks
//I want to be able to see what is in the deck I am selecting
//I want the cycling of the previews to be synced. (yes this was an issue)




@Component({
  selector: 'app-selected-deck-display',
  templateUrl: './selected-deck-display.component.html',
  styleUrls: ['./selected-deck-display.component.css']
})
export class SelectedDeckDisplayComponent {
  get options(): readonly string[] {
    return this.deckManager.allDeckNames;
  }


  myControl = new FormControl();
  get filteredOptions(): string[]{
    return this.deckManager.searchDeckNames(this.selectedDeckName).filter(name=>name!="");
  }
  selectedDeckName = "";

  deckOptions: Deck[] = []; 
  pageSize: number = 5;
  pageIndex: number = 0;


  //The delay is used to prevent a server query every time the user presses a key
  delay?: Subscription;
  refreshDelay: Readonly<number> = 500;


  constructor(public programState: ProgramStateService, private deckManager: DeckManagerService) {
    this.updateDeckOptions();
  }

  ngOnInit() {
    //Updates the selected deck for the program
    this.myControl.valueChanges.subscribe((value) => {
      if (value == null) {
        this.selectedDeckName = "";
      } else {
        this.selectedDeckName = value;
      }


      //This delay is to prevent the server from being queried every time the user types a key into the search box
      if(this.delay != undefined){
        this.delay.unsubscribe();
      }

      this.delay = timer(this.refreshDelay).subscribe(()=>{
        this.updateDeckOptions();
      });
    });

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue) && option != "");
  }

  handlePageEvent(e: PageEvent) {
    let pageEvent = e;
    let length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    while(this.pageIndex * this.pageSize > length){
      this.pageIndex--;
    }

    
    this.updateDeckOptions();
  }

  updateDeckOptions(): void{
    if(this.selectedDeckName != ""){//When the selected deck name changes. The decks to be selected from need to be loaded
      this.deckManager.loadDecksByName(this.deckManager.searchDeckNames(this.selectedDeckName));
    }

    this.deckOptions = this.deckManager.searchDecksByName(this.selectedDeckName);

    //This prevents every deck from being requested from the back end
    if(this.selectedDeckName == ""){
      this.deckOptions = [];
    }

    while(this.pageIndex * this.pageSize > this.deckOptions.length){
      this.pageIndex--;
    }

  }

  selectDeck(deck: Deck): void{
    this.programState.selectedDeck = deck;
  } 
}
