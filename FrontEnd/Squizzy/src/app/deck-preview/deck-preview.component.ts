import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { CardData } from '../MyClasses/CardData';
import { Deck } from '../MyClasses/Deck';
import { ProgramStateService } from '../program-state.service';

@Component({
  selector: 'app-deck-preview',
  templateUrl: './deck-preview.component.html',
  styleUrls: ['./deck-preview.component.css']
})
export class DeckPreviewComponent {
  @Output() myClick = new EventEmitter<void>();//This exists solely so that the application knows when to close the deck selector (Do not use for any other purpose!)

  @Input() deck?: Deck;
  colorClass: string = "";

  get cards(): Readonly<CardData[]>{
    if(this.deck != undefined)
      return Object.values(this.deck.cards);

    return [];
  }

  get name(): Readonly<string>{
    if(this.deck != undefined)
      return this.deck.name;

    return "";
  }

  constructor(private programState: ProgramStateService){
    this.programState.onSelectedDeckChange.subscribe(selectedDeck=>{
      if(selectedDeck != undefined && selectedDeck.id == this.deck?.id){
        this.colorClass = "selected";
      }else{
        this.colorClass = "";
      }
      
    })
  }

  ngOnInit(){
    
  }

  onClick(){
    this.myClick.emit();
  }

}
