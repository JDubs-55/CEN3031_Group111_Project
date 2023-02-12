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


  @Output() onSelectCard = new EventEmitter<string>();//This is an event just like how (click) is an event.


  constructor(public programState: ProgramStateService, private changeDetector: ChangeDetectorRef){
    //This forces the card list to change which cards are being displayed
    this.programState.onSelectedDeckChange.subscribe(()=>{
      this.changeDetector.detectChanges();
    })
  }


  //This runs when you click on one of the cards
  selectCard(cardID: string): void{
    this.onSelectCard.emit(cardID);//This fires off the event
  }
}
