import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CardData } from '../MyClasses/CardData';
import { ProgramStateService } from '../program-state.service';


//TODO: add comments
//TODO: write unit tests


@Component({
  selector: 'app-card-selector',
  templateUrl: './card-selector.component.html',
  styleUrls: ['./card-selector.component.css']
})
export class CardSelectorComponent {

  @Output() onSelectCard = new EventEmitter<string>();//Hopefully this allows me to emit an event every time the selected card changes


  constructor(public programState: ProgramStateService, private changeDetector: ChangeDetectorRef){
    this.programState.onSelectedDeckChange.subscribe(()=>{
      this.changeDetector.detectChanges();
    })
  }

  selectRandom(): void{
    if(this.programState.selectedDeck != undefined){
      let cardIDs = Object.keys(this.programState.selectedDeck.cards);
      this.selectCard(cardIDs[Math.floor(Math.random() * cardIDs.length)]);
    }
    
  }


  selectCard(cardID: string): void{
    this.onSelectCard.emit(cardID);
  }
}
