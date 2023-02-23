import { Component, ElementRef, ViewChild } from '@angular/core';

import { DeckManagerService } from './deck-manager.service';

import { DeckData, isDeckData } from './MyClasses/DeckData';
import { Deck } from './MyClasses/Deck';
import { CardData } from './MyClasses/CardData';
import { MatDrawer } from '@angular/material/sidenav';
import { DeckSelectorComponent } from './deck-selector/deck-selector.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('drawer') sideBarDrawer!: MatDrawer;
  @ViewChild('deckSelector') deckSelector!: DeckSelectorComponent;

  constructor(private deckManager: DeckManagerService) {
    
  }

  ngOnInit(){
    //this.deckManager.loadAllDeckNames();
  }

  dumpDeckData(): void{
    let data: DeckData[] = Object.values(this.deckManager.loadedDecks).map(deck=>deck.data);

    console.log(data);
  }

  openDeckSelector(): void{
    this.sideBarDrawer.toggle()
    this.deckSelector.onOpenDeckSelector();
  }
}
