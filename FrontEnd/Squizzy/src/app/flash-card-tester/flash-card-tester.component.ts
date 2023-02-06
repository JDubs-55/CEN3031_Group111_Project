import { Component } from '@angular/core';
import { ProgramStateService } from '../program-state.service';

@Component({
  selector: 'app-flash-card-tester',
  templateUrl: './flash-card-tester.component.html',
  styleUrls: ['./flash-card-tester.component.css']
})
export class FlashCardTesterComponent {
  currentCardNumber: number = 0;

  constructor(public programState: ProgramStateService){

  }


  nextCard(): void{
    this.currentCardNumber++;
  }
}
